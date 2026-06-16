from fastapi import APIRouter, HTTPException

from backend.database.connection import get_database
from backend.app.utils.serializers import serialize_document, serialize_documents

router = APIRouter(prefix="/alerts", tags=["Alerts"])
db = get_database()
collection = db["fraud_alerts"]


@router.get("/")
async def get_alerts(limit: int = 50):
    try:
        cursor = collection.find().sort("created_at", -1).limit(limit)
        records = await cursor.to_list(length=limit)

        return serialize_documents(records)

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/critical")
async def get_critical_alerts():
    try:
        cursor = collection.find({
            "prediction.risk_level": "High Risk"
        })

        records = await cursor.to_list(length=100)

        return serialize_documents(records)

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/unresolved")
async def get_unresolved_alerts():
    try:
        cursor = collection.find({
            "status": {"$ne": "Resolved"}
        })

        records = await cursor.to_list(length=100)

        return serialize_documents(records)

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/{alert_id}")
async def get_alert(alert_id: str):
    try:
        record = await collection.find_one({
            "transaction.Transaction_ID": alert_id
        })

        if not record:
            raise HTTPException(status_code=404, detail="Alert not found")

        return serialize_document(record)

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.patch("/{alert_id}/acknowledge")
async def acknowledge_alert(alert_id: str):
    try:
        result = await collection.update_one(
            {"transaction.Transaction_ID": alert_id},
            {"$set": {"status": "Acknowledged"}}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Alert not found")

        return {"message": "Alert acknowledged successfully"}

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.patch("/{alert_id}/resolve")
async def resolve_alert(alert_id: str):
    try:
        result = await collection.update_one(
            {"transaction.Transaction_ID": alert_id},
            {"$set": {"status": "Resolved"}}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Alert not found")

        return {"message": "Alert resolved successfully"}

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.delete("/{alert_id}")
async def delete_alert(alert_id: str):
    try:
        result = await collection.delete_one({
            "transaction.Transaction_ID": alert_id
        })

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Alert not found")

        return {"message": "Alert deleted successfully"}

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))