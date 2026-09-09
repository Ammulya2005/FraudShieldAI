from bson import ObjectId
from backend.database.mongodb import db
from backend.app.core.config import (
    TRANSACTIONS_COLLECTION
)


async def create_transaction(
    transaction_data: dict
):
    result = await db[
        TRANSACTIONS_COLLECTION
    ].insert_one(transaction_data)

    return str(result.inserted_id)


async def get_all_transactions(page: int = 1, page_size: int = 50):
    transactions = []

    async for transaction in db[
        TRANSACTIONS_COLLECTION
    ].find().skip((page - 1) * page_size).limit(page_size):
        transaction["_id"] = str(
            transaction["_id"]
        )
        transactions.append(transaction)

    return transactions


async def get_transaction_by_id(
    transaction_id: str
):
    transaction = await db[
        TRANSACTIONS_COLLECTION
    ].find_one(
        {"transaction_id": transaction_id}
    )

    if transaction:
        transaction["_id"] = str(
            transaction["_id"]
        )

    return transaction


async def get_high_risk_transactions():
    transactions = []

    cursor = db[
        TRANSACTIONS_COLLECTION
    ].find(
        {
            "risk_score": {"$gte": 0.65}
        }
    )

    async for transaction in cursor:
        transaction["_id"] = str(
            transaction["_id"]
        )
        transactions.append(transaction)

    return transactions


async def get_fraudulent_transactions():
    transactions = []

    cursor = db[
        TRANSACTIONS_COLLECTION
    ].find(
        {
            "final_prediction": "fraud"
        }
    )

    async for transaction in cursor:
        transaction["_id"] = str(
            transaction["_id"]
        )
        transactions.append(transaction)

    return transactions


async def get_legitimate_transactions():
    transactions = []

    cursor = db[
        TRANSACTIONS_COLLECTION
    ].find(
        {
            "final_prediction": "legitimate"
        }
    )

    async for transaction in cursor:
        transaction["_id"] = str(
            transaction["_id"]
        )
        transactions.append(transaction)

    return transactions


async def count_transactions():
    return await db[TRANSACTIONS_COLLECTION].count_documents({})
async def search_transactions(search_term: str, limit: int = 20):
    """
    Search transactions across commonly used fields.
    """

    search_term = search_term.strip()

    if not search_term:
        return []

    regex = {
        "$regex": search_term,
        "$options": "i"
    }

    query = {
        "$or": [
            {"transaction_id": regex},
            {"user_id": regex},
            {"merchant_category": regex},
            {"transaction_type": regex},
            {"location": regex},
            {"final_prediction": regex},
            {"status": regex},
        ]
    }

    transactions = []

    cursor = (
        db[TRANSACTIONS_COLLECTION]
        .find(query)
        .sort("_id", -1)
        .limit(limit)
    )

    async for transaction in cursor:
        transaction["_id"] = str(transaction["_id"])
        transactions.append(transaction)

    return transactions