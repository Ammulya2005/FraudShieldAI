from pydantic import BaseModel
class TransactionInput(BaseModel):
    Transaction_Amount: float
    Account_Balance: float
    Transaction_Type: str
    Device_Type: str
    Location: str
    Merchant_Category: str
    IP_Address_Flag: int
    Previous_Fraudulent_Activity: int
    Daily_Transaction_Count: int
    Avg_Transaction_Amount_7d: float
    Transaction_Distance: float
    Risk_Score: float
class PredictionResponse(BaseModel):
    fraud_prediction: int
    fraud_probability: float
    risk_level: str