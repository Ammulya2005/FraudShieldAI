from typing import Any, Dict, Optional

from fastapi import APIRouter, Body, Depends, Query

from backend.app.core.rbac import require_roles

router = APIRouter(prefix="/api/v1/notifications", tags=["Notifications"])

@router.post("/send")
async def send_notification(
    notification: Dict[str, Any] = Body(...),
    current_user=Depends(require_roles(["analyst", "fraud_manager", "admin", "super_admin"]))
):
    return {"status": "queued", "notification": notification}

@router.get("")
async def list_notifications(
    user_id: Optional[str] = Query(None),
    current_user=Depends(require_roles(["analyst", "fraud_manager", "admin", "super_admin"]))
):
    return {"user_id": user_id, "notifications": []}

@router.get("/{notification_id}")
async def get_notification(
    notification_id: str,
    current_user=Depends(require_roles(["analyst", "fraud_manager", "admin", "super_admin"]))
):
    return {"notification_id": notification_id, "notification": None}

@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: str,
    current_user=Depends(require_roles(["admin", "super_admin"]))
):
    return {"notification_id": notification_id, "deleted": True}