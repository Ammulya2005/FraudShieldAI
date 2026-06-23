from typing import Generic, TypeVar, List
from pydantic import BaseModel

T = TypeVar("T")


class BaseResponse(BaseModel):
	message: str


class ListResponse(BaseResponse, Generic[T]):
	total: int
	items: List[T]

