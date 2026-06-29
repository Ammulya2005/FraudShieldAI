from backend.app.repositories.notification_repository import (
    create_notification,
    get_notifications_for_user,
    get_notification_by_id,
    delete_notification
)


async def send_notification(notification_data):
    payload = notification_data.model_dump() if hasattr(notification_data, "model_dump") else dict(notification_data)
    inserted_id = await create_notification(payload)

    return {
        "message": "Notification queued successfully",
        "notification_db_id": inserted_id
    }


async def fetch_notifications(user_id: str | None = None):
    return await get_notifications_for_user(user_id)


async def fetch_notification(notification_id: str):
    return await get_notification_by_id(notification_id)


async def remove_notification(notification_id: str):
    deleted_count = await delete_notification(notification_id)
    return {"deleted_count": deleted_count}