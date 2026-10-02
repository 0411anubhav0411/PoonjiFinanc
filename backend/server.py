import asyncio
import logging
import os
import uuid
from contextlib import asynccontextmanager
from datetime import datetime, timezone, timedelta
from pathlib import Path

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

from fastapi import FastAPI, APIRouter, Depends, HTTPException, Request, Response
from typing import Literal
from pydantic import BaseModel, EmailStr, Field
from starlette.middleware.cors import CORSMiddleware

from lib.db import client, db, ensure_indexes

logger = logging.getLogger(__name__)
JWT_ALGORITHM = "HS256"

from lib.security import create_token, get_current_admin, hash_password, verify_password
from lib.mail import notify_new_lead
from lib.storage import init_storage
from routers.register import router as register_router
from routers.portal import router as portal_router
from routers.admin_routes import router as admin_routes_router
from routers.public import router as public_router


async def seed_admin() -> None:
    email = os.environ["ADMIN_EMAIL"].lower()
    password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": email,
            "password_hash": hash_password(password),
            "name": "Poonji Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Seeded admin user %s", email)
    elif not verify_password(password, existing["password_hash"]):
        await db.users.update_one(
            {"email": email}, {"$set": {"password_hash": hash_password(password)}}
        )


@asynccontextmanager
async def lifespan(app: FastAPI):
    await seed_admin()
    try:
        await asyncio.to_thread(init_storage)
    except Exception as exc:
        logger.error("storage init failed: %s", exc)
    app.state.index_task = asyncio.create_task(ensure_indexes())
    yield
    client.close()


app = FastAPI(lifespan=lifespan)
api_router = APIRouter(prefix="/api")


class EnquiryCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    mobile: str = Field(min_length=10, max_length=15)
    email: EmailStr
    city: str = Field(min_length=2, max_length=80)
    service: str = Field(min_length=2, max_length=80)
    requirement: str | None = None
    message: str | None = None


class Enquiry(EnquiryCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    status: str = "new"


class CallbackCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    mobile: str = Field(min_length=10, max_length=15)
    preferred_time: str | None = None


class Callback(CallbackCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    status: str = "new"


class ApplicationCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    mobile: str = Field(min_length=10, max_length=15)
    role: str = Field(min_length=2, max_length=120)
    message: str | None = None


class Application(ApplicationCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    status: str = "new"


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class AdminUser(BaseModel):
    id: str
    email: str
    name: str
    role: str


@api_router.get("/")
async def root():
    return {"message": "Poonji Finance API"}


@api_router.post("/enquiries", response_model=Enquiry, status_code=201)
async def create_enquiry(body: EnquiryCreate):
    doc = Enquiry(**body.model_dump())
    await db.enquiries.insert_one(doc.model_dump())
    asyncio.create_task(notify_new_lead(
        f"New enquiry — {doc.service}",
        [
            ("Reference", doc.id[:8].upper()),
            ("Name", doc.name),
            ("Mobile", doc.mobile),
            ("Email", doc.email),
            ("City", doc.city),
            ("Service", doc.service),
            ("Requirement", doc.requirement or ""),
            ("Message", doc.message or ""),
        ],
    ))
    return doc


@api_router.post("/callbacks", response_model=Callback, status_code=201)
async def create_callback(body: CallbackCreate):
    doc = Callback(**body.model_dump())
    await db.callbacks.insert_one(doc.model_dump())
    asyncio.create_task(notify_new_lead(
        "New callback request",
        [
            ("Reference", doc.id[:8].upper()),
            ("Name", doc.name),
            ("Mobile", doc.mobile),
            ("Preferred time", doc.preferred_time or ""),
        ],
    ))
    return doc


@api_router.post("/applications", response_model=Application, status_code=201)
async def create_application(body: ApplicationCreate):
    doc = Application(**body.model_dump())
    await db.applications.insert_one(doc.model_dump())
    asyncio.create_task(notify_new_lead(
        f"New job application — {doc.role}",
        [
            ("Reference", doc.id[:8].upper()),
            ("Name", doc.name),
            ("Email", doc.email),
            ("Mobile", doc.mobile),
            ("Role", doc.role),
            ("Note", doc.message or ""),
        ],
    ))
    return doc


@api_router.post("/auth/login", response_model=AdminUser)
async def login(body: LoginIn, response: Response):
    user = await db.users.find_one({"email": body.email.lower()})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_token(user["id"], user["email"], user.get("role", "customer"))
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=43200,
        path="/",
    )
    return AdminUser(id=user["id"], email=user["email"], name=user["name"], role=user["role"])


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/", samesite="none", secure=True)
    return {"ok": True}


@api_router.get("/auth/me", response_model=AdminUser)
async def me(admin: dict = Depends(get_current_admin)):
    return AdminUser(**admin)


class StatusUpdate(BaseModel):
    status: Literal["new", "contacted", "closed"]


@api_router.get("/leads")
async def leads(admin: dict = Depends(get_current_admin)):
    enquiries = await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    callbacks = await db.callbacks.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    applications = await db.applications.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return {
        "enquiries": [Enquiry(**e) for e in enquiries],
        "callbacks": [Callback(**c) for c in callbacks],
        "applications": [Application(**a) for a in applications],
    }


@api_router.post("/leads/{kind}/{lead_id}/status")
async def update_lead_status(kind: str, lead_id: str, body: StatusUpdate, admin: dict = Depends(get_current_admin)):
    if kind not in ("enquiries", "callbacks", "applications"):
        raise HTTPException(status_code=404, detail="Unknown lead type")
    res = await db[kind].update_one({"id": lead_id}, {"$set": {"status": body.status}})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"ok": True, "status": body.status}


api_router.include_router(register_router)
api_router.include_router(portal_router)
api_router.include_router(admin_routes_router)
api_router.include_router(public_router)

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
