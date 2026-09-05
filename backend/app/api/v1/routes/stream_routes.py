from typing import Any, Dict

from fastapi import APIRouter, Body, Depends

from backend.app.core.rbac import require_roles

router = APIRouter(prefix="/stream", tags=["Stream"])

@router.get("/status")
async def get_stream_status(
    current_user=Depends(require_roles(["admin", "super_admin"]))
):
    return {"stream": "running", "connected": False}

@router.post("/start")
async def start_stream(
    config: Dict[str, Any] = Body(default={}),
    current_user=Depends(require_roles(["admin", "super_admin"]))
):
    return {"started": True, "config": config}

@router.post("/stop")
async def stop_stream(
    current_user=Depends(require_roles(["admin", "super_admin"]))
):
    return {"stopped": True}

@router.get("/metrics")
async def get_stream_metrics(
    current_user=Depends(require_roles(["admin", "super_admin"]))
):
    return {"metrics": {"messages_per_second": 0, "errors": 0}}
