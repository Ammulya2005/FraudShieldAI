from typing import Any, Dict

from fastapi import APIRouter, Body, Depends

from backend.app.core.rbac import require_roles
from backend.kafka.config import KAFKA_BOOTSTRAP_SERVERS
from kafka import KafkaAdminClient

router = APIRouter(prefix="/stream", tags=["Stream"])

@router.get("/status")
async def get_stream_status(
    current_user=Depends(require_roles(["admin", "super_admin"]))
):
    try:
        client = KafkaAdminClient(
            bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
            request_timeout_ms=2000
        )
        client.close()
        return {"stream": "available", "connected": True}
    except Exception as exc:
        return {"stream": "unavailable", "connected": False, "error": str(exc)}

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
