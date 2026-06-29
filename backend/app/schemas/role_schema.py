from pydantic import BaseModel


class RoleCreate(BaseModel):
    name: str
    description: str


class RoleResponse(BaseModel):
    id: str
    name: str
    description: str