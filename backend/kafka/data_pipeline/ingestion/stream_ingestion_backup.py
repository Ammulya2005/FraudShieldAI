import asyncio
import json
import logging
import time
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from backend.app.core.logger import logger
from backend.app.schemas.transaction_schema import TransactionCreate
from backend.app.services.transaction_service import create_new_transaction
from backend.kafka.config import (
    KAFKA_BOOTSTRAP_SERVERS,
    KAFKA_TOPIC,
    PRODUCER_INTERVAL_SECONDS
)
from backend.kafka.data_pipeline.streaming.transaction_generator import generate_transaction

try:
    from kafka import KafkaAdminClient, KafkaProducer
    KAFKA_AVAILABLE = True
except ImportError:
    KAFKA_AVAILABLE = False


class StreamIngestionManager:
    """
    Unified real-time streaming ingestion manager for FraudShield AI.
    Coordinates transaction generation, optional Kafka stream broadcasting,
    ML pipeline evaluation, and database persistence.
    """

    def __init__(self):
        self.is_running: bool = False
        self.mode: str = "idle"  # 'kafka', 'direct_simulation', 'idle'
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
            "active_mode": "idle"
        }

    def is_kafka_reachable(self, timeout_ms: int = 1500) -> bool:
        """Check if Kafka cluster is accessible."""
        if not KAFKA_AVAILABLE:
            return False
        try:
            admin = KafkaAdminClient(
                bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
                request_timeout_ms=timeout_ms
            )
            admin.close()
            return True
        except Exception:
            return False

    def _get_kafka_producer(self):
        """Lazy initializer for Kafka producer."""
        if self._producer is None and KAFKA_AVAILABLE:
            try:
                self._producer = KafkaProducer(
                    bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
                    value_serializer=lambda data: json.dumps(data).encode("utf-8"),
                    request_timeout_ms=2000,
                    retries=1
                )
            except Exception as exc:
                logger.warning("Failed to initialize KafkaProducer: %s", exc)
                self._producer = None
        return self._producer

    async def ingest_transaction_record(self, raw_tx: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process a single transaction through schema validation,
        ML inference scoring, and database storage.
        """
        start_ts = time.time()
        try:
            # Ensure timestamp exists and is ISO formatted
            if "timestamp" not in raw_tx or not raw_tx["timestamp"]:
                raw_tx["timestamp"] = datetime.now(timezone.utc).isoformat()

            # Validate against Pydantic schema
            tx_model = TransactionCreate(**raw_tx)

            # Ingest into backend transaction service (executes ML inference + DB persistence + alert/case trigger)
            result = await create_new_transaction(tx_model)

            # Update live telemetry
            latency_ms = (time.time() - start_ts) * 1000
            self.metrics["total_ingested"] += 1
            self.metrics["recent_latency_ms"] = round(latency_ms, 2)
            self.metrics["last_ingested_at"] = datetime.now(timezone.utc).isoformat()

            prediction = result.get("prediction", {})
            if prediction.get("final_prediction") == "fraud":
                self.metrics["fraud_detected"] += 1

            if result.get("alert"):
                self.metrics["alerts_generated"] += 1

            return {
                "success": True,
                "transaction_id": raw_tx.get("transaction_id"),
                "result": result
            }

        except Exception as exc:
            self.metrics["errors_count"] += 1
            logger.error("Ingestion failed for transaction %s: %s", raw_tx.get("transaction_id"), exc)
            return {
                "success": False,
                "transaction_id": raw_tx.get("transaction_id"),
                "error": str(exc)
            }

    async def _streaming_loop(
        self,
        interval_seconds: float = 1.0,
        max_transactions: Optional[int] = None
    ):
        """Background loop continuously ingesting streaming transactions."""
        count = 0
        producer = None

        if self.mode == "kafka":
            producer = self._get_kafka_producer()

        logger.info(
            "Streaming ingestion loop activated in [%s] mode with interval=%.2fs",
            self.mode, interval_seconds
        )

        loop_start_time = time.time()

        try:
            while self.is_running:
                # 1. Generate realistic transaction packet
                transaction = generate_transaction()

                # 2. If Kafka mode is active, broadcast to Kafka topic
                if producer:
                    try:
                        producer.send(KAFKA_TOPIC, transaction)
                        producer.flush()
                    except Exception as kafka_err:
                        logger.warning("Kafka broadcast failed; falling back to direct ingestion: %s", kafka_err)

                # 3. Ingest and score transaction through ML pipeline and DB
                await self.ingest_transaction_record(transaction)

                count += 1

                # 4. Calculate rolling throughput
                elapsed = time.time() - loop_start_time
                if elapsed > 0:
                    self.metrics["messages_per_second"] = round(count / elapsed, 2)

                # Check max limit if defined
                if max_transactions and count >= max_transactions:
                    logger.info("Reached target limit of %d transactions; stopping.", max_transactions)
                    break

                # 5. Delay before next packet
                await asyncio.sleep(interval_seconds)

        except asyncio.CancelledError:
            logger.info("Streaming ingestion loop received cancellation signal.")
        except Exception as err:
            logger.exception("Unexpected exception in streaming ingestion loop: %s", err)
            self.metrics["errors_count"] += 1
        finally:
            self.is_running = False
            self.mode = "idle"
            self.metrics["active_mode"] = "idle"
            logger.info("Streaming ingestion loop terminated. Processed %d records.", count)

    async def start(
        self,
        interval_seconds: float = PRODUCER_INTERVAL_SECONDS,
        max_transactions: Optional[int] = None,
        force_mode: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Start streaming ingestion in the background.
        Auto-detects Kafka availability or falls back to direct simulation.
        """
        if self.is_running:
            return {
                "started": False,
                "message": "Streaming ingestion is already running.",
                "status": self.get_status()
            }

        # Determine streaming mode
        if force_mode:
            selected_mode = force_mode
        else:
            selected_mode = "kafka" if self.is_kafka_reachable() else "direct_simulation"

        self.mode = selected_mode
        self.is_running = True
        self.metrics["active_mode"] = selected_mode
        self.metrics["start_time"] = datetime.now(timezone.utc).isoformat()

        # Launch background async task on the current running event loop
        loop = asyncio.get_running_loop()
        self._task = loop.create_task(
            self._streaming_loop(interval_seconds, max_transactions)
        )

        return {
            "started": True,
            "mode": self.mode,
            "interval_seconds": interval_seconds,
            "max_transactions": max_transactions,
            "message": f"Streaming ingestion started in {self.mode} mode."
        }

    async def stop(self) -> Dict[str, Any]:
        """Stop the streaming ingestion background process."""
        if not self.is_running:
            return {
                "stopped": False,
                "message": "Streaming ingestion is not currently active."
            }

        self.is_running = False
        if self._task and not self._task.done():
            self._task.cancel()
            try:
                await asyncio.wait_for(self._task, timeout=2.0)
            except (asyncio.CancelledError, asyncio.TimeoutError):
                pass

        if self._producer:
            try:
                self._producer.close(timeout=2.0)
            except Exception:
                pass
            self._producer = None

        self.mode = "idle"
        self.metrics["active_mode"] = "idle"

        return {
            "stopped": True,
            "message": "Streaming ingestion stopped successfully.",
            "metrics": self.get_metrics()
        }

    def get_status(self) -> Dict[str, Any]:
        """Return current status of the streaming ingestion engine."""
        kafka_connected = self.is_kafka_reachable(timeout_ms=1000)
        return {
            "is_running": self.is_running,
            "mode": self.mode,
            "kafka_connected": kafka_connected,
            "stream": "available" if (self.is_running or kafka_connected) else "standby",
            "metrics": self.get_metrics()
        }

    def get_metrics(self) -> Dict[str, Any]:
        """Return current telemetry and throughput counters."""
        return {
            "total_ingested": self.metrics["total_ingested"],
            "fraud_detected": self.metrics["fraud_detected"],
            "alerts_generated": self.metrics["alerts_generated"],
            "errors_count": self.metrics["errors_count"],
            "messages_per_second": self.metrics["messages_per_second"],
            "recent_latency_ms": self.metrics["recent_latency_ms"],
            "start_time": self.metrics["start_time"],
            "last_ingested_at": self.metrics["last_ingested_at"],
            "active_mode": self.metrics["active_mode"]
        }


# Global singleton instance
stream_ingestion_manager = StreamIngestionManager()
