import ipaddress
import logging
import os
import re
from html import escape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

import httpx
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

logger = logging.getLogger(__name__)

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
        '<a href="https://poonji-finance.preview.emergentagent.com/admin">Open your dashboard</a>'
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


async def create_notification(user_id: str, title: str, body: str) -> None:
    from lib.db import db
    from lib.security import new_id, utcnow

    await db.notifications.insert_one({
        "id": new_id(),
        "user_id": user_id,
        "title": title,
        "body": body,
        "read": False,
        "created_at": utcnow(),
    })


async def notify_admins(title: str, body: str) -> None:
    from lib.db import db

    async for admin in db.users.find({"role": "admin"}):
        await create_notification(admin["id"], title, body)
