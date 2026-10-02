import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, Response, UploadFile

from lib.db import db
from lib.mail import create_notification, notify_admins
from lib.security import get_current_user, new_id, utcnow
from lib.storage import APP_NAME, put_object_async, get_object_async
from models.schemas import APP_STATUSES, PortalApplicationCreate, ProfileUpdate

router = APIRouter(tags=["portal"])

ALLOWED_EXT = {"pdf", "jpg", "jpeg", "png", "webp"}
MAX_SIZE = 10 * 1024 * 1024

PROFILE_FIELDS = [
    "dob", "gender", "address", "city", "state", "pin", "employment_type", "occupation",
    "company", "income", "pan", "designation", "website", "description", "services",
    "experience_years", "category", "business_address",
]


@router.get("/portal/me")
async def portal_me(user: dict = Depends(get_current_user)):
    docs = await db.documents.count_documents({"customer_id": user["id"], "is_deleted": False})
    apps = await db.portal_applications.count_documents({"customer_id": user["id"]})
    unread = await db.notifications.count_documents({"user_id": user["id"], "read": False})
    return {"user": user, "documents": docs, "applications": apps, "unread": unread}


@router.patch("/portal/profile")
async def update_profile(body: ProfileUpdate, user: dict = Depends(get_current_user)):
    data = {k: v for k, v in body.model_dump().items() if v is not None}
    updates: dict = {}
    for key in ("name", "mobile"):
        if key in data:
            updates[key] = data.pop(key)
    for key in PROFILE_FIELDS:
        if key in data:
            updates[f"profile.{key}"] = data[key]
    if updates:
        await db.users.update_one({"id": user["id"]}, {"$set": updates})
    return await db.users.find_one({"id": user["id"]}, {"_id": 0, "password_hash": 0})


@router.get("/portal/documents")
async def list_documents(user: dict = Depends(get_current_user)):
    return await db.documents.find(
        {"customer_id": user["id"], "is_deleted": False}, {"_id": 0}
    ).sort("created_at", -1).to_list(200)


@router.post("/portal/documents", status_code=201)
async def upload_document(
    file: UploadFile = File(...),
    category: str = Form(...),
    doc_type: str = Form(...),
    user: dict = Depends(get_current_user),
):
    ext = file.filename.rsplit(".", 1)[-1].lower() if file.filename and "." in file.filename else ""
    if ext not in ALLOWED_EXT:
        raise HTTPException(status_code=400, detail="Only PDF, JPG, PNG or WebP files are allowed")
    data = await file.read()
    if len(data) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 10 MB)")
    path = f"{APP_NAME}/docs/{user['id']}/{uuid.uuid4()}.{ext}"
    result = await put_object_async(path, data, file.content_type or "application/octet-stream")
    doc = {
        "id": new_id(),
        "customer_id": user["id"],
        "category": category,
        "doc_type": doc_type,
        "filename": file.filename,
        "storage_path": result["path"],
        "content_type": file.content_type,
        "size": result["size"],
        "status": "uploaded",
        "note": None,
        "is_deleted": False,
        "created_at": utcnow(),
    }
    await db.documents.insert_one(doc)
    await notify_admins("New document uploaded", f"{user['name']} uploaded {doc_type} ({category}).")
    doc.pop("_id", None)
    return doc


@router.get("/portal/documents/{doc_id}/download")
async def download_document(doc_id: str, user: dict = Depends(get_current_user)):
    doc = await db.documents.find_one({"id": doc_id, "is_deleted": False})
    if not doc or (doc["customer_id"] != user["id"] and user.get("role") != "admin"):
        raise HTTPException(status_code=404, detail="Document not found")
    data, content_type = await get_object_async(doc["storage_path"])
    return Response(
        content=data,
        media_type=doc.get("content_type") or content_type,
        headers={"Content-Disposition": f'attachment; filename="{doc["filename"]}"'},
    )


@router.get("/portal/applications")
async def list_applications(user: dict = Depends(get_current_user)):
    return await db.portal_applications.find(
        {"customer_id": user["id"]}, {"_id": 0}
    ).sort("created_at", -1).to_list(100)


@router.post("/portal/applications", status_code=201)
async def create_application(body: PortalApplicationCreate, user: dict = Depends(get_current_user)):
    doc = {
        "id": new_id(),
        "customer_id": user["id"],
        **body.model_dump(),
        "status": "submitted",
        "note": None,
        "created_at": utcnow(),
        "updated_at": utcnow(),
    }
    await db.portal_applications.insert_one(doc)
    await notify_admins("New application", f"{user['name']} started an application: {body.product}.")
    doc.pop("_id", None)
    return doc


@router.get("/portal/notifications")
async def list_notifications(user: dict = Depends(get_current_user)):
    return await db.notifications.find(
        {"user_id": user["id"]}, {"_id": 0}
    ).sort("created_at", -1).to_list(100)


@router.post("/portal/notifications/read-all")
async def read_all_notifications(user: dict = Depends(get_current_user)):
    await db.notifications.update_many({"user_id": user["id"], "read": False}, {"$set": {"read": True}})
    return {"ok": True}
