from backend.app.repositories.dashboard_repository import (
    get_dashboard_summary,
    get_live_transactions,
    get_live_alerts,
    get_fraud_overview,
    get_risk_distribution,
    get_top_risk_users,
    get_top_risk_merchants,
    get_top_risk_locations,
    get_top_risk_devices
)

async def fetch_dashboard_summary():
    summary = await get_dashboard_summary()

    return {
        "message": "Dashboard summary fetched successfully",
        "data": summary
    }
async def fetch_live_transactions(limit: int = 10):
    transactions = await get_live_transactions(limit)

    return {
        "message": "Live transactions fetched successfully",
        "count": len(transactions),
        "data": transactions
    }

async def fetch_live_alerts(limit: int = 10):
    alerts = await get_live_alerts(limit)

    return {
        "message": "Live alerts fetched successfully",
        "count": len(alerts),
        "data": alerts
    }

async def fetch_fraud_overview():
    overview = await get_fraud_overview()

    return {
        "message": "Fraud overview fetched successfully",
        "data": overview
    }

async def fetch_risk_distribution():
    distribution = await get_risk_distribution()

    return {
        "message": "Risk distribution fetched successfully",
        "data": distribution
    }

async def fetch_top_risk_users(limit: int = 5):
    users = await get_top_risk_users(limit)

    return {
        "message": "Top risk users fetched successfully",
        "count": len(users),
        "data": users
    }
async def fetch_top_risk_merchants(limit: int = 5):
    merchants = await get_top_risk_merchants(limit)

    return {
        "message": "Top risk merchants fetched successfully",
        "count": len(merchants),
        "data": merchants
    }
async def fetch_top_risk_locations(limit: int = 5):
    locations = await get_top_risk_locations(limit)
    return {
        "message": "Top risk locations fetched successfully",
        "count": len(locations),
        "data": locations
    }
async def fetch_top_risk_devices(limit: int = 5):
    devices = await get_top_risk_devices(limit)
    return {
        "message": "Top risk devices fetched successfully",
        "count": len(devices),
        "data": devices
    }