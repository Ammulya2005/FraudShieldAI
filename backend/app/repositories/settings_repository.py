from datetime import datetime

from backend.database.mongodb import db
from backend.app.core.config import SETTINGS_COLLECTION


async def get_settings_by_key(key: str):
    settings = await db[SETTINGS_COLLECTION].find_one({"key": key})

    if settings:
        settings["_id"] = str(settings["_id"])

    return settings


async def get_all_settings():
    settings = []
    async for item in db[SETTINGS_COLLECTION].find().sort("key", 1):
        item["_id"] = str(item["_id"])
        settings.append(item)

    return settings


async def update_settings(key: str, settings_data: dict):
    result = await db[SETTINGS_COLLECTION].update_one(
        {"key": key},
        {
            "$set": {
                "value": settings_data,
                "updated_at": datetime.utcnow()
            },
            "$setOnInsert": {
                "created_at": datetime.utcnow()
            }
        },
        upsert=True
    )

    return result.upserted_id or result.modified_count