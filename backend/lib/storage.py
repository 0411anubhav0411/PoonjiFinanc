import asyncio
import mimetypes
import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

STORAGE_DIR = Path(os.environ.get("FILE_STORAGE_DIR", Path(__file__).parent.parent / "uploads")).resolve()
APP_NAME = "poonji-finance"

def _object_path(path: str) -> Path:
    target = (STORAGE_DIR / path).resolve()
    if target != STORAGE_DIR and STORAGE_DIR not in target.parents:
        raise ValueError("Invalid storage path")
    return target


def put_object(path: str, data: bytes, content_type: str) -> dict:
    target = _object_path(path)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(data)
    return {"path": path, "size": len(data), "content_type": content_type}


def get_object(path: str) -> tuple[bytes, str]:
    target = _object_path(path)
    content_type = mimetypes.guess_type(target.name)[0] or "application/octet-stream"
    return target.read_bytes(), content_type


async def put_object_async(path: str, data: bytes, content_type: str) -> dict:
    return await asyncio.to_thread(put_object, path, data, content_type)


async def get_object_async(path: str) -> tuple[bytes, str]:
    return await asyncio.to_thread(get_object, path)
