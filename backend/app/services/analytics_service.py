from backend.app.repositories.dashboard_repository import get_fraud_overview
from backend.app.repositories.transaction_repository import (
    get_all_transactions,
    get_fraudulent_transactions,
    get_high_risk_transactions
)


async def fetch_analytics_overview(start_date: str | None = None, end_date: str | None = None):
    total_transactions = await get_all_transactions()
    fraud_transactions = await get_fraudulent_transactions()
    high_risk_transactions = await get_high_risk_transactions()

    fraud_rate = 0.0
    if total_transactions:
        fraud_rate = round(len(fraud_transactions) / len(total_transactions) * 100, 2)

    return {
        "summary": {
            "start_date": start_date,
            "end_date": end_date,
            "total_transactions": len(total_transactions),
            "fraud_rate": fraud_rate,
            "high_risk_count": len(high_risk_transactions)
        }
    }


async def fetch_analytics_trends(interval: str = "daily"):
    return {
        "interval": interval,
        "trend_data": []
    }


async def fetch_risk_distribution():
    return {
        "risk_distribution": {
            "low": 0,
            "medium": 0,
            "high": 0
        }
    }