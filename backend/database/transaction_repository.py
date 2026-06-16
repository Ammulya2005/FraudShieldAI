from datetime import datetime
from backend.database.connection import get_database
db = get_database()
transaction_collection = db["transactions"]
async def save_transaction(transaction_data: dict, prediction_result: dict):
    """
    Save transaction and prediction result asynchronously.
    """
    document = {
        "transaction": transaction_data,
        "prediction": prediction_result,
        "created_at": datetime.utcnow()
    }
    result = await transaction_collection.insert_one(document)
    return str(result.inserted_id)
async def get_recent_transactions(limit: int = 20):
    """
    Fetch recent transactions asynchronously.
    """
    cursor = transaction_collection.find().sort("created_at", -1).limit(limit)
    transactions = []
    async for record in cursor:
        record["_id"] = str(record["_id"])
        transactions.append(record)
    return transactions