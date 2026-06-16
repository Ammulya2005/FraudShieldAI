from datetime import datetime

from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel

from backend.app.schemas.user_schema import (
    UserRegister,
    UserLogin
)

from backend.app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)

from backend.database.connection import get_database
from backend.database.user_repository import (
    create_user,
    get_user_by_email
)

router = APIRouter()

db = get_database()

users_collection = db["users"]
audit_collection = db["audit_logs"]


# -----------------------------
# CHANGE PASSWORD SCHEMA
# -----------------------------
class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str
    confirm_password: str


# -----------------------------
# REGISTER
# -----------------------------
@router.post("/register")
async def register(user: UserRegister):
    try:
        # Check password match
        if user.password != user.confirm_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password and confirm password do not match"
            )

        # Check existing user
        existing_user = await get_user_by_email(user.email)

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already exists"
            )

        # Create user data
        user_data = {
            "name": user.name,
            "email": user.email,
            "password": hash_password(user.password),
            "role": "Analyst",
            "is_active": True,
            "created_at": datetime.utcnow()
        }

        created_user = await create_user(user_data)

        # Audit log
        await audit_collection.insert_one({
            "user_email": user.email,
            "action": "REGISTER",
            "message": "User registered successfully",
            "timestamp": datetime.utcnow()
        })

        return {
            "message": "User registered successfully",
            "user": created_user
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Registration failed: {str(error)}"
        )


# -----------------------------
# LOGIN
# -----------------------------
@router.post("/login")
async def login(user: UserLogin):
    try:
        existing_user = await get_user_by_email(user.email)

        if not existing_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        # Verify password
        if not verify_password(
            user.password,
            existing_user["password"]
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        # Check active user
        if not existing_user.get("is_active", True):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive"
            )

        # Generate JWT token
        access_token = create_access_token({
            "_id": str(existing_user["_id"]),
            "email": existing_user["email"],
            "role": existing_user["role"]
        })

        # Audit log
        await audit_collection.insert_one({
            "user_id": str(existing_user["_id"]),
            "email": existing_user["email"],
            "action": "LOGIN",
            "message": "User logged in successfully",
            "timestamp": datetime.utcnow()
        })

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(existing_user["_id"]),
                "name": existing_user["name"],
                "email": existing_user["email"],
                "role": existing_user["role"]
            }
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Login failed: {str(error)}"
        )


# -----------------------------
# LOGOUT
# -----------------------------
@router.post("/logout")
async def logout(
    current_user: dict = Depends(get_current_user)
):
    try:
        await audit_collection.insert_one({
            "user_id": current_user.get("_id"),
            "email": current_user.get("email"),
            "action": "LOGOUT",
            "message": "User logged out successfully",
            "timestamp": datetime.utcnow()
        })

        return {
            "message": "Logout successful"
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Logout failed: {str(error)}"
        )


# -----------------------------
# REFRESH TOKEN
# -----------------------------
@router.post("/refresh-token")
async def refresh_token(
    current_user: dict = Depends(get_current_user)
):
    try:
        new_token = create_access_token({
            "_id": current_user.get("_id"),
            "email": current_user.get("email"),
            "role": current_user.get("role")
        })

        return {
            "access_token": new_token,
            "token_type": "bearer"
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Token refresh failed: {str(error)}"
        )


# -----------------------------
# CHANGE PASSWORD
# -----------------------------
@router.put("/change-password")
async def change_password(
    password_data: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user)
):
    try:
        # Get user from DB
        db_user = await get_user_by_email(
            current_user["email"]
        )

        if not db_user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        # Verify old password
        if not verify_password(
            password_data.old_password,
            db_user["password"]
        ):
            raise HTTPException(
                status_code=400,
                detail="Old password is incorrect"
            )

        # Check new password match
        if (
            password_data.new_password
            != password_data.confirm_password
        ):
            raise HTTPException(
                status_code=400,
                detail="Passwords do not match"
            )

        # Prevent same password
        if password_data.old_password == password_data.new_password:
            raise HTTPException(
                status_code=400,
                detail="New password cannot be same as old password"
            )

        # Hash password
        hashed_password = hash_password(
            password_data.new_password
        )

        # Update password
        await users_collection.update_one(
            {"email": current_user["email"]},
            {
                "$set": {
                    "password": hashed_password,
                    "updated_at": datetime.utcnow()
                }
            }
        )

        # Audit log
        await audit_collection.insert_one({
            "user_id": str(db_user["_id"]),
            "email": db_user["email"],
            "action": "CHANGE_PASSWORD",
            "message": "Password changed successfully",
            "timestamp": datetime.utcnow()
        })

        return {
            "message": "Password updated successfully"
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Password change failed: {str(error)}"
)