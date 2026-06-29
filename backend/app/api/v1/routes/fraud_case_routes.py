from fastapi import APIRouter, Depends

from backend.app.core.rbac import (
    require_roles
)
from backend.app.schemas.fraud_case_schema import (
    FraudCaseCreate,
    FraudCaseUpdate,
    FraudCaseAssignRequest,
    FraudCaseCloseRequest
)
from backend.app.services.fraud_case_service import (
    create_new_fraud_case,
    fetch_all_fraud_cases,
    fetch_fraud_case,
    update_existing_fraud_case,
    delete_existing_fraud_case,
    assign_existing_fraud_case,
    close_existing_fraud_case
)

router = APIRouter(
    prefix="/api/v1/fraud-cases",
    tags=["Fraud Cases"]
)


@router.post("")
async def create_fraud_case_route(
    fraud_case: FraudCaseCreate,
    current_user=Depends(
        require_roles([
            "fraud_manager",
            "admin",
            "super_admin"
        ])
    )
):
    return await create_new_fraud_case(fraud_case)


@router.get("")
async def get_all_fraud_cases_route(
    current_user=Depends(
        require_roles([
            "analyst",
            "fraud_manager",
            "admin",
            "super_admin"
        ])
    )
):
    return await fetch_all_fraud_cases()


@router.get("/{case_id}")
async def get_fraud_case_route(
    case_id: str,
    current_user=Depends(
        require_roles([
            "analyst",
            "fraud_manager",
            "admin",
            "super_admin"
        ])
    )
):
    return await fetch_fraud_case(case_id)


@router.put("/{case_id}")
async def update_fraud_case_route(
    case_id: str,
    fraud_case: FraudCaseUpdate,
    current_user=Depends(
        require_roles([
            "fraud_manager",
            "admin",
            "super_admin"
        ])
    )
):
    return await update_existing_fraud_case(
        case_id,
        fraud_case
    )


@router.delete("/{case_id}")
async def delete_fraud_case_route(
    case_id: str,
    current_user=Depends(
        require_roles([
            "admin",
            "super_admin"
        ])
    )
):
    return await delete_existing_fraud_case(case_id)


@router.patch("/{case_id}/assign")
async def assign_fraud_case_route(
    case_id: str,
    request: FraudCaseAssignRequest,
    current_user=Depends(
        require_roles([
            "fraud_manager",
            "admin",
            "super_admin"
        ])
    )
):
    return await assign_existing_fraud_case(
        case_id,
        request.assigned_to
    )


@router.patch("/{case_id}/close")
async def close_fraud_case_route(
    case_id: str,
    request: FraudCaseCloseRequest,
    current_user=Depends(
        require_roles([
            "fraud_manager",
            "admin",
            "super_admin"
        ])
    )
):
    return await close_existing_fraud_case(
        case_id,
        request.resolution,
        request.review_notes
    )