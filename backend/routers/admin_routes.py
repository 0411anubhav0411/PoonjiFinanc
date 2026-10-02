from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Response

from lib.db import db
from lib.mail import create_notification
from lib.security import new_id, require_role, utcnow
from lib.storage import get_object_async
from models.schemas import (
    APP_STATUSES,
    ApplicationStatusUpdate,
    BlogIn,
    DocStatusUpdate,
    NoteCreate,
    PartnerStatusUpdate,
    RateIn,
    UpdateIn,
)

router = APIRouter(tags=["admin"])
admin = Depends(require_role("admin"))


@router.get("/admin/overview")
async def overview(user=admin):
    week_ago = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    return {
        "customers": await db.users.count_documents({"role": "customer"}),
        "customers_new": await db.users.count_documents({"role": "customer", "created_at": {"$gte": week_ago}}),
        "partners": await db.users.count_documents({"role": "partner"}),
        "partners_pending": await db.users.count_documents({"role": "partner", "partner_status": "pending"}),
        "enquiries": await db.enquiries.count_documents({}),
        "callbacks": await db.callbacks.count_documents({}),
        "job_applications": await db.applications.count_documents({}),
        "career_applications": await db.career_applications.count_documents({}),
        "portal_applications": await db.portal_applications.count_documents({}),
        "portal_applications_open": await db.portal_applications.count_documents({"status": {"$nin": ["completed"]}}),
        "documents": await db.documents.count_documents({"is_deleted": False}),
        "documents_pending": await db.documents.count_documents({"is_deleted": False, "status": {"$in": ["uploaded", "under_review", "replacement_required"]}}),
        "rates": await db.rates.count_documents({"published": True}),
        "updates": await db.updates.count_documents({"published": True}),
    }


@router.get("/admin/customers")
async def list_customers(user=admin):
    out = []
    async for u in db.users.find({"role": "customer"}, {"_id": 0, "password_hash": 0}).sort("created_at", -1):
        docs = await db.documents.count_documents({"customer_id": u["id"], "is_deleted": False})
        apps = await db.portal_applications.count_documents({"customer_id": u["id"]})
        pending = await db.documents.count_documents({"customer_id": u["id"], "is_deleted": False, "status": {"$in": ["uploaded", "under_review", "replacement_required"]}})
        out.append({**u, "documents": docs, "applications": apps, "documents_pending": pending})
    return out


@router.get("/admin/career-applications")
async def list_career_applications(user=admin):
    return await db.career_applications.find({}, {"_id": 0}).sort("submitted_at", -1).to_list(200)


@router.get("/admin/career-applications/{app_id}/download")
async def download_career_application(app_id: str, user=admin):
    app = await db.career_applications.find_one({"id": app_id})
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    data, content_type = await get_object_async(app["resume_path"])
    return Response(
        content=data,
        media_type=content_type or "application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{app["resume_filename"]}"'},
    )


@router.get("/admin/customers/{cid}")
async def customer_file(cid: str, user=admin):
    cust = await db.users.find_one({"id": cid, "role": "customer"}, {"_id": 0, "password_hash": 0})
    if not cust:
        raise HTTPException(status_code=404, detail="Customer not found")
    documents = await db.documents.find({"customer_id": cid, "is_deleted": False}, {"_id": 0}).sort("created_at", -1).to_list(200)
    applications = await db.portal_applications.find({"customer_id": cid}, {"_id": 0}).sort("created_at", -1).to_list(100)
    notes = await db.notes.find({"customer_id": cid}, {"_id": 0}).sort("created_at", -1).to_list(100)
    enquiries = await db.enquiries.find({"email": cust["email"]}, {"_id": 0}).to_list(50)
    return {"customer": cust, "documents": documents, "applications": applications, "notes": notes, "enquiries": enquiries}


@router.post("/admin/customers/{cid}/notes", status_code=201)
async def add_note(cid: str, body: NoteCreate, user=admin):
    note = {"id": new_id(), "customer_id": cid, "text": body.text, "author": user.get("email"), "created_at": utcnow()}
    await db.notes.insert_one(note)
    note.pop("_id", None)
    return note


@router.patch("/admin/documents/{doc_id}")
async def set_document_status(doc_id: str, body: DocStatusUpdate, user=admin):
    doc = await db.documents.find_one({"id": doc_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    await db.documents.update_one({"id": doc_id}, {"$set": {"status": body.status, "note": body.note}})
    labels = {
        "under_review": "is under review",
        "verified": "has been verified",
        "rejected": "was rejected",
        "replacement_required": "needs a replacement",
        "uploaded": "was received",
    }
    text = f"Your document {doc['doc_type']} {labels[body.status]}."
    if body.note:
        text += f" Note: {body.note}"
    await create_notification(doc["customer_id"], f"Document update — {doc['doc_type']}", text)
    return {"ok": True}


@router.patch("/admin/applications/{app_id}")
async def set_application_status(app_id: str, body: ApplicationStatusUpdate, user=admin):
    if body.status not in APP_STATUSES:
        raise HTTPException(status_code=400, detail="Unknown application status")
    app = await db.portal_applications.find_one({"id": app_id})
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    await db.portal_applications.update_one(
        {"id": app_id}, {"$set": {"status": body.status, "note": body.note, "updated_at": utcnow()}}
    )
    text = f"Your {app['product']} application status changed."
    if body.note:
        text += f" Note: {body.note}"
    await create_notification(app["customer_id"], f"Application update — {app['product']}", text)
    return {"ok": True}


@router.get("/admin/partners")
async def list_partners(user=admin):
    return await db.users.find({"role": "partner"}, {"_id": 0, "password_hash": 0}).sort("created_at", -1).to_list(500)


@router.patch("/admin/partners/{pid}")
async def set_partner_status(pid: str, body: PartnerStatusUpdate, user=admin):
    partner = await db.users.find_one({"id": pid, "role": "partner"})
    if not partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    await db.users.update_one({"id": pid}, {"$set": {"partner_status": body.status}})
    text = f"Your partner account status is now: {body.status}."
    if body.note:
        text += f" Note: {body.note}"
    await create_notification(pid, "Partner account update", text)
    return {"ok": True}


@router.get("/admin/rates")
async def admin_rates(user=admin):
    return await db.rates.find({}, {"_id": 0}).sort("updated_at", -1).to_list(500)


@router.post("/admin/rates", status_code=201)
async def create_rate(body: RateIn, user=admin):
    doc = {"id": new_id(), **body.model_dump(), "updated_at": utcnow()}
    await db.rates.insert_one(doc)
    doc.pop("_id", None)
    return doc


@router.patch("/admin/rates/{rate_id}")
async def update_rate(rate_id: str, body: RateIn, user=admin):
    res = await db.rates.update_one({"id": rate_id}, {"$set": {**body.model_dump(), "updated_at": utcnow()}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Rate not found")
    return {"ok": True}


@router.delete("/admin/rates/{rate_id}")
async def delete_rate(rate_id: str, user=admin):
    res = await db.rates.delete_one({"id": rate_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Rate not found")
    return {"ok": True}


@router.get("/admin/updates")
async def admin_updates(user=admin):
    return await db.updates.find({}, {"_id": 0}).sort("created_at", -1).to_list(300)


@router.post("/admin/updates", status_code=201)
async def create_update(body: UpdateIn, user=admin):
    doc = {"id": new_id(), **body.model_dump(), "created_at": utcnow()}
    await db.updates.insert_one(doc)
    doc.pop("_id", None)
    return doc


@router.patch("/admin/updates/{update_id}")
async def edit_update(update_id: str, body: UpdateIn, user=admin):
    res = await db.updates.update_one({"id": update_id}, {"$set": body.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Update not found")
    return {"ok": True}


@router.delete("/admin/updates/{update_id}")
async def delete_update(update_id: str, user=admin):
    res = await db.updates.delete_one({"id": update_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Update not found")
    return {"ok": True}


@router.get("/admin/blog")
async def admin_blog(user=admin):
    return await db.blog_posts.find({}, {"_id": 0}).sort("created_at", -1).to_list(300)


@router.post("/admin/blog", status_code=201)
async def create_blog_post(body: BlogIn, user=admin):
    if await db.blog_posts.find_one({"slug": body.slug}):
        raise HTTPException(status_code=409, detail="A post with this slug already exists")
    doc = {"id": new_id(), **body.model_dump(), "created_at": utcnow()}
    await db.blog_posts.insert_one(doc)
    doc.pop("_id", None)
    return doc


@router.patch("/admin/blog/{post_id}")
async def edit_blog_post(post_id: str, body: BlogIn, user=admin):
    existing = await db.blog_posts.find_one({"slug": body.slug, "id": {"$ne": post_id}})
    if existing:
        raise HTTPException(status_code=409, detail="A post with this slug already exists")
    res = await db.blog_posts.update_one({"id": post_id}, {"$set": body.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"ok": True}


@router.delete("/admin/blog/{post_id}")
async def delete_blog_post(post_id: str, user=admin):
    res = await db.blog_posts.delete_one({"id": post_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"ok": True}
