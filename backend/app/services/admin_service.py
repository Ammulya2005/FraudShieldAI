from fastapi import HTTPException, status

from backend.app.repositories.user_repository import get_user_by_email
from backend.app.repositories.user_role_repository import assign_role


async def assign_super_admin(email: str):
    user = await get_user_by_email(email)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    await assign_role(str(user["_id"]), "super_admin")

    return {
        "message": "Super admin assigned successfully",
        "user_id": str(user["_id"])
    }