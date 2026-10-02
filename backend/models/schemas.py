from typing import Literal

from pydantic import BaseModel, EmailStr, Field

APP_STATUSES = [
    "submitted",
    "documents_pending",
    "under_review",
    "processing",
    "with_institution",
    "assessment",
    "decision",
    "completed",
]

APP_STATUS_LABELS = {
    "submitted": "Application Submitted",
    "documents_pending": "Documents Pending",
    "under_review": "Documents Under Review",
    "processing": "File Under Processing",
    "with_institution": "Submitted to Institution",
    "assessment": "Under Assessment",
    "decision": "Decision / Further Requirement",
    "completed": "Completed / Closed",
}

RATE_CATEGORIES = ["home-loan", "lap", "personal-loan", "business-loan", "vehicle-loan", "education-loan"]


class CustomerRegister(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    mobile: str = Field(min_length=10, max_length=15)
    password: str = Field(min_length=8, max_length=128)
    dob: str | None = None
    gender: str | None = None
    address: str | None = None
    city: str | None = None
    state: str | None = None
    pin: str | None = None
    employment_type: str | None = None
    occupation: str | None = None
    company: str | None = None
    income: str | None = None
    pan: str | None = None


class PartnerRegister(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    mobile: str = Field(min_length=10, max_length=15)
    password: str = Field(min_length=8, max_length=128)
    company: str = Field(min_length=2, max_length=160)
    category: str = Field(min_length=2, max_length=60)
    designation: str | None = None
    city: str | None = None
    state: str | None = None
    website: str | None = None
    description: str | None = None
    services: str | None = None
    experience_years: str | None = None


class ProfileUpdate(BaseModel):
    name: str | None = None
    mobile: str | None = None
    dob: str | None = None
    gender: str | None = None
    address: str | None = None
    city: str | None = None
    state: str | None = None
    pin: str | None = None
    employment_type: str | None = None
    occupation: str | None = None
    company: str | None = None
    income: str | None = None
    pan: str | None = None
    designation: str | None = None
    website: str | None = None
    description: str | None = None
    services: str | None = None
    experience_years: str | None = None
    category: str | None = None
    business_address: str | None = None


class PortalApplicationCreate(BaseModel):
    product: str = Field(min_length=2, max_length=120)
    amount: str | None = None
    tenure: str | None = None
    employment: str | None = None
    income: str | None = None
    city: str | None = None
    notes: str | None = None


class DocStatusUpdate(BaseModel):
    status: Literal["uploaded", "under_review", "verified", "rejected", "replacement_required"]
    note: str | None = None


class ApplicationStatusUpdate(BaseModel):
    status: str
    note: str | None = None


class PartnerStatusUpdate(BaseModel):
    status: Literal["pending", "approved", "rejected", "suspended"]
    note: str | None = None


class NoteCreate(BaseModel):
    text: str = Field(min_length=1, max_length=2000)


class RateIn(BaseModel):
    institution: str = Field(min_length=2, max_length=120)
    category: str = Field(min_length=2, max_length=60)
    product: str = Field(min_length=2, max_length=120)
    rate_text: str = Field(min_length=1, max_length=60)
    amount_text: str | None = None
    tenure_text: str | None = None
    fee_text: str | None = None
    eligibility_text: str | None = None
    notes: str | None = None
    source: str | None = None
    published: bool = True


class UpdateIn(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    category: str = Field(min_length=2, max_length=60)
    body: str = Field(min_length=2)
    source: str | None = None
    important: bool = False
    published: bool = True


class EmailIn(BaseModel):
    email: EmailStr


class VerifyEmailIn(BaseModel):
    email: EmailStr
    code: str = Field(min_length=6, max_length=6)


class ResetPasswordIn(BaseModel):
    token: str = Field(min_length=10)
    password: str = Field(min_length=8, max_length=128)


class BlogIn(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    slug: str = Field(min_length=2, max_length=120)
    category: str = Field(min_length=2, max_length=60)
    excerpt: str = Field(min_length=2, max_length=400)
    body: str = Field(min_length=2)
    author: str = "Team Poonji"
    read_time: str = "5 min read"
    image: str | None = None
    published: bool = True
