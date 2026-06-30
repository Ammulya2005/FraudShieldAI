from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from backend.app.core.dependencies import (
    get_current_user
)

from backend.app.schemas.auth_schema import (
    TokenResponse,
    UserRegister,
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
    prefix="/auth",
    tags=["Authentication"]
)


# Register
@router.post("/register")
async def register(
    user: UserRegister
):
    return await register_user(user)


# Login
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import Depends


@router.post("/login", response_model=TokenResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends()
):

    return await login_user(
        username=form_data.username,
        password=form_data.password
    )

# Current User Details
@router.get("/me")
async def me(
    current_user=Depends(
        get_current_user
    )
):

    return {
        "id": str(current_user["_id"]),
        "username": current_user["username"],
        "email": current_user["email"],
        "is_active": current_user["is_active"],
        "is_verified": current_user["is_verified"]
    }


# Refresh Token
@router.post("/refresh-token")
async def refresh_token(
    request: RefreshTokenRequest
):

    return await refresh_access_token(
        request.refresh_token
    )


# Change Password
@router.put("/change-password")
async def change_password_route(
    request: ChangePasswordRequest,
    current_user=Depends(
        get_current_user
    )
):

    return await update_password(
        current_user,
        request.old_password,
        request.new_password,
        request.confirm_password
    )