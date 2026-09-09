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


async def get_all_alerts(page: int = 1, page_size: int = 50):
    alerts = []

    async for alert in db[
        ALERTS_COLLECTION
    ].find().sort("created_at", -1).skip((page - 1) * page_size).limit(page_size):
        alert["_id"] = str(alert["_id"])
        alerts.append(alert)

    return alerts


async def count_alerts():
    return await db[ALERTS_COLLECTION].count_documents({})


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
async def search_fraud_cases(search_term: str, limit: int = 20):
    """
    Search fraud cases by case ID, transaction ID, user ID,
    prediction, priority, status, or assigned user.
    """

    search_term = search_term.strip()

    if not search_term:
        return []

    regex = {
        "$regex": search_term,
        "$options": "i"
    }

    query = {
        "$or": [
            {"case_id": regex},
            {"transaction_id": regex},
            {"user_id": regex},
            {"final_prediction": regex},
            {"priority": regex},
            {"status": regex},
            {"assigned_to": regex}
        ]
    }

    fraud_cases = []

    cursor = (
        db[FRAUD_CASES_COLLECTION]
        .find(query)
        .sort("created_at", -1)
        .limit(limit)
    )

    async for fraud_case in cursor:
        fraud_case["_id"] = str(fraud_case["_id"])
        fraud_cases.append(fraud_case)

    return fraud_cases
async def search_alerts(search_term: str, limit: int = 20):
    """
    Search alerts by alert ID, transaction ID, user ID,
    alert type, severity, status, assigned user, or message.
    """

    search_term = search_term.strip()

    if not search_term:
        return []

    regex = {
        "$regex": search_term,
        "$options": "i"
    }

    query = {
        "$or": [
            {"alert_id": regex},
            {"transaction_id": regex},
            {"user_id": regex},
            {"alert_type": regex},
            {"severity": regex},
            {"status": regex},
            {"assigned_to": regex},
            {"message": regex}
        ]
    }

    alerts = []

    cursor = (
        db[ALERTS_COLLECTION]
        .find(query)
        .sort("created_at", -1)
        .limit(limit)
    )

    async for alert in cursor:
        alert["_id"] = str(alert["_id"])
        alerts.append(alert)

    return alerts