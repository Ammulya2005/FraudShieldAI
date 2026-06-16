
from fastapi import APIRouter, HTTPException

from backend.database.connection import get_database
from backend.app.utils.serializers import (
    serialize_document,
    serialize_documents
)

router = APIRouter(
    prefix="/audit-logs",
    tags=["Audit Logs"]
)

db = get_database()
collection = db["audit_logs"]


@router.get("/")
async def get_audit_logs(limit: int = 100):
    try:
        cursor = (
            collection
            .find()
            .sort("timestamp", -1)
            .limit(limit)
        )

        logs = await cursor.to_list(length=limit)

        return serialize_documents(logs)

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


@router.get("/{log_id}")
async def get_audit_log(log_id: str):
    try:
        log = await collection.find_one(
            {"log_id": log_id}
        )

        if not log:
            raise HTTPException(
                status_code=404,
                detail="Audit log not found"
            )

        return serialize_document(log)

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


@router.get("/user/{user_id}")
async def get_logs_by_user(user_id: str):
    try:
        cursor = collection.find(
            {"user_id": user_id}
        ).sort("timestamp", -1)

        logs = await cursor.to_list(length=100)

        return serialize_documents(logs)

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


@router.get("/action/{action}")
async def get_logs_by_action(action: str):
    try:
        cursor = collection.find(
            {"action": action}
        ).sort("timestamp", -1)

        logs = await cursor.to_list(length=100)

        return serialize_documents(logs)

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


@router.post("/")
async def create_audit_log(log_data: dict):
    try:
        result = await collection.insert_one(
            log_data
        )

        created_log = await collection.find_one(
            {"_id": result.inserted_id}
        )

        return serialize_document(created_log)

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


@router.delete("/{log_id}")
async def delete_audit_log(log_id: str):
    try:
        result = await collection.delete_one(
            {"log_id": log_id}
        )

        if result.deleted_count == 0:
            raise HTTPException(
                status_code=404,
                detail="Audit log not found"
            )

        return {
            "message": "Audit log deleted successfully"
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )

