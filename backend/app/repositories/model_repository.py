from datetime import datetime

from backend.database.mongodb import db
from backend.app.core.config import MODELS_COLLECTION


async def create_model(model_data: dict):
    model_data.setdefault("created_at", datetime.utcnow())
    result = await db[MODELS_COLLECTION].insert_one(model_data)
    return str(result.inserted_id)


async def get_all_models():
    models = []
    async for model in db[MODELS_COLLECTION].find().sort("created_at", -1):
        model["_id"] = str(model["_id"])
        models.append(model)

    return models


async def get_model_by_id(model_id: str):
    model = await db[MODELS_COLLECTION].find_one({"model_id": model_id})

    if model:
        model["_id"] = str(model["_id"])

    return model


async def update_model(model_id: str, update_data: dict):
    result = await db[MODELS_COLLECTION].update_one(
        {"model_id": model_id},
        {"$set": update_data}
    )

    return result.modified_count


async def delete_model(model_id: str):
    result = await db[MODELS_COLLECTION].delete_one({"model_id": model_id})
    return result.deleted_count