from datetime import datetime
from bson import ObjectId

from backend.database.connection import get_database

db = get_database()
user_collection = db["users"]


def serialize_user(user):
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "is_active": user.get("is_active", True)
    }


async def create_user(user_data: dict):
    user_data["created_at"] = datetime.utcnow()
    user_data["is_active"] = True

    result = await user_collection.insert_one(user_data)

    user = await user_collection.find_one({"_id": result.inserted_id})

    return serialize_user(user)


async def get_user_by_email(email: str):
    return await user_collection.find_one({"email": email})


async def get_all_users():
    users = []

    cursor = user_collection.find()

    async for user in cursor:
        users.append(serialize_user(user))

    return users


async def get_user_by_id(user_id: str):
    user = await user_collection.find_one(
        {"_id": ObjectId(user_id)}
    )

    if user:
        return serialize_user(user)

    return None


async def update_user(user_id: str, update_data: dict):
    update_data = {
        key: value
        for key, value in update_data.items()
        if value is not None
    }

    await user_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )

    return await get_user_by_id(user_id)


async def delete_user(user_id: str):
    result = await user_collection.delete_one(
        {"_id": ObjectId(user_id)}
    )

    return result.deleted_count > 0