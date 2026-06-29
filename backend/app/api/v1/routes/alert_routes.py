from fastapi import APIRouter, Depends

from backend.app.core.rbac import (
    require_roles
)
from backend.app.schemas.alert_schema import (
    AlertCreate,
    AlertUpdate,
    AlertAssignRequest,
    AlertResolveRequest
)
from backend.app.services.alert_service import (
    create_new_alert,
    fetch_all_alerts,
    fetch_alert,
    update_existing_alert,
    delete_existing_alert,
    assign_existing_alert,
    acknowledge_existing_alert,
    resolve_existing_alert
)

router = APIRouter(
    prefix="/api/v1/alerts",
    tags=["Alerts"]
)


@router.post("")
async def create_alert_route(
    alert: AlertCreate,
    current_user=Depends(
        require_roles([
            "fraud_manager",
            "admin",
            "super_admin"
        ])
    )
):
    return await create_new_alert(alert)


@router.get("")
async def get_all_alerts_route(
    current_user=Depends(
        require_roles([
            "analyst",
            "fraud_manager",
            "admin",
            "super_admin"
        ])
    )
):
    return await fetch_all_alerts()


@router.get("/{alert_id}")
async def get_alert_route(
    alert_id: str,
    current_user=Depends(
        require_roles([
            "analyst",
            "fraud_manager",
            "admin",
            "super_admin"
        ])
    )
):
    return await fetch_alert(alert_id)


@router.put("/{alert_id}")
async def update_alert_route(
    alert_id: str,
    alert_update: AlertUpdate,
    current_user=Depends(
        require_roles([
            "fraud_manager",
            "admin",
            "super_admin"
        ])
    )
):
    return await update_existing_alert(
        alert_id,
        alert_update
    )


@router.delete("/{alert_id}")
async def delete_alert_route(
    alert_id: str,
    current_user=Depends(
        require_roles([
            "admin",
            "super_admin"
        ])
    )
):
    return await delete_existing_alert(alert_id)


@router.patch("/{alert_id}/assign")
async def assign_alert_route(
    alert_id: str,
    request: AlertAssignRequest,
    current_user=Depends(
        require_roles([
            "fraud_manager",
            "admin",
            "super_admin"
        ])
    )
):
    return await assign_existing_alert(
        alert_id,
        request.assigned_to
    )


@router.patch("/{alert_id}/acknowledge")
async def acknowledge_alert_route(
    alert_id: str,
    current_user=Depends(
        require_roles([
            "analyst",
            "fraud_manager",
            "admin",
            "super_admin"
        ])
    )
):
    return await acknowledge_existing_alert(alert_id)


@router.patch("/{alert_id}/resolve")
async def resolve_alert_route(
    alert_id: str,
    request: AlertResolveRequest,
    current_user=Depends(
        require_roles([
            "fraud_manager",
            "admin",
            "super_admin"
        ])
    )
):
    return await resolve_existing_alert(
        alert_id,
        request.resolution_note
    )