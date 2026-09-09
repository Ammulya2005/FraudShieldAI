import asyncio
import json
import time
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from backend.app.core.logger import logger
from backend.kafka.config import (
    KAFKA_BOOTSTRAP_SERVERS,
    KAFKA_TOPIC,
    PRODUCER_INTERVAL_SECONDS,
)
from backend.kafka.data_pipeline.streaming.transaction_generator import (
    generate_transaction,
)
from backend.kafka.consumers.fraud_consumer import fraud_consumer

try:
    from kafka import KafkaAdminClient, KafkaProducer

    KAFKA_AVAILABLE = True
except ImportError:
    KAFKA_AVAILABLE = False


class StreamIngestionManager:
    """
    Dashboard-controlled Kafka streaming manager.

    Architecture:

        Transaction Generator
                |
                v
        Kafka Producer
                |
                v
        Kafka Topic
                |
                v
        Fraud Kafka Consumer
                |
                v
        ML Prediction
                |
                v
        MongoDB
                |
                v
        Alerts / Cases
                |
                v
        Dashboard

    IMPORTANT:
    This manager does NOT directly call create_new_transaction().
    Database ingestion happens only through the Kafka consumer.
    """

    def __init__(self):
        self.is_running: bool = False
        self.mode: str = "idle"

        self._task: Optional[asyncio.Task] = None
        self._producer = None

        self.metrics: Dict[str, Any] = {
            "total_ingested": 0,
            "fraud_detected": 0,
            "alerts_generated": 0,
            "errors_count": 0,
            "start_time": None,
            "last_ingested_at": None,
            "messages_per_second": 0.0,
            "recent_latency_ms": 0.0,
            "active_mode": "idle",
        }

        self._produced_count = 0
        self._loop_start_time: Optional[float] = None

    # ---------------------------------------------------------
    # Kafka availability
    # ---------------------------------------------------------

    def is_kafka_reachable(self, timeout_ms: int = 1500) -> bool:
        """Check whether Kafka is reachable."""

        if not KAFKA_AVAILABLE:
            return False

        admin = None

        try:
            admin = KafkaAdminClient(
                bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
                request_timeout_ms=timeout_ms,
            )

            return True

        except Exception as exc:
            logger.warning(
                "Kafka is not reachable: %s",
                exc,
            )
            return False

        finally:
            if admin:
                try:
                    admin.close()
                except Exception:
                    pass

    # ---------------------------------------------------------
    # Kafka producer
    # ---------------------------------------------------------

    def _get_kafka_producer(self):
        """Create the Kafka producer lazily."""

        if self._producer is not None:
            return self._producer

        if not KAFKA_AVAILABLE:
            return None

        try:
            self._producer = KafkaProducer(
                bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
                value_serializer=lambda data: json.dumps(
                    data
                ).encode("utf-8"),
                request_timeout_ms=2000,
                retries=1,
            )

            logger.info(
                "Kafka producer initialized successfully."
            )

            return self._producer

        except Exception as exc:
            logger.error(
                "Failed to initialize Kafka producer: %s",
                exc,
            )

            self._producer = None

            return None

    # ---------------------------------------------------------
    # Metrics synchronization
    # ---------------------------------------------------------

    def _sync_consumer_metrics(self):
        """
        Synchronize Dashboard metrics with the actual Kafka
        consumer.

        total_ingested = successfully processed Kafka messages
        fraud_detected = fraud predictions from consumer
        errors_count   = consumer errors
        """

        consumer_status = fraud_consumer.get_status()

        self.metrics["total_ingested"] = (
            consumer_status.get(
                "processed_count",
                0,
            )
        )

        self.metrics["fraud_detected"] = (
            consumer_status.get(
                "fraud_count",
                0,
            )
        )

        self.metrics["errors_count"] = (
            consumer_status.get(
                "error_count",
                0,
            )
        )

        # Consumer can expose these fields if available.
        if "alerts_count" in consumer_status:
            self.metrics["alerts_generated"] = (
                consumer_status["alerts_count"]
            )

        if "last_latency_ms" in consumer_status:
            self.metrics["recent_latency_ms"] = (
                consumer_status["last_latency_ms"]
            )

        if "last_processed_at" in consumer_status:
            self.metrics["last_ingested_at"] = (
                consumer_status["last_processed_at"]
            )

    # ---------------------------------------------------------
    # Producer loop
    # ---------------------------------------------------------

    async def _streaming_loop(
        self,
        interval_seconds: float = 1.0,
        max_transactions: Optional[int] = None,
    ):
        """
        Generate transactions and publish them to Kafka.

        IMPORTANT:
        This method ONLY produces Kafka messages.

        It does NOT directly perform ML inference or MongoDB
        persistence.
        """

        producer = self._get_kafka_producer()

        if producer is None:
            logger.error(
                "Kafka producer could not be initialized."
            )

            self.metrics["errors_count"] += 1

            self.is_running = False

            return

        self._produced_count = 0
        self._loop_start_time = time.time()

        logger.info(
            "Kafka producer loop started. "
            "interval=%.2fs max_transactions=%s",
            interval_seconds,
            max_transactions,
        )

        try:
            while self.is_running:

                # -------------------------------------------------
                # 1. Generate transaction
                # -------------------------------------------------

                transaction = generate_transaction()

                # Ensure timestamp exists.
                if (
                    "timestamp" not in transaction
                    or not transaction["timestamp"]
                ):
                    transaction["timestamp"] = (
                        datetime.now(
                            timezone.utc
                        ).isoformat()
                    )

                transaction_id = transaction.get(
                    "transaction_id"
                )

                # -------------------------------------------------
                # 2. Send ONLY to Kafka
                # -------------------------------------------------

                try:
                    future = producer.send(
                        KAFKA_TOPIC,
                        transaction,
                    )

                    # Wait for Kafka acknowledgement.
                    await asyncio.to_thread(
                        future.get,
                        5,
                    )

                    self._produced_count += 1

                    logger.info(
                        "Produced transaction %s to Kafka "
                        "(%d)",
                        transaction_id,
                        self._produced_count,
                    )

                except Exception as exc:

                    self.metrics["errors_count"] += 1

                    logger.error(
                        "Kafka publish failed for %s: %s",
                        transaction_id,
                        exc,
                    )

                # -------------------------------------------------
                # 3. Update producer throughput
                # -------------------------------------------------

                elapsed = (
                    time.time()
                    - self._loop_start_time
                )

                if elapsed > 0:
                    self.metrics[
                        "messages_per_second"
                    ] = round(
                        self._produced_count
                        / elapsed,
                        2,
                    )

                # -------------------------------------------------
                # 4. Synchronize consumer metrics
                # -------------------------------------------------

                self._sync_consumer_metrics()

                # -------------------------------------------------
                # 5. Producer limit
                # -------------------------------------------------

                if (
                    max_transactions is not None
                    and max_transactions > 0
                    and self._produced_count >= max_transactions
               ):
                 logger.info(
                  "Producer reached configured limit of %d transactions.",
                   max_transactions
                 )

                 self.is_running = False
                 break

                # -------------------------------------------------
                # 6. Wait before next transaction
                # -------------------------------------------------

                await asyncio.sleep(
                    interval_seconds
                )

        except asyncio.CancelledError:

            logger.info(
                "Kafka producer loop cancelled."
            )

            raise

        except Exception as exc:

            logger.exception(
                "Unexpected producer loop error: %s",
                exc,
            )

            self.metrics["errors_count"] += 1

        finally:

            # Get the latest consumer statistics.
            self._sync_consumer_metrics()

            logger.info(
                "Kafka producer loop terminated. "
                "Produced=%d",
                self._produced_count,
            )

    # ---------------------------------------------------------
    # Start
    # ---------------------------------------------------------

    async def start(
        self,
        interval_seconds: float = PRODUCER_INTERVAL_SECONDS,
        max_transactions: Optional[int] = None,
        force_mode: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Start the Kafka streaming pipeline.

        Consumer starts BEFORE producer so messages are consumed
        immediately after publication.
        """

        if self.is_running:
            return {
                "started": False,
                "message": (
                    "Streaming ingestion is already running."
                ),
                "status": self.get_status(),
            }

        # ---------------------------------------------------------
        # Determine mode
        # ---------------------------------------------------------

        if force_mode:
            selected_mode = force_mode
        else:
            selected_mode = (
                "kafka"
                if self.is_kafka_reachable()
                else "direct_simulation"
            )

        # ---------------------------------------------------------
        # Direct simulation is intentionally disabled for the
        # new architecture.
        # ---------------------------------------------------------

        if selected_mode != "kafka":

            return {
                "started": False,
                "mode": "idle",
                "message": (
                    "Kafka is unavailable. "
                    "Direct ingestion fallback is disabled "
                    "to prevent duplicate processing."
                ),
            }

        # ---------------------------------------------------------
        # Start state
        # ---------------------------------------------------------

        self.mode = "kafka"
        self.is_running = True

        self.metrics["active_mode"] = "kafka"
        self.metrics["start_time"] = (
            datetime.now(
                timezone.utc
            ).isoformat()
        )

        self.metrics["last_ingested_at"] = None
        self.metrics["messages_per_second"] = 0.0
        self.metrics["recent_latency_ms"] = 0.0

        # ---------------------------------------------------------
        # Start Kafka consumer FIRST
        # ---------------------------------------------------------

        try:

            consumer_result = fraud_consumer.start()

            logger.info(
                "Kafka consumer start result: %s",
                consumer_result,
            )

        except Exception as exc:

            self.is_running = False
            self.mode = "idle"
            self.metrics["active_mode"] = "idle"

            self.metrics["errors_count"] += 1

            logger.exception(
                "Failed to start Kafka consumer: %s",
                exc,
            )

            return {
                "started": False,
                "mode": "kafka",
                "message": (
                    "Failed to start Kafka consumer."
                ),
                "error": str(exc),
            }

        # ---------------------------------------------------------
        # Start producer loop
        # ---------------------------------------------------------

        loop = asyncio.get_running_loop()

        self._task = loop.create_task(
            self._streaming_loop(
                interval_seconds,
                max_transactions,
            )
        )

        logger.info(
            "Kafka streaming pipeline started."
        )

        return {
            "started": True,
            "mode": "kafka",
            "interval_seconds": interval_seconds,
            "max_transactions": max_transactions,
            "message": (
                "Kafka streaming pipeline started "
                "successfully."
            ),
        }

    # ---------------------------------------------------------
    # Stop
    # ---------------------------------------------------------

    async def stop(self) -> Dict[str, Any]:
        """Stop producer and consumer cleanly."""

        if not self.is_running:
            return {
                "stopped": False,
                "message": (
                    "Streaming ingestion is not "
                    "currently active."
                ),
            }

        logger.info(
            "Stopping Kafka streaming pipeline..."
        )

        # Stop producer loop first.
        self.is_running = False

        if self._task and not self._task.done():

            self._task.cancel()

            try:
                await asyncio.wait_for(
                    self._task,
                    timeout=3.0,
                )

            except (
                asyncio.CancelledError,
                asyncio.TimeoutError,
            ):
                pass

        self._task = None

        # Close producer.
        if self._producer:

            try:
                self._producer.close(
                    timeout=2.0
                )

            except Exception as exc:
                logger.warning(
                    "Kafka producer close failed: %s",
                    exc,
                )

            self._producer = None

        # Stop consumer.
        try:

            if fraud_consumer.is_running:

                await asyncio.to_thread(
                    fraud_consumer.stop
                )

        except Exception as exc:

            logger.warning(
                "Kafka consumer stop failed: %s",
                exc,
            )

            self.metrics["errors_count"] += 1

        # Final metrics synchronization.
        self._sync_consumer_metrics()

        self.mode = "idle"
        self.metrics["active_mode"] = "idle"

        logger.info(
            "Kafka streaming pipeline stopped."
        )

        return {
            "stopped": True,
            "message": (
                "Kafka streaming pipeline "
                "stopped successfully."
            ),
            "metrics": self.get_metrics(),
        }

    # ---------------------------------------------------------
    # Status
    # ---------------------------------------------------------

    def get_status(self) -> Dict[str, Any]:
        """Return streaming status."""

        kafka_connected = self.is_kafka_reachable(
            timeout_ms=1000
        )

        self._sync_consumer_metrics()

        return {
            "is_running": self.is_running,
            "mode": self.mode,
            "kafka_connected": kafka_connected,
            "stream": (
                "available"
                if (
                    self.is_running
                    or kafka_connected
                )
                else "standby"
            ),
            "metrics": self.get_metrics(),
        }

    # ---------------------------------------------------------
    # Metrics
    # ---------------------------------------------------------

    def get_metrics(self) -> Dict[str, Any]:
        """Return Dashboard telemetry."""

        self._sync_consumer_metrics()

        return {
            "total_ingested": self.metrics[
                "total_ingested"
            ],
            "fraud_detected": self.metrics[
                "fraud_detected"
            ],
            "alerts_generated": self.metrics[
                "alerts_generated"
            ],
            "errors_count": self.metrics[
                "errors_count"
            ],
            "messages_per_second": self.metrics[
                "messages_per_second"
            ],
            "recent_latency_ms": self.metrics[
                "recent_latency_ms"
            ],
            "start_time": self.metrics[
                "start_time"
            ],
            "last_ingested_at": self.metrics[
                "last_ingested_at"
            ],
            "active_mode": self.metrics[
                "active_mode"
            ],
        }


# Global singleton
stream_ingestion_manager = (
    StreamIngestionManager()
)