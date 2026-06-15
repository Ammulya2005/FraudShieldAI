from fastapi import APIRouter

from backend.database.transaction_repository import get_recent_transactions

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.post("/")
async def create_transaction():
    return {"message": "Transaction creation endpoint ready"}


@router.get("/")
async def fetch_transactions():
    return await get_recent_transactions()


@router.get("/{transaction_id}")
async def get_transaction(transaction_id: str):
    return {"transaction_id": transaction_id, "message": "Transaction detail endpoint ready"}


@router.put("/{transaction_id}")
async def update_transaction(transaction_id: str):
    return {"transaction_id": transaction_id, "message": "Transaction update endpoint ready"}


@router.delete("/{transaction_id}")
async def delete_transaction(transaction_id: str):
    return {"transaction_id": transaction_id, "message": "Transaction delete endpoint ready"}


@router.get("/user/{user_id}")
async def get_user_transactions(user_id: str):
    return {"user_id": user_id, "message": "User transactions endpoint ready"}


@router.get("/status/{status}")
async def get_transactions_by_status(status: str):
    return {"status": status, "message": "Status filter endpoint ready"}


@router.get("/high-risk")
async def get_high_risk_transactions():
    return {"message": "High-risk transactions endpoint ready"}