from backend.app.repositories.audit_repository import (
    get_audit_logs,
    get_audit_log_by_id
)


async def fetch_audit_logs(user_id: str | None = None, action: str | None = None):
    return await get_audit_logs(user_id, action)


async def fetch_audit_log(audit_id: str):
    return await get_audit_log_by_id(audit_id)