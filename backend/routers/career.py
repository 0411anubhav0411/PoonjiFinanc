import asyncio
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import EmailStr

from lib.career import MAX_RESUME_SIZE, normalize_application_type, sanitize_text, validate_resume_upload
from lib.db import db
from lib.mail import notify_new_lead
from lib.storage import APP_NAME, put_object_async
from models.schemas import CareerApplication

router = APIRouter(tags=["career"])


@router.post("/career/applications", response_model=CareerApplication, status_code=201)
async def create_career_application(
    name: str = Form(...),
    email: EmailStr = Form(...),
    application_type: str = Form(...),
    message: str | None = Form(default=None),
    resume: UploadFile = File(...),
):
    try:
        clean_name = sanitize_text(name, field_name="Full Name", min_length=2, max_length=120)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    try:
        normalized_type = normalize_application_type(application_type)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    try:
        clean_message = sanitize_text(message, field_name="Message", max_length=2000)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    data = await resume.read()
    if len(data) > MAX_RESUME_SIZE:
        raise HTTPException(status_code=400, detail="Resume file must be 5 MB or smaller.")

    try:
        validate_resume_upload(data, resume.filename, resume.content_type)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    safe_name = f"{uuid.uuid4()}.pdf"
    storage_path = f"{APP_NAME}/careers/{safe_name}"
    await put_object_async(storage_path, data, "application/pdf")

    doc = {
        "id": str(uuid.uuid4()),
        "name": clean_name,
        "email": str(email).strip().lower(),
        "application_type": normalized_type,
        "message": clean_message,
        "resume_path": storage_path,
        "resume_filename": safe_name,
        "submitted_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.career_applications.insert_one(doc)

    asyncio.create_task(notify_new_lead(
        "New career application",
        [
            ("Name", clean_name),
            ("Email", str(email).strip().lower()),
            ("Application Type", normalized_type.replace("_", " ").title()),
            ("Message", clean_message or "—"),
            ("Resume", safe_name),
        ],
    ))
    return CareerApplication(**doc)
