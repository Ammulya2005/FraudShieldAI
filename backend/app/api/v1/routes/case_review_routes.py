from fastapi import APIRouter, Depends

from backend.app.schemas.case_review_schema import (
    CaseReviewCreate,
    CaseReviewUpdate
)

from backend.app.services.case_review_service import (
    create_new_case_review,
    fetch_all_case_reviews,
    fetch_case_review,
    fetch_case_reviews_by_case,
    update_existing_case_review,
    delete_existing_case_review
)

from backend.app.core.rbac import (
    require_roles
)


router = APIRouter(
    prefix="/api/v1/case-reviews",
    tags=["Case Reviews"]
)


@router.post("/")
async def create_case_review_route(
    review: CaseReviewCreate,
    current_user=Depends(
        require_roles(
            [
                "analyst",
                "fraud_manager",
                "admin",
                "super_admin"
            ]
        )
    )
):
    return await create_new_case_review(
        review,
        current_user
    )


@router.get("/")
async def get_all_case_reviews_route(
    current_user=Depends(
        require_roles(
            [
                "analyst",
                "fraud_manager",
                "admin",
                "super_admin"
            ]
        )
    )
):
    return await fetch_all_case_reviews()


@router.get("/{review_id}")
async def get_case_review_route(
    review_id: str,
    current_user=Depends(
        require_roles(
            [
                "analyst",
                "fraud_manager",
                "admin",
                "super_admin"
            ]
        )
    )
):
    return await fetch_case_review(review_id)


@router.get("/case/{case_id}")
async def get_case_reviews_by_case_route(
    case_id: str,
    current_user=Depends(
        require_roles(
            [
                "analyst",
                "fraud_manager",
                "admin",
                "super_admin"
            ]
        )
    )
):
    return await fetch_case_reviews_by_case(case_id)


@router.put("/{review_id}")
async def update_case_review_route(
    review_id: str,
    review_update: CaseReviewUpdate,
    current_user=Depends(
        require_roles(
            [
                "analyst",
                "fraud_manager",
                "admin",
                "super_admin"
            ]
        )
    )
):
    return await update_existing_case_review(
        review_id,
        review_update
    )


@router.delete("/{review_id}")
async def delete_case_review_route(
    review_id: str,
    current_user=Depends(
        require_roles(
            [
                "fraud_manager",
                "admin",
                "super_admin"
            ]
        )
    )
):
    return await delete_existing_case_review(review_id)