from backend.ML.inference.predict_fraud import predict_single_transaction
from backend.database.transaction_repository import save_transaction
from backend.database.alert_repository import save_fraud_alert
async def predict_transaction_service(transaction_data: dict):
    """
    Predict fraud and save transaction result using async MongoDB Motor.
    """
    result = predict_single_transaction(transaction_data)
    await save_transaction(transaction_data, result)
    await save_fraud_alert(transaction_data, result)
    return result