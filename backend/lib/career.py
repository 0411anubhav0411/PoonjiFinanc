import re

MAX_RESUME_SIZE = 5 * 1024 * 1024


def sanitize_text(value: str | None, *, field_name: str, min_length: int = 0, max_length: int = 2000) -> str:
    text = (value or "").strip()
    if not text:
        if min_length > 0:
            raise ValueError(f"{field_name} is required.")
        return ""
    if len(text) < min_length:
        raise ValueError(f"{field_name} is too short.")
    if len(text) > max_length:
        raise ValueError(f"{field_name} exceeds the allowed length.")
    cleaned = re.sub(r"\s+", " ", text)
    return cleaned


def normalize_application_type(value: str | None) -> str:
    candidate = (value or "").strip().lower().replace(" ", "_")
    if candidate in {"internship", "internship_"}:
        return "internship"
    if candidate in {"full-time", "full_time", "fulltime"}:
        return "full_time"
    raise ValueError("Please select either Internship or Full-Time.")


def validate_resume_upload(file_bytes: bytes, filename: str | None, content_type: str | None) -> None:
    if not file_bytes:
        raise ValueError("Resume file is empty.")
    if len(file_bytes) > MAX_RESUME_SIZE:
        raise ValueError("Resume file must be 5 MB or smaller.")

    safe_filename = (filename or "").lower()
    mime_type = (content_type or "").lower()
    if not safe_filename.endswith(".pdf") or mime_type != "application/pdf":
        raise ValueError("Resume must be a PDF file with PDF content type.")

    if not file_bytes.startswith(b"%PDF-"):
        raise ValueError("Resume file appears to be corrupted or not a valid PDF.")
