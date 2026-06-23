from backend.app.repositories.audit_repository import (
	log_audit,
	get_audit_logs
)


async def record_event(event_type: str, user_id: str | None = None, details: dict | None = None):
	return await log_audit(event_type, user_id, details)


async def fetch_audit_logs(limit: int = 100):
	return await get_audit_logs(limit)

