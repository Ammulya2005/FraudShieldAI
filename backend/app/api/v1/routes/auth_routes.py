from fastapi import APIRouter, Depends

from backend.app.core.dependencies import (
    get_current_user
)

from backend.app.schemas.auth_schema import (
    UserRegister,
    UserLogin,
    RefreshTokenRequest,
    ChangePasswordRequest
)

from backend.app.services.auth_service import (
    register_user,
    login_user,
    refresh_access_token,
    update_password
)
router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"]
)


@router.post("/register")
async def register(user: UserRegister):
    return await register_user(user)


@router.post("/login")
async def login(user: UserLogin):
    return await login_user(user)

@router.get("/me")
async def me(
    current_user=Depends(get_current_user)
):

    return {
        "id": str(current_user["_id"]),
        "username": current_user["username"],
        "email": current_user["email"],
        "is_active": current_user["is_active"],
        "is_verified": current_user["is_verified"]
    }
@router.post("/refresh-token")
async def refresh_token(
    request: RefreshTokenRequest
):

    return await refresh_access_token(
        request.refresh_token
    )
@router.put("/change-password")
async def change_password_route(
    request: ChangePasswordRequest,
    current_user=Depends(get_current_user)
):

    return await update_password(
        current_user,
        request.old_password,
        request.new_password,
        request.confirm_password
    )