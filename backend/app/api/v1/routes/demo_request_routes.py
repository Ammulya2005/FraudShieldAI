from datetime import datetime, timezone
from pathlib import Path
import json
import asyncio

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr


router = APIRouter(
    prefix="/demo-requests",
    tags=["Demo Requests"]
)


# ============================================================
# STORAGE
# ============================================================

DATA_DIR = Path(__file__).resolve().parents[4] / "data"

DATA_FILE = DATA_DIR / "demo_requests.json"

FILE_LOCK = asyncio.Lock()


# ============================================================
# REQUEST SCHEMA
# ============================================================

class DemoRequestCreate(BaseModel):

    name: str
    email: EmailStr


# ============================================================
# HELPERS
# ============================================================

def ensure_data_file():

    DATA_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    if not DATA_FILE.exists():

        DATA_FILE.write_text(
            "[]",
            encoding="utf-8"
        )


def read_requests():

    ensure_data_file()

    try:

        content = DATA_FILE.read_text(
            encoding="utf-8"
        )

        if not content.strip():

            return []

        return json.loads(content)

    except json.JSONDecodeError:

        return []


def write_requests(requests):

    ensure_data_file()

    DATA_FILE.write_text(
        json.dumps(
            requests,
            indent=2,
            ensure_ascii=False
        ),
        encoding="utf-8"
    )


# ============================================================
# CREATE DEMO REQUEST
# ============================================================

@router.post("")
async def create_demo_request(
    request: DemoRequestCreate
):

    async with FILE_LOCK:

        requests = read_requests()

        # Prevent duplicate pending requests
        for existing in requests:

            if (
                existing.get("email", "").lower()
                == request.email.lower()
                and existing.get("status") == "Pending"
            ):

                raise HTTPException(
                    status_code=409,
                    detail="A demo request with this email is already pending."
                )


        next_id = (
            max(
                [item.get("id", 0) for item in requests],
                default=0
            )
            + 1
        )


        new_request = {

            "id": next_id,

            "name": request.name.strip(),

            "email": request.email.lower().strip(),

            "requested_at":
                datetime.now(
                    timezone.utc
                ).isoformat(),

            "status": "Pending"

        }


        requests.append(
            new_request
        )

        write_requests(
            requests
        )


    return {

        "success": True,

        "message":
            "Demo request submitted successfully.",

        "request": new_request

    }


# ============================================================
# GET ALL REQUESTS
# ADMIN / SUPER ADMIN WILL USE THIS
# ============================================================

@router.get("")
async def get_demo_requests():

    return {

        "success": True,

        "requests":
            read_requests()

    }


# ============================================================
# UPDATE REQUEST STATUS
# ============================================================

@router.patch("/{request_id}")
async def update_demo_request(
    request_id: int,
    status: str
):

    allowed_statuses = {

        "Pending",
        "Approved",
        "Rejected"

    }

    if status not in allowed_statuses:

        raise HTTPException(
            status_code=400,
            detail="Invalid status. Use Pending, Approved, or Rejected."
        )


    async with FILE_LOCK:

        requests = read_requests()


        for request in requests:

            if request.get("id") == request_id:

                request["status"] = status

                write_requests(
                    requests
                )

                return {

                    "success": True,

                    "message":
                        f"Request {status.lower()} successfully.",

                    "request": request

                }


    raise HTTPException(
        status_code=404,
        detail="Demo request not found."
    )