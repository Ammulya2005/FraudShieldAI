from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str
    confirm_password: str


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None


class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    is_active: bool
    is_locked: bool
    is_verified: bool

    class Config:
        from_attributes = True


class UserProfile(BaseModel):
    username: str
    email: str
    is_active: bool
    is_locked: bool
    is_verified: bool