from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


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