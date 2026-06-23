from fastapi import APIRouter, Depends

from backend.app.core.rbac import require_roles

router = APIRouter(prefix="/api/v1/admin", tags=["Admin"])

@router.get("/status")
async def get_admin_status(
    current_user=Depends(require_roles(["admin", "super_admin"]))
):
    return {
        "status": "ok",
        "service": "admin",
        "user_id": str(current_user["_id"])
    }

@router.get("/metrics")
async def get_admin_metrics(
    current_user=Depends(require_roles(["admin", "super_admin"]))
):
    return {
        "active_users": 0,
        "open_cases": 0,
        "pending_alerts": 0,
        "system_health": "good"
    }