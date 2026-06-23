from typing import Optional, Literal

from pydantic import BaseModel, Field


class AlertCreate(BaseModel):
    transaction_id: str
    user_id: float
    risk_score: float
    alert_type: Literal[
        "fraud_prediction",
        "high_risk_transaction",
        "velocity_anomaly",
        "geo_anomaly",
        "manual_review"
    ] = "fraud_prediction"
    severity: Literal[
        "low",
        "medium",
        "high",
        "critical"
    ] = "high"
    message: str


class AlertUpdate(BaseModel):
    severity: Optional[
        Literal["low", "medium", "high", "critical"]
    ] = None
    message: Optional[str] = None
    status: Optional[
        Literal["open", "assigned", "acknowledged", "resolved"]
    ] = None


class AlertAssignRequest(BaseModel):
    assigned_to: str = Field(
        ...,
        description="User ID of analyst/fraud manager/admin"
    )


class AlertResolveRequest(BaseModel):
    resolution_note: Optional[str] = None