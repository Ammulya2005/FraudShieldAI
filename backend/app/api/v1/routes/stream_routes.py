from typing import Any, Dict

from fastapi import APIRouter, Body, Depends, Query

from backend.app.core.rbac import require_roles
from backend.app.repositories.transaction_repository import (
    get_all_transactions,
    count_transactions
)

from backend.app.services.stream_service import (
    fetch_recent_stream_data,
    fetch_stream_metrics,
    fetch_stream_status,
    start_streaming_service,
    stop_streaming_service,
)


router = APIRouter(
    prefix="/stream",
    tags=["Stream"]
)


STREAM_ROLES = [
    "analyst",
    "fraud_manager",
    "admin",
    "super_admin"
]


@router.get("/status")
async def get_stream_status(
    current_user=Depends(
        require_roles(STREAM_ROLES)
    )
):

    return await fetch_stream_status()


@router.post("/start")
async def start_stream(
    config: Dict[str, Any] = Body(default={}),
    current_user=Depends(
        require_roles(STREAM_ROLES)
    )
):

    interval = float(
        config.get(
            "interval_seconds",
            2.0
        )
    )

    limit = config.get(
        "max_transactions"
    )

    if limit is not None:

        limit = int(limit)

    mode = config.get(
        "mode"
    )

    return await start_streaming_service(
        interval_seconds=interval,
        max_transactions=limit,
        force_mode=mode
    )


@router.post("/stop")
async def stop_stream(
    current_user=Depends(
        require_roles(STREAM_ROLES)
    )
):

    return await stop_streaming_service()


@router.get("/metrics")
async def get_stream_metrics(
    current_user=Depends(
        require_roles(STREAM_ROLES)
    )
):

    return await fetch_stream_metrics()


@router.get("/recent")
async def get_recent_stream(
    page: int = Query(
        default=1,
        ge=1
    ),
    page_size: int = Query(
        default=5,
        ge=1,
        le=100
    ),
    current_user=Depends(
        require_roles(STREAM_ROLES)
    )
):

    return await fetch_recent_stream_data(
        page=page,
        page_size=page_size
    )
async def fetch_recent_stream_data(
    page: int = 1,
    page_size: int = 5
):

    transactions = await get_all_transactions(
        page=page,
        page_size=page_size
    )

    total = await count_transactions()

    total_pages = max(
        1,
        (
            total +
            page_size -
            1
        ) // page_size
    )

    return {
        "stream_records": transactions,
        "page": page,
        "page_size": page_size,
        "total": total,
        "total_pages": total_pages
    }