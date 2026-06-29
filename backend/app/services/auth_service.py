from fastapi import HTTPException, status

from backend.app.schemas.auth_schema import (
    UserRegister,
    UserLogin
)

from backend.app.core.jwt_handler import (
    create_access_token,
    create_refresh_token,
    verify_refresh_token
)
from backend.app.core.security import (
    hash_password,
    verify_password
)

from backend.app.repositories.user_repository import (
    create_user,
    get_user_by_email,
    change_password
)

async def register_user(user: UserRegister):

    existing_user = await get_user_by_email(
        user.email
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    if user.password != user.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match"
        )

    user_data = {
        "username": user.username,
        "email": user.email,
        "password": hash_password(
            user.password
        ),
        "is_active": True,
        "is_locked": False,
        "is_verified": False
    }

    user_id = await create_user(user_data)

    return {
        "message": "User registered successfully",
        "user_id": user_id
    }


async def login_user(user: UserLogin):

    db_user = await get_user_by_email(user.email)

    print("DB USER:", db_user)

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not verify_password(
        user.password,
        db_user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    access_token = create_access_token(
        {
            "sub": str(db_user["_id"]),
            "email": db_user["email"]
        }
    )

    print("ACCESS TOKEN:", access_token)

    refresh_token = create_refresh_token(
        {
            "sub": str(db_user["_id"])
        }
    )

    print("REFRESH TOKEN:", refresh_token)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }
async def update_password(
    current_user,
    old_password: str,
    new_password: str,
    confirm_password: str
):

    if not verify_password(
        old_password,
        current_user["password"]
    ):
        raise HTTPException(
            status_code=400,
            detail="Old password incorrect"
        )

    if new_password != confirm_password:
        raise HTTPException(
            status_code=400,
            detail="Passwords do not match"
        )

    await change_password(
        str(current_user["_id"]),
        hash_password(new_password)
    )

    return {
        "message": "Password changed successfully"
    }
async def refresh_access_token(
    refresh_token: str
):

    payload = verify_refresh_token(
        refresh_token
    )

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token"
        )

    user_id = payload.get("sub")

    access_token = create_access_token(
        {
            "sub": user_id
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }