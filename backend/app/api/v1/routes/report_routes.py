from typing import Any, Dict, Optional

from fastapi import APIRouter, Body, Depends, Query

from backend.app.core.rbac import require_roles

router = APIRouter(prefix="/api/v1/reports", tags=["Reports"])

@router.post("/generate")
async def generate_report(
    request: Dict[str, Any] = Body(...),
    current_user=Depends(require_roles(["analyst", "fraud_manager", "admin", "super_admin"]))
):
    return {"status": "started", "request": request}

@router.get("")
async def list_reports(
    report_type: Optional[str] = Query(None),
    current_user=Depends(require_roles(["analyst", "fraud_manager", "admin", "super_admin"]))
):
    return {"report_type": report_type, "reports": []}

@router.get("/{report_id}")
async def get_report(
    report_id: str,
    current_user=Depends(require_roles(["analyst", "fraud_manager", "admin", "super_admin"]))
):
    return {"report_id": report_id, "report": None}
