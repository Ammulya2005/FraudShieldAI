from fastapi import APIRouter, HTTPException, Depends

from backend.app.schemas.user_schema import UserCreate, UserUpdate
from backend.app.core.security import (
    hash_password,
    require_roles
)
from backend.database.user_repository import (
    create_user,
    get_all_users,
    get_user_by_id,
    update_user,
    delete_user,
    get_user_by_email
)

router = APIRouter(
    prefix="/users",
    tags=["Users & RBAC"]
)


@router.get("/")
async def fetch_users(
    current_user: dict = Depends(
        require_roles(["Admin", "Super Admin"])
    )
):
    return await get_all_users()


@router.get("/{user_id}")
async def fetch_user(
    user_id: str,
    current_user: dict = Depends(
        require_roles(["Admin", "Super Admin"])
    )
):
    user = await get_user_by_id(user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@router.post("/")
async def add_user(
    user: UserCreate,
    current_user: dict = Depends(
        require_roles(["Admin", "Super Admin"])
    )
):
    existing_user = await get_user_by_email(user.email)

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    user_data = user.dict()
    user_data["password"] = hash_password(user.password)

    return await create_user(user_data)


@router.put("/{user_id}")
async def edit_user(
    user_id: str,
    user: UserUpdate,
    current_user: dict = Depends(
        require_roles(["Admin", "Super Admin"])
    )
):
    updated_user = await update_user(
        user_id,
        user.dict()
    )

    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")

    return updated_user


@router.delete("/{user_id}")
async def remove_user(
    user_id: str,
    current_user: dict = Depends(
        require_roles(["Super Admin"])
    )
):
    deleted = await delete_user(user_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User deleted successfully"}


@router.patch("/{user_id}/status")
async def change_user_status(
    user_id: str,
    is_active: bool,
    current_user: dict = Depends(
        require_roles(["Admin", "Super Admin"])
    )
):
    return await update_user(
        user_id,
        {"is_active": is_active}
    )


@router.patch("/{user_id}/role")
async def change_user_role(
    user_id: str,
    role: str,
    current_user: dict = Depends(
        require_roles(["Super Admin"])
    )
):
    return await update_user(
        user_id,
        {"role": role}
    )