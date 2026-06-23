from typing import Any, Dict, Optional

from fastapi import APIRouter, Body, Depends, Query

from backend.app.core.rbac import require_roles

router = APIRouter(prefix="/api/v1/settings", tags=["Settings"])

@router.get("")
async def get_settings(
    key: Optional[str] = Query(None),
    current_user=Depends(require_roles(["admin", "super_admin"]))
):
    return {"key": key, "settings": {}}

@router.put("")
async def update_settings(
    settings: Dict[str, Any] = Body(...),
    current_user=Depends(require_roles(["admin", "super_admin"]))
):
    return {"updated": settings}

@router.get("/{setting_key}")
async def get_setting(
    setting_key: str,
    current_user=Depends(require_roles(["admin", "super_admin"]))
):
    return {"setting_key": setting_key, "value": None}