from datetime import datetime
from backend.database.connection import get_database
db = get_database()
alert_collection = db["fraud_alerts"]
async def save_fraud_alert(transaction_data: dict, prediction_result: dict):
    """
    Save fraud alert only when fraud is detected.
    """
    if prediction_result["fraud_prediction"] == 1:
        document = {
            "transaction": transaction_data,
            "prediction": prediction_result,
            "alert_message": "Suspicious Transaction Detected",
            "created_at": datetime.utcnow()
        }
        result = await alert_collection.insert_one(document)
        return str(result.inserted_id)
    return None
async def get_recent_alerts(limit: int = 20):
    """
    Fetch recent fraud alerts asynchronously.
    """
    cursor = alert_collection.find().sort("created_at", -1).limit(limit)
    alerts = []
    async for record in cursor:
        record["_id"] = str(record["_id"])
        alerts.append(record)
    return alerts