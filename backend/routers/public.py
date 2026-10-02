import re

from fastapi import APIRouter

from lib.db import db

router = APIRouter(tags=["public"])


@router.get("/rates")
async def public_rates(category: str | None = None):
    query: dict = {"published": True}
    if category:
        query["category"] = category
    return await db.rates.find(query, {"_id": 0}).sort("updated_at", -1).to_list(300)


@router.get("/partners")
async def public_partners(q: str | None = None, city: str | None = None, category: str | None = None):
    query: dict = {"role": "partner", "partner_status": "approved"}
    if q:
        rx = {"$regex": re.escape(q), "$options": "i"}
        query["$or"] = [{"name": rx}, {"profile.company": rx}, {"profile.services": rx}, {"profile.description": rx}]
    if city:
        query["profile.city"] = {"$regex": re.escape(city), "$options": "i"}
    if category:
        query["profile.category"] = category
    partners = await db.users.find(query, {"_id": 0, "password_hash": 0}).sort("created_at", -1).to_list(200)
    return [
        {
            "id": p["id"],
            "name": p["name"],
            "profile": p.get("profile", {}),
        }
        for p in partners
    ]


@router.get("/updates")
async def public_updates():
    return await db.updates.find({"published": True}, {"_id": 0}).sort("created_at", -1).to_list(100)


@router.get("/blog")
async def public_blog():
    return await db.blog_posts.find({"published": True}, {"_id": 0}).sort("created_at", -1).to_list(100)


@router.get("/blog/{slug}")
async def public_blog_post(slug: str):
    from fastapi import HTTPException

    post = await db.blog_posts.find_one({"slug": slug, "published": True}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post
