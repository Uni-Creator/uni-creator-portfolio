from __future__ import annotations

import asyncio
import json
import re
from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, ConfigDict, Field, field_validator


# Configuration

BASE_DIR = Path(__file__).resolve().parent.parent
CONTACTS_FILE = BASE_DIR / "contacts.json"

MAX_NAME_LENGTH = 80
MAX_EMAIL_LENGTH = 254
MAX_MESSAGE_LENGTH = 2000

EMAIL_RE = re.compile(
    r"^[^@\s]+@[^@\s]+\.[^@\s]+$"
)


# App

app = FastAPI(
    title="Portfolio Contact API",
    description="Contact submission API for the portfolio terminal.",
    version="1.0.0",
)


# Prevent two requests from modifying contacts.json simultaneously.
file_lock = asyncio.Lock()


# Request model

class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str = Field(
        ...,
        min_length=1,
        max_length=MAX_NAME_LENGTH,
    )

    email: str = Field(
        ...,
        min_length=3,
        max_length=MAX_EMAIL_LENGTH,
    )

    message: str = Field(
        ...,
        min_length=1,
        max_length=MAX_MESSAGE_LENGTH,
    )

    @field_validator("name", "email", "message")
    @classmethod
    def clean_text(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Field cannot be empty.")

        # Remove terminal/control characters.
        value = "".join(
            char
            for char in value
            if char in "\n\r\t" or 32 <= ord(char) <= 126
        )

        if not value:
            raise ValueError("Field contains no valid characters.")

        return value

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        if not EMAIL_RE.fullmatch(value):
            raise ValueError("Invalid email address.")

        return value.lower()


# 
# File helpers
# 

def ensure_contacts_file() -> None:
    """Create contacts.json if it doesn't exist."""

    if not CONTACTS_FILE.exists():
        CONTACTS_FILE.write_text(
            "[]\n",
            encoding="utf-8",
        )


def load_contacts() -> list[dict]:
    """Load all contact submissions."""

    ensure_contacts_file()

    try:
        raw = CONTACTS_FILE.read_text(encoding="utf-8")

        if not raw.strip():
            return []

        data = json.loads(raw)

    except json.JSONDecodeError as exc:
        raise RuntimeError(
            "contacts.json contains invalid JSON."
        ) from exc

    if not isinstance(data, list):
        raise RuntimeError(
            "contacts.json must contain a JSON array."
        )

    return data


def save_contacts(contacts: list[dict]) -> None:
    """Write contacts to contacts.json."""

    temporary_file = CONTACTS_FILE.with_suffix(".json.tmp")

    temporary_file.write_text(
        json.dumps(
            contacts,
            indent=2,
            ensure_ascii=False,
        )
        + "\n",
        encoding="utf-8",
    )

    # Atomic replacement.
    temporary_file.replace(CONTACTS_FILE)


# Routes

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "portfolio-contact-api",
    }


@app.post(
    "/api/contact",
    status_code=status.HTTP_201_CREATED,
)
async def create_contact(submission: ContactSubmission):
    async with file_lock:
        try:
            contacts = load_contacts()

            contact = {
                "id": len(contacts) + 1,
                "name": submission.name,
                "email": submission.email,
                "message": submission.message,
                "submitted_at": datetime.now(
                    timezone.utc
                ).isoformat(),
            }

            contacts.append(contact)

            save_contacts(contacts)

        except RuntimeError as exc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(exc),
            ) from exc

        except OSError as exc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Unable to save contact submission.",
            ) from exc

    return {
        "success": True,
        "message": "Message received successfully.",
        "id": contact["id"],
    }


# Development-only endpoint

@app.get("/api/contact")
async def get_contacts():
    """
    Development endpoint.

    Do NOT expose this publicly in production because it returns
    people's names, email addresses, and messages.
    """

    async with file_lock:
        try:
            contacts = load_contacts()

        except RuntimeError as exc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(exc),
            ) from exc

    return {
        "count": len(contacts),
        "contacts": contacts,
    }