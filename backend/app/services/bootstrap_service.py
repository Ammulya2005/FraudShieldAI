from backend.app.repositories.user_repository import (
    get_user_by_email
)

from backend.app.repositories.user_role_repository import (
    assign_role
)


async def make_super_admin(
    email: str
):

    user = await get_user_by_email(email)

    if not user:
        return {
            "message": "User not found"
        }

    await assign_role(
        str(user["_id"]),
        "super_admin"
    )

    return {
        "message": "Super Admin assigned"
    }