# from fastapi import Depends, HTTPException, status
# from backend.app.core.dependencies import get_current_user
# from backend.app.repositories.user_role_repository import get_user_roles

# def require_roles(allowed_roles: list):
#     async def role_checker(current_user=Depends(get_current_user)):
#         # Retrieve all mapped distinct role keys for the active user context
#         user_roles = await get_user_roles(str(current_user["_id"]))

#         # 🛠️ LOCAL DEV TEST SAFEGUARD: Auto-fallback if database collection is empty
#         if not user_roles:
#             user_roles = ["user"]

#         # Immediate root control bypass optimization
#         if "superadmin" in user_roles or "super_admin" in user_roles:
#             return current_user

#         # Match any allowed roles against the user's active database roles
#         if not any(role in allowed_roles for role in user_roles):
#             raise HTTPException(
#                 status_code=status.HTTP_403_FORBIDDEN,
#                 detail=f"Access denied: This operation requires one of the following privileges: {allowed_roles}"
#             )

#         return current_user

#     return role_checker

from fastapi import Depends, HTTPException, status

from backend.app.core.dependencies import get_current_user
from backend.app.repositories.user_role_repository import get_user_roles


def require_roles(allowed_roles: list[str]):
    async def role_checker(
        current_user=Depends(get_current_user)
    ):
        user_roles = await get_user_roles(
            str(current_user["_id"])
        )

        # Normalize role names
        user_roles = [
            role.strip().lower()
            for role in user_roles
        ]

        allowed_roles_normalized = [
            role.strip().lower()
            for role in allowed_roles
        ]

        # Default role
        if not user_roles:
            user_roles = ["user"]

        # Super admin bypass
        if "super_admin" in user_roles:
            return current_user

        # Check permission
        if not any(
            role in allowed_roles_normalized
            for role in user_roles
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "Access denied. Required roles: "
                    f"{allowed_roles_normalized}"
                )
            )

        return current_user

    return role_checker