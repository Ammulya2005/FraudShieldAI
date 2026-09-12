from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from backend.database.mongodb import db
from backend.app.core.config import (
    TRANSACTIONS_COLLECTION,
    ALERTS_COLLECTION,
    FRAUD_CASES_COLLECTION,
    USERS_COLLECTION
)

async def get_dashboard_summary():
        # =========================================================
    # TODAY'S TRANSACTIONS
    # Dashboard counters reset at midnight.
    # Historical transactions remain untouched.
    # =========================================================

    today = datetime.now(
        ZoneInfo("Asia/Kolkata")
    )

    start_of_day = today.replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    start_of_next_day = (
        start_of_day +
        timedelta(days=1)
    )

    today_filter = {
        "created_at": {
            "$gte": start_of_day,
            "$lt": start_of_next_day
        }
    }

    total_transactions = await db[
        TRANSACTIONS_COLLECTION
    ].count_documents(
        today_filter
    )

    total_fraud_transactions = await db[
        TRANSACTIONS_COLLECTION
    ].count_documents({
        **today_filter,
        "final_prediction": "fraud"
    })

    total_legitimate_transactions = await db[
        TRANSACTIONS_COLLECTION
    ].count_documents({
        **today_filter,
        "final_prediction": "legitimate"
    })

    high_risk_transactions = await db[
        TRANSACTIONS_COLLECTION
    ].count_documents({
        **today_filter,
        "risk_score": {
            "$gte": 0.65
        }
    })
        # =========================================================
    # TODAY'S FRAUD CASES
    # Dashboard fraud-case counters reset at midnight.
    # Historical fraud cases remain untouched.
    # =========================================================

    total_fraud_cases = await db[
        FRAUD_CASES_COLLECTION
    ].count_documents({
        "created_at": {
            "$gte": start_of_day,
            "$lt": start_of_next_day
        }
    })

    open_fraud_cases = await db[
        FRAUD_CASES_COLLECTION
    ].count_documents({
        "created_at": {
            "$gte": start_of_day,
            "$lt": start_of_next_day
        },
        "status": {
            "$in": ["open", "assigned"]
        }
    })

    closed_fraud_cases = await db[
        FRAUD_CASES_COLLECTION
    ].count_documents({
        "created_at": {
            "$gte": start_of_day,
            "$lt": start_of_next_day
        },
        "status": "closed"
    })
    
    # =========================================================
    # TODAY'S ALERTS
    # Dashboard alert counters reset at midnight.
    # Historical alerts remain untouched.
    # =========================================================

    total_alerts = await db[
        ALERTS_COLLECTION
    ].count_documents({
        "created_at": {
            "$gte": start_of_day,
            "$lt": start_of_next_day
        }
    })

    open_alerts = await db[
        ALERTS_COLLECTION
    ].count_documents({
        "created_at": {
            "$gte": start_of_day,
            "$lt": start_of_next_day
        },
        "status": "open"
    })

    assigned_alerts = await db[
        ALERTS_COLLECTION
    ].count_documents({
        "created_at": {
            "$gte": start_of_day,
            "$lt": start_of_next_day
        },
        "status": "assigned"
    })

    acknowledged_alerts = await db[
        ALERTS_COLLECTION
    ].count_documents({
        "created_at": {
            "$gte": start_of_day,
            "$lt": start_of_next_day
        },
        "status": "acknowledged"
    })

    resolved_alerts = await db[
        ALERTS_COLLECTION
    ].count_documents({
        "created_at": {
            "$gte": start_of_day,
            "$lt": start_of_next_day
        },
        "status": "resolved"
    })

   
    total_users = await db[
        USERS_COLLECTION
    ].count_documents({})

    active_users = await db[
        USERS_COLLECTION
    ].count_documents({
        "is_active": True
    })

    verified_users = await db[
        USERS_COLLECTION
    ].count_documents({
        "is_verified": True
    })

    return {
        "total_transactions": total_transactions,
        "total_fraud_transactions": total_fraud_transactions,
        "total_legitimate_transactions": total_legitimate_transactions,
        "high_risk_transactions": high_risk_transactions,
        "total_fraud_cases": total_fraud_cases,
        "open_fraud_cases": open_fraud_cases,
        "closed_fraud_cases": closed_fraud_cases,
        "total_alerts": total_alerts,
        "open_alerts": open_alerts,
        "assigned_alerts": assigned_alerts,
        "acknowledged_alerts": acknowledged_alerts,
        "resolved_alerts": resolved_alerts,
        "total_users": total_users,
        "active_users": active_users,
        "verified_users": verified_users
    }

async def get_live_transactions(limit: int = 10):
    transactions = []

    cursor = db[
        TRANSACTIONS_COLLECTION
    ].find().sort("created_at", -1).limit(limit)

    async for transaction in cursor:
        transaction["_id"] = str(transaction["_id"])
        transactions.append(transaction)

    return transactions

async def get_live_alerts(limit: int = 10):
    alerts = []

    cursor = db[
        ALERTS_COLLECTION
    ].find().sort("created_at", -1).limit(limit)

    async for alert in cursor:
        alert["_id"] = str(alert["_id"])
        alerts.append(alert)

    return alerts

async def get_fraud_overview():

    # =========================================================
    # TODAY'S FRAUD OVERVIEW
    # =========================================================

    today = datetime.now(
        ZoneInfo("Asia/Kolkata")
    )

    start_of_day = today.replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    start_of_next_day = (
        start_of_day +
        timedelta(days=1)
    )

    today_filter = {
        "created_at": {
            "$gte": start_of_day,
            "$lt": start_of_next_day
        }
    }

    total_transactions = await db[
        TRANSACTIONS_COLLECTION
    ].count_documents(
        today_filter
    )

    fraud_transactions = await db[
        TRANSACTIONS_COLLECTION
    ].count_documents({
        **today_filter,
        "final_prediction": "fraud"
    })

    legitimate_transactions = await db[
        TRANSACTIONS_COLLECTION
    ].count_documents({
        **today_filter,
        "final_prediction": "legitimate"
    })

    return {
        "total_transactions": total_transactions,
        "fraud_transactions": fraud_transactions,
        "legitimate_transactions": legitimate_transactions
    }
async def get_risk_distribution():

    # =========================================================
    # TODAY'S RISK DISTRIBUTION
    # =========================================================

    today = datetime.now(
        ZoneInfo("Asia/Kolkata")
    )

    start_of_day = today.replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    start_of_next_day = (
        start_of_day +
        timedelta(days=1)
    )

    today_filter = {
        "created_at": {
            "$gte": start_of_day,
            "$lt": start_of_next_day
        }
    }

    # ---------------------------------------------------------
    # LOW RISK
    # ---------------------------------------------------------

    low_risk = await db[
        TRANSACTIONS_COLLECTION
    ].count_documents({
        **today_filter,
        "risk_score": {
            "$lt": 0.40
        }
    })

    # ---------------------------------------------------------
    # MEDIUM RISK
    # ---------------------------------------------------------

    medium_risk = await db[
        TRANSACTIONS_COLLECTION
    ].count_documents({
        **today_filter,
        "risk_score": {
            "$gte": 0.40,
            "$lt": 0.70
        }
    })

    # ---------------------------------------------------------
    # HIGH RISK
    # ---------------------------------------------------------

    high_risk = await db[
        TRANSACTIONS_COLLECTION
    ].count_documents({
        **today_filter,
        "risk_score": {
            "$gte": 0.70
        }
    })

    total = (
        low_risk +
        medium_risk +
        high_risk
    )

    return {
        "low_risk": low_risk,
        "medium_risk": medium_risk,
        "high_risk": high_risk,
        "total": total
    }

async def get_top_risk_users(limit: int = 5):
    today = datetime.now(
        ZoneInfo("Asia/Kolkata")
    )

    start_of_day = today.replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    start_of_next_day = (
        start_of_day +
        timedelta(days=1)
    )

    pipeline = [
        {
            "$match": {
                "created_at": {
                    "$gte": start_of_day,
                    "$lt": start_of_next_day
                },
                "$or": [
                    {"final_prediction": "fraud"},
                    {"risk_score": {"$gte": 0.65}}
                ]
            }
        },
        {
            "$sort": {
                "fraud_count": -1,
                "avg_risk_score": -1
            }
        },
        {
            "$limit": limit
        }
    ]

    results = []
    async for item in db[
        TRANSACTIONS_COLLECTION
    ].aggregate(pipeline):
        results.append({
            "user_id": item["_id"],
            "fraud_count": item["fraud_count"],
            "total_risk_score": round(
                item.get("total_risk_score", 0),
                2
            ),
            "avg_risk_score": round(
                item.get("avg_risk_score", 0),
                2
            ),
            "total_amount": round(
                item.get("total_amount", 0),
                2
            )
        })

    return results

async def get_top_risk_merchants(limit: int = 5):
    today = datetime.now(
        ZoneInfo("Asia/Kolkata")
    )

    start_of_day = today.replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    start_of_next_day = (
        start_of_day +
        timedelta(days=1)
    )
    pipeline = [
        {
            "$match": {
                "created_at": {
                    "$gte": start_of_day,
                    "$lt": start_of_next_day
                },
                "$or": [
                    {"final_prediction": "fraud"},
                    {"risk_score": {"$gte": 0.65}}
                ]
            }
        },
        {
            "$group": {
                "_id": "$merchant_category",
                "fraud_count": {"$sum": 1},
                "avg_risk_score": {"$avg": "$risk_score"},
                "total_amount": {"$sum": "$transaction_amount"}
            }
        },
        {
            "$sort": {
                "fraud_count": -1,
                "avg_risk_score": -1
            }
        },
        {
            "$limit": limit
        }
    ]

    results = []
    async for item in db[
        TRANSACTIONS_COLLECTION
    ].aggregate(pipeline):
        results.append({
            "merchant_category": item["_id"],
            "fraud_count": item["fraud_count"],
            "avg_risk_score": round(
                item.get("avg_risk_score", 0),
                2
            ),
            "total_amount": round(
                item.get("total_amount", 0),
                2
            )
        })

    return results

async def get_top_risk_locations(limit: int = 5):

    today = datetime.now(
        ZoneInfo("Asia/Kolkata")
    )

    start_of_day = today.replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    start_of_next_day = (
        start_of_day +
        timedelta(days=1)
    )

    pipeline = [
        {
            "$match": {
                "created_at": {
                    "$gte": start_of_day,
                    "$lt": start_of_next_day
                },
                "$or": [
                    {"final_prediction": "fraud"},
                    {"risk_score": {"$gte": 0.65}}
                ]
            }
        },
        {
            "$group": {
                "_id": "$location",
                "fraud_count": {"$sum": 1},
                "avg_risk_score": {"$avg": "$risk_score"},
                "total_amount": {"$sum": "$transaction_amount"}
            }
        },
        {
            "$sort": {
                "fraud_count": -1,
                "avg_risk_score": -1
            }
        },
        {
            "$limit": limit
        }
    ]

    results = []

    async for item in db[
        TRANSACTIONS_COLLECTION
    ].aggregate(pipeline):

        results.append({
            "location": item["_id"],
            "fraud_count": item["fraud_count"],
            "avg_risk_score": round(
                item.get("avg_risk_score", 0),
                2
            ),
            "total_amount": round(
                item.get("total_amount", 0),
                2
            )
        })

    return results
async def get_top_risk_devices(limit: int = 5):
    today = datetime.now(
        ZoneInfo("Asia/Kolkata")
    )

    start_of_day = today.replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    start_of_next_day = (
        start_of_day +
        timedelta(days=1)
    )
    pipeline = [
        {
            "$match": {
                "$or": [
                    {"final_prediction": "fraud"},
                    {"risk_score": {"$gte": 0.65}}
                ]
            }
        },
        {
            "$group": {
                "_id": "$device_type",
                "fraud_count": {"$sum": 1},
                "avg_risk_score": {"$avg": "$risk_score"},
                "total_amount": {"$sum": "$transaction_amount"}
            }
        },
        {
            "$sort": {
                "fraud_count": -1,
                "avg_risk_score": -1
            }
        },
        {
            "$limit": limit
        }
    ]
    results = []
    async for item in db[
        TRANSACTIONS_COLLECTION
    ].aggregate(pipeline):
        results.append({
            "device_type": item["_id"],
            "fraud_count": item["fraud_count"],
            "avg_risk_score": round(
                item.get("avg_risk_score", 0),
                2
            ),
            "total_amount": round(
                item.get("total_amount", 0),
                2
            )
        })
    return results