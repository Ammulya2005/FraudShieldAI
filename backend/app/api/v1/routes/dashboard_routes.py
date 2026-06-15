from fastapi import APIRouter

from backend.database.transaction_repository import get_recent_transactions
from backend.database.alert_repository import get_recent_alerts

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
async def dashboard_summary():
    transactions = await get_recent_transactions(1000)
    alerts = await get_recent_alerts(1000)

    return {
        "total_transactions": len(transactions),
        "total_fraud_alerts": len(alerts),
        "system_status": "running"
    }


@router.get("/live-transactions")
async def live_transactions():
    return await get_recent_transactions(20)


@router.get("/fraud-stats")
async def fraud_stats():
    transactions = await get_recent_transactions(1000)
    alerts = await get_recent_alerts(1000)

    return {
        "total_transactions": len(transactions),
        "fraud_alerts": len(alerts)
    }


@router.get("/risk-distribution")
async def risk_distribution():
    return {"message": "Risk distribution endpoint ready"}


@router.get("/recent-alerts")
async def recent_alerts():
    return await get_recent_alerts(20)


@router.get("/top-risk-users")
async def top_risk_users():
    return {"message": "Top risk users endpoint ready"}


@router.get("/top-risk-locations")
async def top_risk_locations():
    return {"message": "Top risk locations endpoint ready"}