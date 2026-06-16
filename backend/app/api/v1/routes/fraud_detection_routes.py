from fastapi import APIRouter

from backend.app.schemas.prediction_schema import TransactionInput, PredictionResponse
from backend.app.services.prediction_service import predict_transaction_service

router = APIRouter(prefix="/fraud", tags=["Fraud Detection"])


@router.post("/predict", response_model=PredictionResponse)
async def predict_fraud(transaction: TransactionInput):
    return await predict_transaction_service(transaction.dict())


@router.post("/batch-predict")
async def batch_predict():
    return {"message": "Batch prediction endpoint ready"}


@router.get("/history")
async def fraud_history():
    return {"message": "Fraud history endpoint ready"}


@router.get("/{transaction_id}")
async def get_fraud_by_transaction(transaction_id: str):
    return {"transaction_id": transaction_id, "message": "Fraud details endpoint ready"}


@router.patch("/{transaction_id}/review")
async def review_fraud(transaction_id: str):
    return {"transaction_id": transaction_id, "message": "Review endpoint ready"}


@router.patch("/{transaction_id}/mark-fraud")
async def mark_fraud(transaction_id: str):
    return {"transaction_id": transaction_id, "message": "Marked as fraud"}


@router.patch("/{transaction_id}/mark-legit")
async def mark_legit(transaction_id: str):
    return {"transaction_id": transaction_id, "message": "Marked as legitimate"}