from backend.database.mongodb import db
from backend.app.core.config import PERMISSIONS_COLLECTION


async def create_permission(permission_data: dict):
    result = await db[PERMISSIONS_COLLECTION].insert_one(permission_data)
    return str(result.inserted_id)


async def get_permission_by_id(permission_id: str):
    permission = await db[PERMISSIONS_COLLECTION].find_one({"permission_id": permission_id})

    if permission:
        permission["_id"] = str(permission["_id"])

    return permission


async def get_all_permissions():
    permissions = []
    async for permission in db[PERMISSIONS_COLLECTION].find().sort("name", 1):
        permission["_id"] = str(permission["_id"])
        permissions.append(permission)

    return permissions


async def update_permission(permission_id: str, update_data: dict):
    result = await db[PERMISSIONS_COLLECTION].update_one(
        {"permission_id": permission_id},
        {"$set": update_data}
    )

    return result.modified_count


async def delete_permission(permission_id: str):
    result = await db[PERMISSIONS_COLLECTION].delete_one({"permission_id": permission_id})
    return result.deleted_count