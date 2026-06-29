from backend.database.mongodb import db

USER_ROLE_COLLECTION = "user_roles"


async def assign_role(
    user_id: str,
    role_name: str
):

    return await db[USER_ROLE_COLLECTION].insert_one(
        {
            "user_id": user_id,
            "role_name": role_name
        }
    )


async def get_user_roles(
    user_id: str
):

    roles = []

    async for role in db[USER_ROLE_COLLECTION].find(
        {"user_id": user_id}
    ):
        roles.append(role["role_name"])

    return roles