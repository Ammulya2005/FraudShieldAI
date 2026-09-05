# This file defines the API routes for managing user roles in the application. It includes endpoints for assigning roles to users and fetching the roles assigned to a specific user. Access to these endpoints is restricted based on user roles, ensuring that only authorized users can perform specific actions related to user role management.
from fastapi import APIRouter, Depends

from backend.app.schemas.user_role_schema import (
    AssignRoleRequest
)

from backend.app.services.user_role_service import (
    assign_user_role,
    fetch_user_roles
)

from backend.app.core.rbac import (
    require_roles
)

router = APIRouter(
    prefix="/user-roles",
    tags=["User Roles"]
)

# Endpoint to assign a role to a user. Only users with the "admin" or "super_admin" roles can access this endpoint.
@router.post("/assign")
async def assign_role_route(
    request: AssignRoleRequest,
    current_user=Depends(
        require_roles(
            [
                "admin",
                "super_admin"
            ]
        )
    )
):
    return await assign_user_role(request)

# Endpoint to fetch the roles assigned to a specific user. Only users with the "admin" or "super_admin" roles can access this endpoint.
@router.get("/user_id")
async def get_user_roles_route(
    user_id: str
):
    return await fetch_user_roles(user_id)