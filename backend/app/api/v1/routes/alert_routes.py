from fastapi import APIRouter

from backend.database.alert_repository import get_recent_alerts

router = APIRouter(prefix="/alerts", tags=["Alerts"])


@router.get("/")
async def fetch_alerts():
    return await get_recent_alerts()


@router.get("/critical")
async def critical_alerts():
    return {"message": "Critical alerts endpoint ready"}


@router.get("/unresolved")
async def unresolved_alerts():
    return {"message": "Unresolved alerts endpoint ready"}


@router.get("/{alert_id}")
async def get_alert(alert_id: str):
    return {"alert_id": alert_id, "message": "Alert detail endpoint ready"}


@router.patch("/{alert_id}/acknowledge")
async def acknowledge_alert(alert_id: str):
    return {"alert_id": alert_id, "message": "Alert acknowledged"}


@router.patch("/{alert_id}/resolve")
async def resolve_alert(alert_id: str):
    return {"alert_id": alert_id, "message": "Alert resolved"}


@router.delete("/{alert_id}")
async def delete_alert(alert_id: str):
    return {"alert_id": alert_id, "message": "Alert deleted"}