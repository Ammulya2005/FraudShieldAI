from typing import Any, Dict

from fastapi import APIRouter, Body, Depends

from backend.app.core.rbac import require_roles

router = APIRouter(prefix="/api/v1/models", tags=["Models"])

@router.post("/train")
async def train_model(
    payload: Dict[str, Any] = Body(...),
    current_user=Depends(require_roles(["admin", "super_admin"]))
):
    return {
        "message": "Model training started",
        "payload": payload
    }

@router.get("")
async def list_models(
    current_user=Depends(require_roles(["analyst", "fraud_manager", "admin", "super_admin"]))
):
    return {"models": []}

@router.get("/{model_id}")
async def get_model(
    model_id: str,
    current_user=Depends(require_roles(["analyst", "fraud_manager", "admin", "super_admin"]))
):
    return {"model_id": model_id, "details": None}

@router.post("/{model_id}/deploy")
async def deploy_model(
    model_id: str,
    current_user=Depends(require_roles(["admin", "super_admin"]))
):
    return {"model_id": model_id, "status": "deploying"}

@router.post("/{model_id}/predict")
async def predict_with_model(
    model_id: str,
    input_data: Dict[str, Any] = Body(...),
    current_user=Depends(require_roles(["analyst", "fraud_manager", "admin", "super_admin"]))
):
    return {"model_id": model_id, "input": input_data, "prediction": None}
