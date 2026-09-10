from typing import Any, Dict, Optional

from backend.app.repositories.transaction_repository import (
    get_all_transactions,
    count_transactions,
)

from backend.kafka.data_pipeline.ingestion.stream_ingestion import (
    stream_ingestion_manager,
)


async def start_streaming_service(
    interval_seconds: float = 2.0,
    max_transactions: Optional[int] = None,
    force_mode: Optional[str] = None
) -> Dict[str, Any]:

    """Start background streaming transaction ingestion."""

    return await stream_ingestion_manager.start(
        interval_seconds=interval_seconds,
        max_transactions=max_transactions,
        force_mode=force_mode
    )


async def stop_streaming_service() -> Dict[str, Any]:

    """Stop active streaming transaction ingestion."""

    return await stream_ingestion_manager.stop()


async def fetch_stream_status() -> Dict[str, Any]:

    """Return status of ingestion manager and Kafka connection."""

    status = (
        stream_ingestion_manager.get_status()
    )

    return {
        "status": (
            "streaming"
            if status["is_running"]
            else "idle"
        ),
        "stream": status["stream"],
        "connected": status["kafka_connected"],
        "mode": status["mode"],
        "metrics": status["metrics"]
    }


async def fetch_stream_metrics() -> Dict[str, Any]:

    """Return current streaming throughput and error counts."""

    metrics = (
        stream_ingestion_manager.get_metrics()
    )

    return {
        "metrics": {
            "messages_per_second":
                metrics["messages_per_second"],

            "total_ingested":
                metrics["total_ingested"],

            "fraud_detected":
                metrics["fraud_detected"],

            "alerts_generated":
                metrics["alerts_generated"],

            "errors":
                metrics["errors_count"],

            "latency_ms":
                metrics["recent_latency_ms"],

            "mode":
                metrics["active_mode"]
        }
    }


async def fetch_recent_stream_data(
    page: int = 1,
    page_size: int = 5
):
    """
    Retrieve paginated records from the streaming ledger.
    """

    page = max(
        1,
        int(page)
    )

    page_size = max(
        1,
        min(
            int(page_size),
            100
        )
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


    if page > total_pages:
        page = total_pages


    transactions = (
        await get_all_transactions(
            page=page,
            page_size=page_size
        )
    )


    return {
        "stream_records":
            transactions,

        "total":
            total,

        "page":
            page,

        "page_size":
            page_size,

        "total_pages":
            total_pages
    }