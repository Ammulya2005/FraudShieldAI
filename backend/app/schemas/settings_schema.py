from typing import Any, Optional

from pydantic import BaseModel


class SettingsItem(BaseModel):
    key: str
    value: Any
    description: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class SettingsUpdateRequest(BaseModel):
    key: str
    value: Any