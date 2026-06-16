from fastapi import APIRouter, HTTPException

from backend.database.connection import get_database

router = APIRouter(prefix="/analytics", tags=["Analytics"])
db = get_database()


@router.get("/monthly-summary")
async def monthly_summary():
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
            "fraud_rate": fraud_rate
        }

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/transaction-volume")
async def transaction_volume():
    try:
        count = await db["transactions"].count_documents({})
        return {"transaction_volume": count}

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/merchant-risk")
async def merchant_risk():
    try:
        pipeline = [
            {
                "$group": {
                    "_id": "$transaction.Merchant_Category",
                    "total": {"$sum": 1}
                }
            },
            {"$sort": {"total": -1}}
        ]

        result = await db["transactions"].aggregate(pipeline).to_list(length=20)

        return result

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/location-risk")
async def location_risk():
    try:
        pipeline = [
            {
                "$group": {
                    "_id": "$transaction.Location",
                    "total": {"$sum": 1}
                }
            },
            {"$sort": {"total": -1}}
        ]

        result = await db["transactions"].aggregate(pipeline).to_list(length=20)

        return result

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/device-risk")
async def device_risk():
    try:
        pipeline = [
            {
                "$group": {
                    "_id": "$transaction.Device_Type",
                    "total": {"$sum": 1}
                }
            },
            {"$sort": {"total": -1}}
        ]

        result = await db["transactions"].aggregate(pipeline).to_list(length=20)

        return result

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))