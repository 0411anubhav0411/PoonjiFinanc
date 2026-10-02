import os
import logging
import secrets
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path

import bcrypt
import jwt
from dotenv import load_dotenv
from fastapi import HTTPException, Request

load_dotenv(Path(__file__).parent.parent / ".env")

JWT_ALGORITHM = "HS256"
logger = logging.getLogger(__name__)
JWT_SECRET = os.environ.get("JWT_SECRET")
if not JWT_SECRET:
    if os.environ.get("SESSION_SECURE", "false").strip().lower() == "true":
        raise RuntimeError("JWT_SECRET must be configured when secure sessions are enabled")
    JWT_SECRET = secrets.token_urlsafe(32)
    logger.warning("JWT_SECRET is unset; using an ephemeral key for local development")


def session_cookie_secure() -> bool:
    return os.environ.get("SESSION_SECURE", "false").strip().lower() == "true"


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


def create_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def new_id() -> str:
    return str(uuid.uuid4())


def utcnow() -> str:
    return datetime.now(timezone.utc).isoformat()


async def get_current_user(request: Request) -> dict:
    from lib.db import db

    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        logger.warning("Authentication failed: access token missing")
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.PyJWTError:
        logger.warning("Authentication failed: invalid or expired access token")
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user_id = payload.get("sub")
    if not isinstance(user_id, str) or not user_id:
        logger.warning("Authentication failed: access token has no valid subject")
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    try:
        user = await db.users.find_one({"id": user_id}, {"_id": 0, "password_hash": 0})
    except Exception as exc:
        logger.error("Authentication user lookup failed (%s)", type(exc).__name__)
        raise HTTPException(status_code=503, detail="Authentication service unavailable") from exc
    if not user:
        logger.warning("Authentication failed: token subject does not match an active user")
        raise HTTPException(status_code=401, detail="User not found")
    return user


def require_role(*roles: str):
    async def dep(request: Request) -> dict:
        user = await get_current_user(request)
        if user.get("role") not in roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user

    return dep


get_current_admin = require_role("admin")
