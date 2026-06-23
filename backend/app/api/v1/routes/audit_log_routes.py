from typing import Optional

from fastapi import APIRouter, Depends, Query

from backend.app.core.rbac import require_roles

router = APIRouter(prefix="/api/v1/audit-logs", tags=["Audit Logs"])

@router.get("")
async def list_audit_logs(
    user_id: Optional[str] = Query(None),
    action: Optional[str] = Query(None),
    current_user=Depends(require_roles(["admin", "super_admin"]))
):
    return {
        "user_id": user_id,
        "action": action,
        "logs": []
    }

@router.get("/{audit_id}")
async def get_audit_log(
    audit_id: str,
    current_user=Depends(require_roles(["admin", "super_admin"]))
):
    return {
        "audit_id": audit_id,
        "entry": None
    }