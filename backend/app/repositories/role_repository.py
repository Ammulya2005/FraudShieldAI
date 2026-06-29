from backend.database.mongodb import db

ROLES_COLLECTION = "roles"


async def create_role(role_data: dict):

    result = await db[ROLES_COLLECTION].insert_one(
        role_data
    )

    return str(result.inserted_id)


async def get_role_by_name(role_name: str):

    return await db[ROLES_COLLECTION].find_one(
        {"name": role_name}
    )


async def get_all_roles():

    roles = []

    async for role in db[ROLES_COLLECTION].find():
        role["_id"] = str(role["_id"])
        roles.append(role)

    return roles