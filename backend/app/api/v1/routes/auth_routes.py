from fastapi import APIRouter, HTTPException, status, Depends

from backend.app.schemas.user_schema import UserCreate, UserLogin
from backend.app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)
from backend.database.user_repository import (
    create_user,
    get_user_by_email
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
async def register(user: UserCreate):
    existing_user = await get_user_by_email(user.email)

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    user_data = user.dict()
    user_data["password"] = hash_password(user.password)

    created_user = await create_user(user_data)

    return {
        "message": "User registered successfully",
        "user": created_user
    }


@router.post("/login")
async def login(user: UserLogin):
    db_user = await get_user_by_email(user.email)

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_access_token(
        {
            "user_id": str(db_user["_id"]),
            "email": db_user["email"],
            "role": db_user["role"]
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": db_user["role"]
    }


@router.get("/me")
async def me(current_user: dict = Depends(get_current_user)):
    return current_user


@router.post("/logout")
async def logout():
    return {"message": "Logout handled on client side"}


@router.post("/refresh-token")
async def refresh_token():
    return {"message": "Refresh token endpoint ready"}


@router.put("/change-password")
async def change_password():
    return {"message": "Change password endpoint ready"}