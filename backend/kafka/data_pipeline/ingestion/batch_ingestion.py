import argparse
import asyncio
import json
import logging
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional
import uuid

import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[4]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.app.core.logger import logger
from backend.app.schemas.transaction_schema import TransactionCreate
from backend.app.services.transaction_service import create_new_transaction
from backend.kafka.config import (
    KAFKA_BOOTSTRAP_SERVERS,
    KAFKA_TOPIC
)

try:
    from kafka import KafkaProducer
    KAFKA_AVAILABLE = True
except ImportError:
    KAFKA_AVAILABLE = False


class BatchIngestionPipeline:
    """
    Batch transaction ingestion pipeline for bulk file processing (CSV / JSON).
    Validates records, enriches them through ML fraud detection, and persists
    results to MongoDB or broadcasts them across Kafka.
    """

    def __init__(self, publish_to_kafka: bool = False):
        self.publish_to_kafka = publish_to_kafka
        self.producer = None
        if publish_to_kafka and KAFKA_AVAILABLE:
            try:
                self.producer = KafkaProducer(
                    bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
                    value_serializer=lambda d: json.dumps(d).encode("utf-8")
                )
            except Exception as e:
                logger.warning("Kafka Producer unavailable for batch pipeline: %s", e)

    def _normalize_record(self, row: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize raw dict keys and types to match TransactionCreate schema."""
        normalized = {}
        for k, v in row.items():
            key_clean = str(k).strip().lower().replace(" ", "_")
            normalized[key_clean] = v

        # Fill missing required fields with realistic defaults if not present
        if "transaction_id" not in normalized or not normalized["transaction_id"]:
            normalized["transaction_id"] = str(uuid.uuid4())

        if "timestamp" in normalized and normalized["timestamp"] and str(normalized["timestamp"]).lower() != "nan":
            try:
                dt = pd.to_datetime(normalized["timestamp"], dayfirst=True)
                normalized["timestamp"] = dt.isoformat()
            except Exception:
                normalized["timestamp"] = datetime.now(timezone.utc).isoformat()
        else:
            normalized["timestamp"] = datetime.now(timezone.utc).isoformat()

        if "user_id" in normalized:
            try:
                normalized["user_id"] = float(normalized["user_id"])
            except (ValueError, TypeError):
                normalized["user_id"] = 1001.0
        else:
            normalized["user_id"] = 1001.0

        # Numeric casts
        for float_field in [
            "transaction_amount", "account_balance", "ip_address_flag",
            "previous_fraudulent_activity", "daily_transaction_count",
            "avg_transaction_amount_7d", "failed_transaction_count_7d",
            "card_age", "transaction_distance", "risk_score", "is_weekend"
        ]:
            if float_field in normalized:
                try:
                    normalized[float_field] = float(normalized[float_field])
                except (ValueError, TypeError):
                    normalized[float_field] = 0.0
            else:
                normalized[float_field] = 0.0

        # String casts
        for str_field in [
            "transaction_type", "device_type", "location",
            "merchant_category", "card_type", "authentication_method",
            "ip_address", "gps_location"
        ]:
            if str_field not in normalized or pd.isna(normalized[str_field]):
                normalized[str_field] = "Unknown"
            else:
                normalized[str_field] = str(normalized[str_field])

        return normalized

    async def ingest_record(self, raw_record: Dict[str, Any]) -> Dict[str, Any]:
        """Ingest a single normalized record."""
        clean_record = self._normalize_record(raw_record)
        tx_model = TransactionCreate(**clean_record)

        if self.publish_to_kafka and self.producer:
            try:
                self.producer.send(KAFKA_TOPIC, clean_record)
                self.producer.flush()
            except Exception as k_err:
                logger.warning("Kafka publishing failed: %s", k_err)

        result = await create_new_transaction(tx_model)
        return result

    async def run_csv_ingestion(
        self,
        csv_path: str,
        limit: Optional[int] = None,
        delay_between_records: float = 0.0
    ) -> Dict[str, Any]:
        """Ingest a batch dataset from a CSV file."""
        path = Path(csv_path)
        if not path.exists():
            raise FileNotFoundError(f"CSV file not found at: {csv_path}")

        df = pd.read_csv(path)
        if limit:
            df = df.head(limit)

        total_rows = len(df)
        logger.info("Initiating batch ingestion of %d rows from %s", total_rows, path.name)

        start_time = time.time()
        succeeded = 0
        failed = 0
        frauds_flagged = 0
        alerts_triggered = 0
        errors: List[str] = []

        records = df.to_dict(orient="records")

        for idx, rec in enumerate(records, 1):
            try:
                res = await self.ingest_record(rec)
                succeeded += 1

                pred = res.get("prediction", {})
                if pred.get("final_prediction") == "fraud":
                    frauds_flagged += 1

                if res.get("alert"):
                    alerts_triggered += 1

                if idx % 50 == 0 or idx == total_rows:
                    logger.info("[%d/%d] Ingested successfully (Frauds: %d)", idx, total_rows, frauds_flagged)

                if delay_between_records > 0:
                    await asyncio.sleep(delay_between_records)

            except Exception as e:
                failed += 1
                if len(errors) < 20:
                    errors.append(f"Row {idx} error: {str(e)}")
                logger.error("Failed processing row %d: %s", idx, e)

        duration = round(time.time() - start_time, 2)
        rate = round(succeeded / duration, 2) if duration > 0 else succeeded

        summary = {
            "file": str(path),
            "total_rows": total_rows,
            "succeeded": succeeded,
            "failed": failed,
            "frauds_flagged": frauds_flagged,
            "alerts_triggered": alerts_triggered,
            "duration_seconds": duration,
            "rate_records_per_sec": rate,
            "errors": errors
        }

        logger.info("Batch ingestion finished: %s", summary)
        return summary


# CLI entrypoint for batch ingestion
def main():
    parser = argparse.ArgumentParser(description="FraudShield AI Batch Transaction Ingestion Pipeline")
    parser.add_argument("--file", "-f", required=True, help="Path to CSV dataset file")
    parser.add_argument("--limit", "-l", type=int, default=None, help="Max records to ingest")
    parser.add_argument("--delay", "-d", type=float, default=0.0, help="Delay in seconds between records")
    parser.add_argument("--kafka", "-k", action="store_true", help="Also publish to Kafka topic")

    args = parser.parse_args()
    pipeline = BatchIngestionPipeline(publish_to_kafka=args.kafka)

    result = asyncio.run(
        pipeline.run_csv_ingestion(
            csv_path=args.file,
            limit=args.limit,
            delay_between_records=args.delay
        )
    )
    print("\n--- Ingestion Result ---")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
