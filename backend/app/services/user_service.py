from fastapi import HTTPException

from backend.app.repositories.user_repository import (
    get_all_users,
    get_user_by_id,
    update_user,
    delete_user
)


async def fetch_all_users():

    return await get_all_users()


async def fetch_user_by_id(
    user_id: str
):

    user = await get_user_by_id(user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user["_id"] = str(user["_id"])

    return user


async def update_existing_user(
    user_id: str,
    update_data: dict
):

    await update_user(
        user_id,
        update_data
    )

    return {
        "message": "User updated successfully"
    }


async def remove_user(
    user_id: str
):

    await delete_user(user_id)

    return {
        "message": "User deleted successfully"
    }


async def lock_user_account(
    user_id: str
):

    await update_user(
        user_id,
        {
            "is_locked": True
        }
    )

    return {
        "message": "User locked"
    }


async def unlock_user_account(
    user_id: str
):

    await update_user(
        user_id,
        {
            "is_locked": False
        }
    )

    return {
        "message": "User unlocked"
    }


async def activate_user_account(
    user_id: str
):

    await update_user(
        user_id,
        {
            "is_active": True
        }
    )

    return {
        "message": "User activated"
    }


async def deactivate_user_account(
    user_id: str
):

    await update_user(
        user_id,
        {
            "is_active": False
        }
    )

    return {
        "message": "User deactivated"
    }