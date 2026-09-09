from datetime import datetime

from backend.database.mongodb import db
from backend.app.core.config import (
    FRAUD_CASES_COLLECTION
)


async def create_fraud_case(case_data: dict):
    result = await db[
        FRAUD_CASES_COLLECTION
    ].insert_one(case_data)

    return str(result.inserted_id)


async def get_all_fraud_cases(page: int = 1, page_size: int = 50):
    fraud_cases = []

    async for fraud_case in db[
        FRAUD_CASES_COLLECTION
    ].find().sort("created_at", -1).skip((page - 1) * page_size).limit(page_size):
        fraud_case["_id"] = str(fraud_case["_id"])
        fraud_cases.append(fraud_case)

    return fraud_cases


async def count_fraud_cases():
    return await db[FRAUD_CASES_COLLECTION].count_documents({})


async def get_fraud_case_by_case_id(case_id: str):
    fraud_case = await db[
        FRAUD_CASES_COLLECTION
    ].find_one({"case_id": case_id})

    if fraud_case:
        fraud_case["_id"] = str(fraud_case["_id"])

    return fraud_case


async def update_fraud_case(
    case_id: str,
    update_data: dict
):
    result = await db[
        FRAUD_CASES_COLLECTION
    ].update_one(
        {"case_id": case_id},
        {
            "$set": update_data
        }
    )

    return result.modified_count


async def delete_fraud_case(case_id: str):
    result = await db[
        FRAUD_CASES_COLLECTION
    ].delete_one({"case_id": case_id})

    return result.deleted_count


async def assign_fraud_case(
    case_id: str,
    assigned_to: str
):
    result = await db[
        FRAUD_CASES_COLLECTION
    ].update_one(
        {"case_id": case_id},
        {
            "$set": {
                "assigned_to": assigned_to,
                "status": "assigned",
                "updated_at": datetime.utcnow()
            }
        }
    )

    return result.modified_count


async def close_fraud_case(
    case_id: str,
    resolution: str,
    review_notes: str | None = None
):
    update_payload = {
        "status": "closed",
        "resolution": resolution,
        "closed_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    if review_notes is not None:
        update_payload["review_notes"] = review_notes

    result = await db[
        FRAUD_CASES_COLLECTION
    ].update_one(
        {"case_id": case_id},
        {
            "$set": update_payload
        }
    )

    return result.modified_count


async def get_fraud_case_count():
    return await db[
        FRAUD_CASES_COLLECTION
    ].count_documents({})
async def search_fraud_cases(search_term: str, limit: int = 20):
    """
    Search fraud cases by case ID, transaction ID, user ID,
    prediction, priority, status, or assigned user.
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
            {"case_id": regex},
            {"transaction_id": regex},
            {"user_id": regex},
            {"final_prediction": regex},
            {"priority": regex},
            {"status": regex},
            {"assigned_to": regex}
        ]
    }

    fraud_cases = []

    cursor = (
        db[FRAUD_CASES_COLLECTION]
        .find(query)
        .sort("created_at", -1)
        .limit(limit)
    )

    async for fraud_case in cursor:
        fraud_case["_id"] = str(fraud_case["_id"])
        fraud_cases.append(fraud_case)

    return fraud_cases