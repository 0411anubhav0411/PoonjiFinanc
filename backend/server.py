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

import bcrypt
import jwt
from fastapi import FastAPI, APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel, EmailStr, Field
from starlette.middleware.cors import CORSMiddleware

from lib.db import client, db, ensure_indexes

logger = logging.getLogger(__name__)
JWT_ALGORITHM = "HS256"

# ---- Lead email notifications (Emergent managed email) ----
import ipaddress
import re
from html import escape
from html.parser import HTMLParser
from typing import Literal
from urllib.parse import urlparse

import httpx

EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY", "")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "Poonji Finance")
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: str | None = None) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to or EMAIL_REPLY_TO:
        payload["contact_email"] = reply_to or EMAIL_REPLY_TO
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        return resp.json().get("id")
    except Exception as exc:
        logger.error("Email send failed: %s", exc)
        return None


def lead_email_html(title: str, rows: list[tuple[str, str]]) -> str:
    body = "".join(
        f'<tr><td style="padding:6px 12px;color:#64748B;font-size:13px;vertical-align:top">{escape(k)}</td>'
        f'<td style="padding:6px 12px;font-size:13px;color:#0F172A">{escape(str(v))}</td></tr>'
        for k, v in rows if v
    )
    return (
        '<table role="presentation" width="100%"><tr>'
        '<td style="padding:24px;font-family:Arial,sans-serif">'
        f'<h2 style="margin:0 0 16px;font-size:18px;color:#1D4ED8">{escape(title)}</h2>'
        f'<table role="presentation" style="border:1px solid #E2E8F0;border-radius:8px">{body}</table>'
        '<p style="margin:20px 0 0;font-size:13px">'
        '<a href="https://poonji-finance.preview.emergentagent.com/admin">Open your leads dashboard</a>'
        " to follow up.</p>"
        '<p style="margin:16px 0 0;font-size:11px;color:#94A3B8">Sent by the Poonji Finance website. '
        "We never ask for passwords, OTPs or card details by email.</p>"
        "</td></tr></table>"
    )


async def notify_new_lead(subject: str, rows: list[tuple[str, str]]) -> None:
    to = os.environ.get("LEAD_NOTIFY_EMAIL")
    if not to:
        return
    try:
        await send_email(to=to, subject=subject, html=lead_email_html(subject, rows))
    except Exception:
        logger.exception("lead notification email failed")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


def create_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
    }
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


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


async def get_current_admin(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


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
    token = create_token(user["id"], user["email"])
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
