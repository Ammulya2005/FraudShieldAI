from pydantic import BaseModel


class AssignRoleRequest(BaseModel):
    user_id: str
    role_name: str


class RemoveRoleRequest(BaseModel):
    user_id: str
    role_name: str