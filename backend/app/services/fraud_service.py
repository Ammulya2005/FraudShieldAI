from backend.app.repositories.fraud_repository import (
    get_fraud_summary,
    get_fraud_patterns,
    get_fraud_entities
)


async def fetch_fraud_summary():
    return await get_fraud_summary()


async def fetch_fraud_patterns(filter_type: str | None = None):
    return await get_fraud_patterns(filter_type)


async def fetch_fraud_entities(filter_type: str | None = None):
    return await get_fraud_entities(filter_type)