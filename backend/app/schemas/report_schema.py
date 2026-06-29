from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class ReportRequest(BaseModel):
    report_type: str
    filters: Optional[Dict[str, Any]] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None


class ReportResponse(BaseModel):
    report_id: str
    report_type: str
    status: Optional[str] = None
    generated_at: Optional[str] = None
    summary: Optional[Dict[str, Any]] = None
    data: Optional[List[Dict[str, Any]]] = None


class ReportListResponse(BaseModel):
    reports: List[ReportResponse]