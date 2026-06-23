from datetime import datetime

from backend.database.mongodb import db
from backend.app.core.config import AUDIT_LOGS_COLLECTION


async def create_audit_log(log_data: dict):
    log_data.setdefault("created_at", datetime.utcnow())

    result = await db[AUDIT_LOGS_COLLECTION].insert_one(log_data)
    return str(result.inserted_id)


async def get_audit_logs(user_id: str | None = None, action: str | None = None):
    query = {}

    if user_id:
        query["user_id"] = user_id

    if action:
        query["action"] = action

    logs = []
    cursor = db[AUDIT_LOGS_COLLECTION].find(query).sort("created_at", -1)
    async for entry in cursor:
        entry["_id"] = str(entry["_id"])
        logs.append(entry)

    return logs


async def get_audit_log_by_id(audit_id: str):
    audit_log = await db[AUDIT_LOGS_COLLECTION].find_one({"audit_id": audit_id})

    if audit_log:
        audit_log["_id"] = str(audit_log["_id"])

    return audit_log