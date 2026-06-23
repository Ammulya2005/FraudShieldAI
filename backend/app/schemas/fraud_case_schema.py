from typing import Optional, Literal

from pydantic import BaseModel, Field


class FraudCaseCreate(BaseModel):
    transaction_id: str
    user_id: str
    risk_score: float
    final_prediction: Literal["fraud", "legitimate"]
    priority: Literal["low", "medium", "high", "critical"] = "high"


class FraudCaseUpdate(BaseModel):
    priority: Optional[
        Literal["low", "medium", "high", "critical"]
    ] = None
    review_notes: Optional[str] = None
    resolution: Optional[str] = None


class FraudCaseAssignRequest(BaseModel):
    assigned_to: str = Field(
        ...,
        description="User ID of analyst/fraud manager/admin"
    )


class FraudCaseCloseRequest(BaseModel):
    resolution: Literal["fraud", "legitimate", "false_positive"]
    review_notes: Optional[str] = None