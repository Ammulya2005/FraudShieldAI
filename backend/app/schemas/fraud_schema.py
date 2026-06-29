from typing import Any, List

from pydantic import BaseModel


class FraudSummaryResponse(BaseModel):
    cases: int
    alerts: int
    average_risk_score: float


class FraudPattern(BaseModel):
    pattern: Any
    count: int


class FraudEntity(BaseModel):
    entity: Any
    type: str


class FraudPatternsResponse(BaseModel):
    patterns: List[FraudPattern]


class FraudEntitiesResponse(BaseModel):
    entities: List[FraudEntity]