from backend.app.repositories.model_repository import (
    create_model,
    get_all_models,
    get_model_by_id,
    update_model,
    delete_model
)


async def train_model(model_data):
    model_payload = model_data.model_dump() if hasattr(model_data, "model_dump") else dict(model_data)
    inserted_id = await create_model(model_payload)

    return {
        "message": "Model training record created",
        "model_db_id": inserted_id
    }


async def fetch_models():
    return await get_all_models()


async def fetch_model(model_id: str):
    return await get_model_by_id(model_id)


async def deploy_model(model_id: str):
    return {
        "model_id": model_id,
        "status": "deploying"
    }


async def predict_with_model(model_id: str, input_data):
    payload = input_data.model_dump() if hasattr(input_data, "model_dump") else dict(input_data)
    return {
        "model_id": model_id,
        "input": payload,
        "prediction": None
    }