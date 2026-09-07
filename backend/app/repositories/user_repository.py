from bson import ObjectId

from backend.database.mongodb import db


USERS_COLLECTION = "users"


async def create_user(user_data: dict):

    result = await db[USERS_COLLECTION].insert_one(
        user_data
    )

    return str(result.inserted_id)


async def get_user_by_email(email: str):

    return await db[USERS_COLLECTION].find_one(
        {"email": email}
    )


async def get_user_by_id(user_id: str):

    return await db[USERS_COLLECTION].find_one(
        {"_id": ObjectId(user_id)}
    )


async def update_user(user_id: str, update_data: dict):

    return await db[USERS_COLLECTION].update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )


async def delete_user(user_id: str):

    return await db[USERS_COLLECTION].delete_one(
        {"_id": ObjectId(user_id)}
    )


async def get_all_users(page: int = 1, page_size: int = 50):

    users = []

    async for user in db[USERS_COLLECTION].find().skip((page - 1) * page_size).limit(page_size):
        user["_id"] = str(user["_id"])
        users.append(user)

    return users


async def count_users():
    return await db[USERS_COLLECTION].count_documents({})

async def update_user(
    user_id: str,
    update_data: dict
):

    return await db[USERS_COLLECTION].update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": update_data
        }
    )


async def delete_user(
    user_id: str
):

    return await db[USERS_COLLECTION].delete_one(
        {"_id": ObjectId(user_id)}
    )
async def update_user_password(
    user_id: str,
    hashed_password: str
):
    return await db[USERS_COLLECTION].update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "password": hashed_password
            }
        }
    )
async def change_password(
    user_id: str,
    hashed_password: str
):

    return await db[USERS_COLLECTION].update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "password": hashed_password
            }
        }
    )
