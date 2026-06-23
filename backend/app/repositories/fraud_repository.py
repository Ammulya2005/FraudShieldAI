from backend.database.mongodb import db
from backend.app.core.config import (
    ALERTS_COLLECTION,
    FRAUD_CASES_COLLECTION,
    TRANSACTIONS_COLLECTION,
)


async def get_fraud_summary():
    total_cases = await db[FRAUD_CASES_COLLECTION].count_documents({})
    total_alerts = await db[ALERTS_COLLECTION].count_documents({})

    average_risk_score = 0.0
    pipeline = [
        {"$match": {"risk_score": {"$exists": True}}},
        {"$group": {"_id": None, "avgRisk": {"$avg": "$risk_score"}}}
    ]

    async for result in db[TRANSACTIONS_COLLECTION].aggregate(pipeline):
        average_risk_score = result.get("avgRisk", 0.0) or 0.0

    return {
        "cases": total_cases,
        "alerts": total_alerts,
        "average_risk_score": average_risk_score
    }


async def get_fraud_patterns(filter_type: str | None = None):
    if filter_type:
        group_field = f"${filter_type}"
    else:
        group_field = "$merchant_id"

    pipeline = [
        {"$match": {"final_prediction": "fraud"}},
        {"$group": {"_id": group_field, "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 25}
    ]

    patterns = []
    async for item in db[TRANSACTIONS_COLLECTION].aggregate(pipeline):
        patterns.append({
            "pattern": item["_id"],
            "count": item["count"]
        })

    return patterns


async def get_fraud_entities(filter_type: str | None = None):
    field = filter_type if filter_type else "user_id"
    query = {"final_prediction": "fraud"}

    entities = await db[TRANSACTIONS_COLLECTION].distinct(field, query)

    return [{"entity": entity, "type": field} for entity in entities]