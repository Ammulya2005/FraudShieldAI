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


# async def get_user_roles(user_id: str) -> list:
#     # Look for the assignment doc matching the user_id
#     doc = await db[USER_ROLE_COLLECTION].find_one({"user_id": user_id})
#     if doc and "roles" in doc:
#         return doc["roles"]  # Should return an array like: ["user", "analyst"]
#     return []
async def get_user_roles(
    user_id: str
) -> list:

    cursor = db[USER_ROLE_COLLECTION].find(
        {
            "user_id": user_id
        }
    )

    roles = []

    async for doc in cursor:

        if "role_name" in doc:
            roles.append(
                doc["role_name"]
            )

    return roles
