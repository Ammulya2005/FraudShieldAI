from fastapi import HTTPException

from backend.app.repositories.user_repository import (
    get_user_by_id
)

from backend.app.repositories.user_role_repository import (
    assign_role,
    get_user_roles
)


async def assign_user_role(request):

    user = await get_user_by_id(
        request.user_id
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    await assign_role(
        request.user_id,
        request.role_name
    )

    return {
        "message": "Role assigned successfully"
    }


async def fetch_user_roles(
    user_id: str
):

    return await get_user_roles(user_id)