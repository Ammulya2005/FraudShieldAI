import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = "mongodb://localhost:27017"

async def create_collections():
    client = AsyncIOMotorClient(MONGO_URI)

    db = client["fraudshield_ai"]

    existing = await db.list_collection_names()

    collections = [
        "transactions",
        "fraud_alerts",
        "predictions",
        "fraud_logs"
    ]

    for collection in collections:
        if collection not in existing:
            await db.create_collection(collection)
            print(f"Created: {collection}")
        else:
            print(f"Already Exists: {collection}")

    print("\nAll Collections Ready!")

asyncio.run(create_collections())

