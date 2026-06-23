from pydantic import BaseModel
from typing import Optional


class TransactionCreate(BaseModel):
    transaction_id: str
    user_id: float
    transaction_amount: float
    transaction_type: str
    timestamp: str
    account_balance: float
    device_type: str
    location: str
    merchant_category: str
    ip_address_flag: float
    previous_fraudulent_activity: float
    daily_transaction_count: float
    avg_transaction_amount_7d: float
    failed_transaction_count_7d: float
    card_type: str
    card_age: float
    transaction_distance: float
    authentication_method: str
    risk_score: float
    is_weekend: float
    ip_address: str
    gps_location: str


class TransactionUpdate(BaseModel):
    transaction_amount: Optional[float] = None
    transaction_type: Optional[str] = None
    timestamp: Optional[str] = None
    account_balance: Optional[float] = None
    device_type: Optional[str] = None
    location: Optional[str] = None
    merchant_category: Optional[str] = None
    ip_address_flag: Optional[float] = None
    previous_fraudulent_activity: Optional[float] = None
    daily_transaction_count: Optional[float] = None
    avg_transaction_amount_7d: Optional[float] = None
    failed_transaction_count_7d: Optional[float] = None
    card_type: Optional[str] = None
    card_age: Optional[float] = None
    transaction_distance: Optional[float] = None
    authentication_method: Optional[str] = None
    risk_score: Optional[float] = None
    is_weekend: Optional[float] = None
    ip_address: Optional[str] = None
    gps_location: Optional[str] = None