from typing import Optional

from fastapi import APIRouter, Depends, Query

from backend.app.core.rbac import require_roles

router = APIRouter(prefix="/api/v1/fraud", tags=["Fraud"])

@router.get("/summary")
async def get_fraud_summary(
    current_user=Depends(require_roles(["analyst", "fraud_manager", "admin", "super_admin"]))
):
    return {
        "cases": 0,
        "alerts": 0,
        "average_risk_score": 0.0
    }

@router.get("/patterns")
async def get_fraud_patterns(
    current_user=Depends(require_roles(["analyst", "fraud_manager", "admin", "super_admin"]))
):
    return {
        "patterns": []
    }

@router.get("/entities")
async def get_fraud_entities(
    filter_type: Optional[str] = Query(None),
    current_user=Depends(require_roles(["analyst", "fraud_manager", "admin", "super_admin"]))
):
    return {
        "filter_type": filter_type,
        "entities": []
    }
