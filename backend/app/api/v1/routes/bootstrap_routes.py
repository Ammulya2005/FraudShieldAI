from fastapi import APIRouter

from backend.app.services.bootstrap_service import (
    make_super_admin
)

router = APIRouter(
    prefix="/bootstrap",
    tags=["Bootstrap"]
)


@router.post("/super-admin/email")
async def bootstrap_super_admin(
    email: str
):
    return await make_super_admin(email)