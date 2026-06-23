from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class NotificationCreate(BaseModel):
    notification_id: Optional[str] = None
    user_id: str
    title: str
    message: str
    notification_type: Optional[str] = "system"
    severity: Optional[str] = "info"
    status: Optional[str] = "pending"
    metadata: Optional[Dict[str, Any]] = None


class NotificationResponse(BaseModel):
    notification_id: str
    user_id: str
    title: str
    message: str
    notification_type: str
    severity: str
    status: str
    created_at: Optional[str] = None
    read: bool = False
    metadata: Optional[Dict[str, Any]] = None


class NotificationListResponse(BaseModel):
    notifications: List[NotificationResponse]