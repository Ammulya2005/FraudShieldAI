from typing import Any, Dict

from fastapi import APIRouter, Body, Depends

from backend.app.core.rbac import require_roles
from backend.app.services.stream_service import (
    fetch_recent_stream_data,
    fetch_stream_metrics,
    fetch_stream_status,
    start_streaming_service,
    stop_streaming_service,
)

router = APIRouter(prefix="/stream", tags=["Stream"])

STREAM_ROLES = ["analyst", "fraud_manager", "admin", "super_admin"]


@router.get("/status")
async def get_stream_status(
    current_user=Depends(require_roles(STREAM_ROLES))
):
    """Retrieve operational status and connectivity of the streaming engine."""
    return await fetch_stream_status()


@router.post("/start")
async def start_stream(
    config: Dict[str, Any] = Body(default={}),
    current_user=Depends(require_roles(STREAM_ROLES))
):
    """Activate real-time streaming ingestion."""
    interval = float(config.get("interval_seconds", 2.0))
    limit = config.get("max_transactions")
    if limit is not None:
        limit = int(limit)
    mode = config.get("mode")

    result = await start_streaming_service(
        interval_seconds=interval,
        max_transactions=limit,
        force_mode=mode
    )
    return result


@router.post("/stop")
async def stop_stream(
    current_user=Depends(require_roles(STREAM_ROLES))
):
    """Deactivate streaming ingestion."""
    return await stop_streaming_service()


@router.get("/metrics")
async def get_stream_metrics(
    current_user=Depends(require_roles(STREAM_ROLES))
):
    """Fetch live streaming throughput, latency, and detection rates."""
    return await fetch_stream_metrics()


@router.get("/recent")
async def get_recent_stream(
    current_user=Depends(require_roles(STREAM_ROLES))
):
    """Fetch recent records passing through the stream."""
    return await fetch_recent_stream_data()
