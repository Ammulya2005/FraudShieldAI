from datetime import datetime
from uuid import uuid4

from fastapi import HTTPException, status

from backend.app.repositories.alert_repository import (
    create_alert,
    get_all_alerts,
    get_alert_by_alert_id,
    update_alert,
    delete_alert,
    assign_alert,
    acknowledge_alert,
    resolve_alert
)


def generate_alert_id() -> str:
    return f"ALT-{uuid4().hex[:10].upper()}"


async def create_new_alert(alert):
    alert_data = {
        "alert_id": generate_alert_id(),
        "transaction_id": alert.transaction_id,
        "user_id": alert.user_id,
        "risk_score": alert.risk_score,
        "alert_type": alert.alert_type,
        "severity": alert.severity,
        "message": alert.message,
        "status": "open",
        "assigned_to": None,
        "resolution_note": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "resolved_at": None
    }

    inserted_id = await create_alert(alert_data)

    return {
        "message": "Alert created successfully",
        "alert_db_id": inserted_id,
        "alert_id": alert_data["alert_id"]
    }


async def fetch_all_alerts():
    return await get_all_alerts()


async def fetch_alert(alert_id: str):
    alert = await get_alert_by_alert_id(alert_id)

    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )

    return alert


async def update_existing_alert(
    alert_id: str,
    alert_update
):
    alert = await get_alert_by_alert_id(alert_id)

    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )

    update_data = alert_update.model_dump(exclude_none=True)

    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided for update"
        )

    update_data["updated_at"] = datetime.utcnow()

    await update_alert(alert_id, update_data)

    return {
        "message": "Alert updated successfully"
    }


async def delete_existing_alert(alert_id: str):
    alert = await get_alert_by_alert_id(alert_id)

    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )

    await delete_alert(alert_id)

    return {
        "message": "Alert deleted successfully"
    }


async def assign_existing_alert(
    alert_id: str,
    assigned_to: str
):
    alert = await get_alert_by_alert_id(alert_id)

    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )

    await assign_alert(alert_id, assigned_to)

    return {
        "message": "Alert assigned successfully",
        "alert_id": alert_id,
        "assigned_to": assigned_to
    }


async def acknowledge_existing_alert(alert_id: str):
    alert = await get_alert_by_alert_id(alert_id)

    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )

    if alert.get("status") == "resolved":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resolved alert cannot be acknowledged"
        )

    await acknowledge_alert(alert_id)

    return {
        "message": "Alert acknowledged successfully",
        "alert_id": alert_id
    }


async def resolve_existing_alert(
    alert_id: str,
    resolution_note: str | None = None
):
    alert = await get_alert_by_alert_id(alert_id)

    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )

    if alert.get("status") == "resolved":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Alert already resolved"
        )

    await resolve_alert(alert_id, resolution_note)

    return {
        "message": "Alert resolved successfully",
        "alert_id": alert_id
    }