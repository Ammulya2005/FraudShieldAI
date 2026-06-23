from typing import Any, Dict

from fastapi import APIRouter, Body, Depends

from backend.app.core.rbac import require_roles

router = APIRouter(prefix="/api/v1/permissions", tags=["Permissions"])

@router.post("")
async def create_permission(
    permission: Dict[str, Any] = Body(...),
    current_user=Depends(require_roles(["super_admin"]))
):
    return {"created": permission}

@router.get("")
async def list_permissions(
    current_user=Depends(require_roles(["admin", "super_admin"]))
):
    return {"permissions": []}

@router.get("/{permission_id}")
async def get_permission(
    permission_id: str,
    current_user=Depends(require_roles(["admin", "super_admin"]))
):
    return {"permission_id": permission_id, "permission": None}

@router.put("/{permission_id}")
async def update_permission(
    permission_id: str,
    permission: Dict[str, Any] = Body(...),
    current_user=Depends(require_roles(["super_admin"]))
):
    return {"permission_id": permission_id, "updated": permission}

@router.delete("/{permission_id}")
async def delete_permission(
    permission_id: str,
    current_user=Depends(require_roles(["super_admin"]))
):
    return {"permission_id": permission_id, "deleted": True}