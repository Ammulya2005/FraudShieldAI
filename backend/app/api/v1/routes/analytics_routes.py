from fastapi import APIRouter

from backend.database.transaction_repository import get_recent_transactions
from backend.database.alert_repository import get_recent_alerts

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/fraud-trends")
async def fraud_trends():
    return {"message": "Fraud trends endpoint ready"}


@router.get("/transaction-volume")
async def transaction_volume():
    transactions = await get_recent_transactions(1000)
    return {"transaction_volume": len(transactions)}


@router.get("/merchant-risk")
async def merchant_risk():
    return {"message": "Merchant risk endpoint ready"}


@router.get("/location-risk")
async def location_risk():
    return {"message": "Location risk endpoint ready"}


@router.get("/device-risk")
async def device_risk():
    return {"message": "Device risk endpoint ready"}


@router.get("/hourly-fraud-rate")
async def hourly_fraud_rate():
    return {"message": "Hourly fraud rate endpoint ready"}


@router.get("/monthly-summary")
async def monthly_summary():
    transactions = await get_recent_transactions(1000)
    alerts = await get_recent_alerts(1000)

    total_transactions = len(transactions)
    total_alerts = len(alerts)

    fraud_rate = (
        round((total_alerts / total_transactions) * 100, 2)
        if total_transactions > 0
        else 0
    )

    return {
        "total_transactions": total_transactions,
        "total_fraud_alerts": total_alerts,
        "fraud_rate": fraud_rate
    }