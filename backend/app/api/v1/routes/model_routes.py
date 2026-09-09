from pathlib import Path
from datetime import datetime
from typing import Any, Dict

from fastapi import APIRouter, Body, Depends

from backend.app.core.rbac import require_roles

router = APIRouter(prefix="/models", tags=["Models"])


# =========================================================
# MODEL ARTIFACT DIRECTORY
# =========================================================

MODEL_DIR = (
    Path(__file__).resolve().parents[4]
    / "ML"
    / "saved_models"
)


# =========================================================
# MODEL REGISTRY
# =========================================================

MODEL_ARTIFACTS = [
    {
        "name": "XGBoost",
        "version": "v2.1",
        "filename": "xgboost_model.pkl",
        "type": "Supervised Classification",
    },
    {
        "name": "Random Forest",
        "version": "v1.0",
        "filename": "random_forest_model.pkl",
        "type": "Supervised Classification",
    },
    {
        "name": "Isolation Forest",
        "version": "v1.0",
        "filename": "isolation_forest_model.pkl",
        "type": "Anomaly Detection",
    },
]


# =========================================================
# START TRAINING
# =========================================================

@router.post("/train")
async def train_model(
    payload: Dict[str, Any] = Body(default={}),
    current_user=Depends(
        require_roles(["admin", "super_admin"])
    )
):
    return {
        "message": "Model training request accepted",
        "status": "queued",
        "model": "Isolation Forest",
        "payload": payload,
    }


# =========================================================
# LIST MODELS
# =========================================================

@router.get("")
async def list_models(
    current_user=Depends(
        require_roles(
            [
                "analyst",
                "fraud_manager",
                "admin",
                "super_admin",
            ]
        )
    )
):

    models = []

    for artifact in MODEL_ARTIFACTS:

        artifact_path = MODEL_DIR / artifact["filename"]

        if not artifact_path.exists():
            continue

        stat = artifact_path.stat()

        models.append(
            {
                "name": artifact["name"],
                "version": artifact["version"],
                "filename": artifact["filename"],
                "type": artifact["type"],
                "created_at": datetime.fromtimestamp(
                    stat.st_mtime
                ).isoformat(),
                "status": "Operational",
                "artifact_exists": True,
                "size_bytes": stat.st_size,
            }
        )

    return {
        "models": models,
        "total": len(models),
    }


# =========================================================
# MODEL DETAILS
# =========================================================

@router.get("/{model_id}")
async def get_model(
    model_id: str,
    current_user=Depends(
        require_roles(
            [
                "analyst",
                "fraud_manager",
                "admin",
                "super_admin",
            ]
        )
    )
):

    for artifact in MODEL_ARTIFACTS:

        if (
            artifact["name"].lower().replace(" ", "-")
            == model_id.lower()
            or artifact["filename"]
            == model_id
        ):

            artifact_path = MODEL_DIR / artifact["filename"]

            return {
                "model_id": model_id,
                "name": artifact["name"],
                "version": artifact["version"],
                "filename": artifact["filename"],
                "type": artifact["type"],
                "artifact_exists": artifact_path.exists(),
                "status": (
                    "Operational"
                    if artifact_path.exists()
                    else "Missing"
                ),
            }

    return {
        "model_id": model_id,
        "details": None,
    }


# =========================================================
# DEPLOY MODEL
# =========================================================

@router.post("/{model_id}/deploy")
async def deploy_model(
    model_id: str,
    current_user=Depends(
        require_roles(["admin", "super_admin"])
    )
):

    return {
        "model_id": model_id,
        "status": "deploying",
    }


# =========================================================
# MODEL PREDICTION
# =========================================================

@router.post("/{model_id}/predict")
async def predict_with_model(
    model_id: str,
    input_data: Dict[str, Any] = Body(...),
    current_user=Depends(
        require_roles(
            [
                "analyst",
                "fraud_manager",
                "admin",
                "super_admin",
            ]
        )
    )
):

    return {
        "model_id": model_id,
        "input": input_data,
        "prediction": None,
    }