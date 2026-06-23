from datetime import datetime

from backend.database.mongodb import db
from backend.app.core.config import (
    ALERTS_COLLECTION
)


async def create_alert(alert_data: dict):
    result = await db[
        ALERTS_COLLECTION
    ].insert_one(alert_data)

    return str(result.inserted_id)


async def get_all_alerts():
    alerts = []

    async for alert in db[
        ALERTS_COLLECTION
    ].find().sort("created_at", -1):
        alert["_id"] = str(alert["_id"])
        alerts.append(alert)

    return alerts


async def get_alert_by_alert_id(alert_id: str):
    alert = await db[
        ALERTS_COLLECTION
    ].find_one({"alert_id": alert_id})

    if alert:
        alert["_id"] = str(alert["_id"])

    return alert


async def update_alert(
    alert_id: str,
    update_data: dict
):
    result = await db[
        ALERTS_COLLECTION
    ].update_one(
        {"alert_id": alert_id},
        {"$set": update_data}
    )

    return result.modified_count


async def delete_alert(alert_id: str):
    result = await db[
        ALERTS_COLLECTION
    ].delete_one({"alert_id": alert_id})

    return result.deleted_count


async def assign_alert(
    alert_id: str,
    assigned_to: str
):
    result = await db[
        ALERTS_COLLECTION
    ].update_one(
        {"alert_id": alert_id},
        {
            "$set": {
                "assigned_to": assigned_to,
                "status": "assigned",
                "updated_at": datetime.utcnow()
            }
        }
    )

    return result.modified_count


async def acknowledge_alert(alert_id: str):
    result = await db[
        ALERTS_COLLECTION
    ].update_one(
        {"alert_id": alert_id},
        {
            "$set": {
                "status": "acknowledged",
                "updated_at": datetime.utcnow()
            }
        }
    )

    return result.modified_count


async def resolve_alert(
    alert_id: str,
    resolution_note: str | None = None
):
    update_payload = {
        "status": "resolved",
        "resolved_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    if resolution_note is not None:
        update_payload["resolution_note"] = resolution_note

    result = await db[
        ALERTS_COLLECTION
    ].update_one(
        {"alert_id": alert_id},
        {
            "$set": update_payload
        }
    )

    return result.modified_count