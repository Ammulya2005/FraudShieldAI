from datetime import datetime

from backend.database.mongodb import db
from backend.app.core.config import NOTIFICATIONS_COLLECTION


async def create_notification(notification_data: dict):
    notification_data.setdefault("created_at", datetime.utcnow())
    result = await db[NOTIFICATIONS_COLLECTION].insert_one(notification_data)
    return str(result.inserted_id)


async def get_notifications_for_user(user_id: str | None = None):
    query = {}

    if user_id:
        query["user_id"] = user_id

    notifications = []
    cursor = db[NOTIFICATIONS_COLLECTION].find(query).sort("created_at", -1)
    async for notification in cursor:
        notification["_id"] = str(notification["_id"])
        notifications.append(notification)

    return notifications


async def get_notification_by_id(notification_id: str):
    notification = await db[NOTIFICATIONS_COLLECTION].find_one({"notification_id": notification_id})

    if notification:
        notification["_id"] = str(notification["_id"])

    return notification


async def delete_notification(notification_id: str):
    result = await db[NOTIFICATIONS_COLLECTION].delete_one({"notification_id": notification_id})
    return result.deleted_count