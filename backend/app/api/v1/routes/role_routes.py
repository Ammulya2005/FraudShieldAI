# This file defines the API routes for managing roles in the application. It includes endpoints for creating new roles and fetching existing roles. Access to certain endpoints is restricted based on user roles, ensuring that only authorized users can perform specific actions.
from fastapi import APIRouter, Depends

from backend.app.schemas.role_schema import (
    RoleCreate
)

from backend.app.services.role_service import (
    create_new_role,
    fetch_roles
)

from backend.app.core.rbac import (
    require_roles
)

router = APIRouter(
    prefix="/roles",
    tags=["Roles"]
)

# Endpoint to create a new role. Only users with the "super_admin" role can access this endpoint.
@router.post("/")
async def create_role(
    role: RoleCreate,
    current_user=Depends(
        require_roles(["super_admin"])
    )
):
    return await create_new_role(role)


@router.get("/")
async def get_roles():
    return await fetch_roles()