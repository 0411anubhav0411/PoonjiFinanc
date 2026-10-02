import asyncio

from fastapi import APIRouter, HTTPException, Response

from lib.db import db
from lib.mail import create_notification, notify_admins
from lib.security import create_token, hash_password, new_id, utcnow
from models.schemas import CustomerRegister, PartnerRegister
from routers.account import issue_verification

router = APIRouter(tags=["auth"])


def public_user(user: dict) -> dict:
    return {k: v for k, v in user.items() if k not in ("password_hash", "_id")}


def set_auth_cookie(response: Response, user: dict) -> None:
    token = create_token(user["id"], user["email"], user["role"])
    response.set_cookie(
        key="access_token", value=token, httponly=True, secure=True, samesite="none", max_age=43200, path="/"
    )


@router.post("/auth/register", status_code=201)
async def register_customer(body: CustomerRegister, response: Response):
    email = body.email.lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=409, detail="An account with this email already exists")
    data = body.model_dump()
    user = {
        "id": new_id(),
        "role": "customer",
        "name": data.pop("name"),
        "email": email,
        "mobile": data.pop("mobile"),
        "password_hash": hash_password(data.pop("password")),
        "partner_status": None,
        "email_verified": False,
        "profile": {k: v for k, v in data.items() if v},
        "created_at": utcnow(),
    }
    await db.users.insert_one(user)
    set_auth_cookie(response, user)
    asyncio.create_task(issue_verification(email))
    await create_notification(
        user["id"],
        "Welcome to Poonji Finance",
        "Your account is ready. Complete your profile and upload your KYC documents once — they can then be reused across applications.",
    )
    return public_user(user)


@router.post("/auth/register-partner", status_code=201)
async def register_partner(body: PartnerRegister):
    email = body.email.lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=409, detail="An account with this email already exists")
    data = body.model_dump()
    user = {
        "id": new_id(),
        "role": "partner",
        "name": data.pop("name"),
        "email": email,
        "mobile": data.pop("mobile"),
        "password_hash": hash_password(data.pop("password")),
        "partner_status": "pending",
        "email_verified": False,
        "profile": {k: v for k, v in data.items() if v},
        "created_at": utcnow(),
    }
    await db.users.insert_one(user)
    await notify_admins(
        "New partner registration",
        f"{user['name']} ({user['profile'].get('company', '—')}) has applied for a partner account.",
    )
    return {"ok": True, "message": "Application received. Poonji Finance will review and approve your partner account."}
