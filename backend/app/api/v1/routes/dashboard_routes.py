from fastapi import APIRouter, HTTPException

from backend.database.connection import get_database
from backend.app.utils.serializers import serialize_documents

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])
db = get_database()


@router.get("/summary")
async def dashboard_summary():
    try:
        total_transactions = await db["transactions"].count_documents({})
        total_alerts = await db["fraud_alerts"].count_documents({})

        fraud_rate = (
            round((total_alerts / total_transactions) * 100, 2)
            if total_transactions > 0
            else 0
        )

        return {
            "total_transactions": total_transactions,
            "total_fraud_alerts": total_alerts,
            "fraud_rate": fraud_rate,
            "system_status": "running"
        }

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/live-transactions")
async def live_transactions():
    try:
        cursor = db["transactions"].find().sort("created_at", -1).limit(20)
        records = await cursor.to_list(length=20)

        return serialize_documents(records)

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/fraud-stats")
async def fraud_stats():
    try:
        fraud_count = await db["fraud_alerts"].count_documents({})
        genuine_count = await db["transactions"].count_documents({}) - fraud_count

        return {
            "fraud_transactions": fraud_count,
            "genuine_transactions": genuine_count
        }

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/recent-alerts")
async def recent_alerts():
    try:
        cursor = db["fraud_alerts"].find().sort("created_at", -1).limit(10)
        records = await cursor.to_list(length=10)

        return serialize_documents(records)

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))