from typing import Optional, Literal
from pydantic import BaseModel, Field


class CaseReviewCreate(BaseModel):
    case_id: str = Field(..., min_length=1)
    decision: Literal[
        "fraud",
        "legitimate",
        "needs_more_investigation"
    ]
    notes: str = Field(..., min_length=3)
    evidence_summary: Optional[str] = None
    recommendation: Optional[str] = None


class CaseReviewUpdate(BaseModel):
    decision: Optional[
        Literal[
            "fraud",
            "legitimate",
            "needs_more_investigation"
        ]
    ] = None
    notes: Optional[str] = None
    evidence_summary: Optional[str] = None
    recommendation: Optional[str] = None