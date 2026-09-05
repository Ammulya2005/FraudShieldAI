# This file defines the API routes for managing users in the application. It includes endpoints for fetching all users, fetching a user by ID, updating user information, deleting a user, and managing user account status (locking, unlocking, activating, deactivating). Access to these endpoints is restricted based on user roles, ensuring that only authorized users can perform specific actions related to user management.
from fastapi import (
    APIRouter,
    Depends
)

from backend.app.core.rbac import (
    require_roles
)

from backend.app.schemas.user_management_schema import (
    UserUpdate
)
# from backend.app.schemas.user_schema import (
from backend.app.services.user_service import (
    fetch_all_users,
    fetch_user_by_id,
    update_existing_user,
    remove_user,
    lock_user_account,
    unlock_user_account,
    activate_user_account,
    deactivate_user_account
)

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

# Endpoint to fetch all users. Only users with the "admin" or "super_admin" roles can access this endpoint.
@router.get("/")
async def get_all_users(
    current_user=Depends(
        require_roles(
            ["admin", "super_admin"]
        )
    )
):
    return await fetch_all_users()

# Endpoint to fetch a user by their ID. Only users with the "admin" or "super_admin" roles can access this endpoint.
@router.get("/user_id")
async def get_user(
    user_id: str,
    current_user=Depends(
        require_roles(
            ["admin", "super_admin"]
        )
    )
):
    return await fetch_user_by_id(user_id)

# Endpoint to update user information. Only users with the "admin" or "super_admin" roles can access this endpoint.
@router.put("/user_id")
async def update_user_route(
    user_id: str,
    request: UserUpdate,
    current_user=Depends(
        require_roles(
            ["admin", "super_admin"]
        )
    )
):
    return await update_existing_user(
        user_id,
        request.model_dump(exclude_none=True)
    )

# Endpoint to delete a user. Only users with the "super_admin" role can access this endpoint.
@router.delete("/user_id")
async def delete_user_route(
    user_id: str,
    current_user=Depends(
        require_roles(
            ["super_admin"]
        )
    )
):
    return await remove_user(user_id)

# Endpoint to lock a user account. Only users with the "admin" or "super_admin" roles can access this endpoint.
@router.patch("/user_id/lock")
async def lock_user_route(
    user_id: str,
    current_user=Depends(
        require_roles(
            ["admin", "super_admin"]
        )
    )
):
    return await lock_user_account(user_id)

# Endpoint to unlock a user account. Only users with the "admin" or "super_admin" roles can access this endpoint.
@router.patch("/user_id/unlock")
async def unlock_user_route(
    user_id: str,
    current_user=Depends(
        require_roles(
            ["admin", "super_admin"]
        )
    )
):
    return await unlock_user_account(user_id)

# Endpoint to activate a user account. Only users with the "admin" or "super_admin" roles can access this endpoint.
@router.patch("/user_id/activate")
async def activate_user_route(
    user_id: str,
    current_user=Depends(
        require_roles(
            ["admin", "super_admin"]
        )
    )
):
    return await activate_user_account(user_id)

# Endpoint to deactivate a user account. Only users with the "admin" or "super_admin" roles can access this endpoint.
@router.patch("/user_id/deactivate")
async def deactivate_user_route(
    user_id: str,
    current_user=Depends(
        require_roles(
            ["admin", "super_admin"]
        )
    )
):
    return await deactivate_user_account(user_id)