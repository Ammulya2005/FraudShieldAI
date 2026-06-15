from motor.motor_asyncio import AsyncIOMotorClient
from backend.app.core.config import (
    MONGO_URI,
    DATABASE_NAME
)

client = AsyncIOMotorClient(MONGO_URI)

db = client[DATABASE_NAME]
def get_database():
    """
    Return async MongoDB database instance.
    """
    return db