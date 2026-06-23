from fastapi import Depends, HTTPException, status

from backend.app.core.dependencies import (
    get_current_user
)

from backend.app.repositories.user_role_repository import (
    get_user_roles
)


def require_roles(allowed_roles: list):

    async def role_checker(
        current_user=Depends(get_current_user)
    ):

        user_roles = await get_user_roles(
            str(current_user["_id"])
        )

        if not user_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No role assigned"
            )

        if "super_admin" in user_roles:
            return current_user

        if not any(
            role in allowed_roles
            for role in user_roles
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )

        return current_user

    return role_checker