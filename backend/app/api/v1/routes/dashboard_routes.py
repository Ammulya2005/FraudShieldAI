from fastapi import APIRouter, Depends, Query

from backend.app.core.rbac import (
    require_roles
)

from backend.app.services.dashboard_service import (
    fetch_dashboard_summary,
    fetch_live_transactions,
    fetch_live_alerts,
    fetch_fraud_overview,
    fetch_risk_distribution,
    fetch_top_risk_users,
    fetch_top_risk_merchants,
    fetch_top_risk_locations,
    fetch_top_risk_devices
)

router = APIRouter(
    prefix="/api/v1/dashboard",
    tags=["Dashboard"]
)

dashboard_access = [
    "analyst",
    "fraud_manager",
    "admin",
    "super_admin"
]

@router.get("/summary")
async def get_dashboard_summary_route(
    current_user=Depends(
        require_roles(dashboard_access)
    )
):
    return await fetch_dashboard_summary()

@router.get("/live-transactions")
async def get_live_transactions_route(
    limit: int = Query(10, ge=1, le=100),
    current_user=Depends(
        require_roles(dashboard_access)
    )
):
    return await fetch_live_transactions(limit)

@router.get("/live-alerts")
async def get_live_alerts_route(
    limit: int = Query(10, ge=1, le=100),
    current_user=Depends(
        require_roles(dashboard_access)
    )
):
    return await fetch_live_alerts(limit)

@router.get("/fraud-overview")
async def get_fraud_overview_route(
    current_user=Depends(
        require_roles(dashboard_access)
    )
):
    return await fetch_fraud_overview()
@router.get("/risk-distribution")
async def get_risk_distribution_route(
    current_user=Depends(
        require_roles(dashboard_access)
    )
):
    return await fetch_risk_distribution()

@router.get("/top-risk-users")
async def get_top_risk_users_route(
    limit: int = Query(5, ge=1, le=50),
    current_user=Depends(
        require_roles(dashboard_access)
    )
):
    return await fetch_top_risk_users(limit)

@router.get("/top-risk-merchants")
async def get_top_risk_merchants_route(
    limit: int = Query(5, ge=1, le=50),
    current_user=Depends(
        require_roles(dashboard_access)
    )
):
    return await fetch_top_risk_merchants(limit)

@router.get("/top-risk-locations")
async def get_top_risk_locations_route(
    limit: int = Query(5, ge=1, le=50),
    current_user=Depends(
        require_roles(dashboard_access)
    )
):
    return await fetch_top_risk_locations(limit)

@router.get("/top-risk-devices")
async def get_top_risk_devices_route(
    limit: int = Query(5, ge=1, le=50),
    current_user=Depends(
        require_roles(dashboard_access)
    )
):
    return await fetch_top_risk_devices(limit)