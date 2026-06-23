from datetime import datetime
from uuid import uuid4

from fastapi import HTTPException, status

from backend.app.repositories.case_review_repository import (
    create_case_review,
    get_all_case_reviews,
    get_case_review_by_review_id,
    get_case_reviews_by_case_id,
    update_case_review,
    delete_case_review
)

from backend.app.repositories.fraud_case_repository import (
    get_fraud_case_by_case_id
)


def generate_review_id() -> str:
    return f"REV-{uuid4().hex[:10].upper()}"


async def create_new_case_review(
    review,
    current_user
):
    fraud_case = await get_fraud_case_by_case_id(
        review.case_id
    )

    if not fraud_case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fraud case not found"
        )

    review_data = {
        "review_id": generate_review_id(),
        "case_id": review.case_id,
        "analyst_id": str(current_user["_id"]),
        "analyst_username": current_user.get(
            "username"
        ),
        "decision": review.decision,
        "notes": review.notes,
        "evidence_summary": review.evidence_summary,
        "recommendation": review.recommendation,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    inserted_id = await create_case_review(
        review_data
    )

    return {
        "message": "Case review created successfully",
        "review_db_id": inserted_id,
        "review_id": review_data["review_id"],
        "case_id": review.case_id
    }


async def fetch_all_case_reviews():
    return await get_all_case_reviews()


async def fetch_case_review(
    review_id: str
):
    review = await get_case_review_by_review_id(
        review_id
    )

    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Case review not found"
        )

    return review


async def fetch_case_reviews_by_case(
    case_id: str
):
    fraud_case = await get_fraud_case_by_case_id(
        case_id
    )

    if not fraud_case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Fraud case not found"
        )

    return await get_case_reviews_by_case_id(
        case_id
    )


async def update_existing_case_review(
    review_id: str,
    review_update
):
    existing_review = await get_case_review_by_review_id(
        review_id
    )

    if not existing_review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Case review not found"
        )

    update_data = review_update.model_dump(
        exclude_none=True
    )

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided for update"
        )

    update_data["updated_at"] = datetime.utcnow()

    await update_case_review(
        review_id,
        update_data
    )

    return {
        "message": "Case review updated successfully",
        "review_id": review_id
    }


async def delete_existing_case_review(
    review_id: str
):
    existing_review = await get_case_review_by_review_id(
        review_id
    )

    if not existing_review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Case review not found"
        )

    await delete_case_review(review_id)

    return {
        "message": "Case review deleted successfully",
        "review_id": review_id
    }