from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, HTTPException

from backend.database.connection import get_database
from backend.app.utils.serializers import serialize_document, serialize_documents

router = APIRouter(prefix="/transactions", tags=["Transactions"])
db = get_database()
collection = db["transactions"]


@router.post("/")
async def create_transaction(transaction: dict):
    try:
        transaction["created_at"] = datetime.utcnow()
        result = await collection.insert_one(transaction)

        saved = await collection.find_one({"_id": result.inserted_id})
        return serialize_document(saved)

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/")
async def get_transactions(limit: int = 50):
    try:
        cursor = collection.find().sort("created_at", -1).limit(limit)
        records = await cursor.to_list(length=limit)

        return serialize_documents(records)

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/{transaction_id}")
async def get_transaction(transaction_id: str):
    try:
        query = {"transaction.Transaction_ID": transaction_id}

        record = await collection.find_one(query)

        if not record:
            raise HTTPException(status_code=404, detail="Transaction not found")

        return serialize_document(record)

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.put("/{transaction_id}")
async def update_transaction(transaction_id: str, update_data: dict):
    try:
        result = await collection.update_one(
            {"transaction.Transaction_ID": transaction_id},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Transaction not found")

        updated = await collection.find_one(
            {"transaction.Transaction_ID": transaction_id}
        )

        return serialize_document(updated)

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.delete("/{transaction_id}")
async def delete_transaction(transaction_id: str):
    try:
        result = await collection.delete_one(
            {"transaction.Transaction_ID": transaction_id}
        )

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Transaction not found")

        return {"message": "Transaction deleted successfully"}

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/user/{user_id}")
async def get_user_transactions(user_id: str):
    try:
        cursor = collection.find({"transaction.User_ID": user_id})
        records = await cursor.to_list(length=100)

        return serialize_documents(records)

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/status/{status}")
async def get_transactions_by_status(status: str):
    try:
        cursor = collection.find({"status": status})
        records = await cursor.to_list(length=100)

        return serialize_documents(records)

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get("/high-risk")
async def get_high_risk_transactions():
    try:
        cursor = collection.find({
            "prediction.risk_level": "High Risk"
        }).sort("created_at", -1)

        records = await cursor.to_list(length=100)

        return serialize_documents(records)

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))