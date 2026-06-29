from datetime import datetime
from uuid import uuid4

from fastapi import HTTPException, status

from backend.app.repositories.fraud_case_repository import (
    create_fraud_case,
    get_all_fraud_cases,
    get_fraud_case_by_case_id,
    update_fraud_case,
    delete_fraud_case,
    assign_fraud_case,
    close_fraud_case
)


def generate_case_id() -> str:
    return f"CASE-{uuid4().hex[:10].upper()}"


async def create_new_fraud_case(case):
    case_data = {
        "case_id": generate_case_id(),
        "transaction_id": case.transaction_id,
        "user_id": case.user_id,
        "risk_score": case.risk_score,
        "final_prediction": case.final_prediction,
        "status": "open",
        "priority": case.priority,
        "assigned_to": None,
        "review_notes": None,
        "resolution": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "closed_at": None
    }

    inserted_id = await create_fraud_case(case_data)

    return {
        "message": "Fraud case created successfully",
        "fraud_case_db_id": inserted_id,
        "case_id": case_data["case_id"]
    }


async def fetch_all_fraud_cases():
    return await get_all_fraud_cases()


async def fetch_fraud_case(case_id: str):
    fraud_case = await get_fraud_case_by_case_id(case_id)

    if not fraud_case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fraud case not found"
        )

    return fraud_case


async def update_existing_fraud_case(
    case_id: str,
    case_update
):
    fraud_case = await get_fraud_case_by_case_id(case_id)

    if not fraud_case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fraud case not found"
        )

    update_data = case_update.model_dump(exclude_none=True)

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided for update"
        )

    update_data["updated_at"] = datetime.utcnow()

    await update_fraud_case(case_id, update_data)

    return {
        "message": "Fraud case updated successfully"
    }


async def delete_existing_fraud_case(case_id: str):
    fraud_case = await get_fraud_case_by_case_id(case_id)

    if not fraud_case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fraud case not found"
        )

    await delete_fraud_case(case_id)

    return {
        "message": "Fraud case deleted successfully"
    }


async def assign_existing_fraud_case(
    case_id: str,
    assigned_to: str
):
    fraud_case = await get_fraud_case_by_case_id(case_id)

    if not fraud_case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fraud case not found"
        )

    await assign_fraud_case(case_id, assigned_to)

    return {
        "message": "Fraud case assigned successfully",
        "case_id": case_id,
        "assigned_to": assigned_to
    }


async def close_existing_fraud_case(
    case_id: str,
    resolution: str,
    review_notes: str | None = None
):
    fraud_case = await get_fraud_case_by_case_id(case_id)

    if not fraud_case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fraud case not found"
        )

    if fraud_case.get("status") == "closed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Fraud case already closed"
        )

    await close_fraud_case(
        case_id,
        resolution,
        review_notes
    )

    return {
        "message": "Fraud case closed successfully",
        "case_id": case_id,
        "resolution": resolution
    }