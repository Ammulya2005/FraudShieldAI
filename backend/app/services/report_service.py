from uuid import uuid4
from datetime import datetime
from backend.app.repositories.dashboard_repository import get_dashboard_summary


async def generate_report(params: dict | None = None) -> dict:
	summary = await get_dashboard_summary()
	report = {
		"report_id": f"RPT-{uuid4().hex[:10].upper()}",
		"generated_at": datetime.utcnow().isoformat(),
		"summary": summary
	}
	return report