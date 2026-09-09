import os
import sys
import json
import asyncio
import time

from typing import Optional

from fastapi import HTTPException
from kafka import KafkaConsumer


PROJECT_ROOT = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "../../.."
    )
)

sys.path.append(PROJECT_ROOT)


from backend.kafka.config import (
    KAFKA_BOOTSTRAP_SERVERS,
    KAFKA_CONSUMER_GROUP,
)

from backend.kafka.topics import TRANSACTION_TOPIC

from backend.app.schemas.transaction_schema import (
    TransactionCreate
)

from backend.app.services.transaction_service import (
    create_new_transaction
)


class FraudKafkaConsumer:

    def __init__(self):

        self.consumer: Optional[
            KafkaConsumer
        ] = None

        self.task = None

        self.is_running = False

        self.processed_count = 0
        self.fraud_count = 0
        self.alerts_count = 0
        self.error_count = 0

        self.last_latency_ms = 0.0
        self.last_processed_at = None


    def create_consumer(self):

        return KafkaConsumer(
            TRANSACTION_TOPIC,

            bootstrap_servers=
                KAFKA_BOOTSTRAP_SERVERS,

            group_id=
                KAFKA_CONSUMER_GROUP,

            auto_offset_reset="latest",

            enable_auto_commit=False,

            value_deserializer=lambda data:
                json.loads(
                    data.decode("utf-8")
                ),

        )


    async def process_transaction(
        self,
        transaction: dict
    ):

        transaction_model = (
            TransactionCreate(
                **transaction
            )
        )

        result = await (
            create_new_transaction(
                transaction_model
            )
        )

        return result


    async def _consume_loop(self):

        print(
            "\nKafka Fraud Consumer Started...\n"
        )

        try:

            self.consumer = (
                self.create_consumer()
            )

            while self.is_running:

                # Kafka's poll is synchronous.
                # Run it in a worker thread so
                # it does not block FastAPI.

                records = await asyncio.to_thread(
                    self.consumer.poll,
                    timeout_ms=1000,
                    max_records=10
                )

                if not records:
                    continue


                for (
                    topic_partition,
                    messages
                ) in records.items():

                    for message in messages:

                        if not self.is_running:
                            break


                        transaction = (
                            message.value
                        )

                        transaction_id = (
                            transaction.get(
                                "transaction_id"
                            )
                        )

                        start_time = time.time()


                        try:

                            # IMPORTANT:
                            #
                            # The transaction service
                            # runs directly on the
                            # FastAPI event loop.
                            #
                            # No cross-loop
                            # run_coroutine_threadsafe.

                            result = await (
                                self.process_transaction(
                                    transaction
                                )
                            )


                            prediction = (
                                result.get(
                                    "prediction",
                                    {}
                                )
                            )

                            final_prediction = (
                                prediction.get(
                                    "final_prediction"
                                )
                            )

                            risk_score = float(
                                prediction.get(
                                    "risk_score",
                                    0.0
                                )
                            )


                            latency_ms = (
                                time.time()
                                - start_time
                            ) * 1000


                            self.last_latency_ms = (
                                round(
                                    latency_ms,
                                    2
                                )
                            )


                            self.processed_count += 1


                            if (
                                final_prediction
                                == "fraud"
                            ):

                                self.fraud_count += 1


                            if result.get(
                                "alert"
                            ):

                                self.alerts_count += 1


                            self.last_processed_at = (
                                time.strftime(
                                    "%Y-%m-%dT%H:%M:%SZ",
                                    time.gmtime()
                                )
                            )


                            # Commit ONLY after
                            # successful processing.

                            await asyncio.to_thread(
                                self.consumer.commit,
                                offsets={
                                    topic_partition:
                                    message.offset + 1
                                }
                            )


                            print(
                                f"[Consumer "
                                f"{self.processed_count}] "
                                f"Consumed: "
                                f"{transaction_id} "
                                f"| Fraud: "
                                f"{final_prediction} "
                                f"| Risk: "
                                f"{risk_score}"
                            )


                        except HTTPException as exc:

                            if (
                                exc.status_code == 400
                                and
                                "already exists"
                                in str(
                                    exc.detail
                                ).lower()
                            ):

                                print(
                                    "[SKIPPED DUPLICATE] "
                                    f"{transaction_id}"
                                )


                                self.processed_count += 1


                                await asyncio.to_thread(
                                    self.consumer.commit,
                                    offsets={
                                        topic_partition:
                                        message.offset + 1
                                    }
                                )

                            else:

                                self.error_count += 1

                                print(
                                    "[CONSUMER ERROR] "
                                    f"{transaction_id}: "
                                    f"{exc}"
                                )


                        except Exception as exc:

                            self.error_count += 1

                            print(
                                "[CONSUMER ERROR] "
                                f"{transaction_id}: "
                                f"{exc}"
                            )


        except asyncio.CancelledError:

            print(
                "Kafka consumer task cancelled."
            )

            raise


        except Exception as exc:

            self.error_count += 1

            print(
                "Kafka consumer stopped because "
                f"of error: {exc}"
            )


        finally:

            if self.consumer:

                try:

                    await asyncio.to_thread(
                        self.consumer.close
                    )

                except Exception:
                    pass

                self.consumer = None


            self.is_running = False


            print(
                "\nKafka Fraud Consumer Stopped."
            )


    def start(self):

        if self.is_running:

            return {
                "started": False,
                "message":
                    "Kafka consumer is already running."
            }


        self.processed_count = 0
        self.fraud_count = 0
        self.alerts_count = 0
        self.error_count = 0

        self.last_latency_ms = 0.0
        self.last_processed_at = None

        self.is_running = True


        loop = asyncio.get_running_loop()

        self.task = loop.create_task(
            self._consume_loop()
        )


        return {
            "started": True,
            "message":
                "Kafka consumer started successfully."
        }


    async def stop(self):

        if not self.is_running:

            return {
                "stopped": False,
                "message":
                    "Kafka consumer is not running."
            }


        self.is_running = False


        if self.task:

            try:

                await asyncio.wait_for(
                    self.task,
                    timeout=5
                )

            except (
                asyncio.TimeoutError,
                asyncio.CancelledError
            ):

                if not self.task.done():
                    self.task.cancel()


        self.task = None


        return {
            "stopped": True,
            "message":
                "Kafka consumer stopped successfully."
        }


    def get_status(self):

        return {

            "is_running":
                self.is_running,

            "processed_count":
                self.processed_count,

            "fraud_count":
                self.fraud_count,

            "alerts_count":
                self.alerts_count,

            "error_count":
                self.error_count,

            "last_latency_ms":
                self.last_latency_ms,

            "last_processed_at":
                self.last_processed_at
        }


fraud_consumer = (
    FraudKafkaConsumer()
)


async def process_transaction(
    transaction: dict
):

    return await (
        fraud_consumer.process_transaction(
            transaction
        )
    )


def create_kafka_consumer():

    return (
        fraud_consumer.create_consumer()
    )


async def run_fraud_consumer():

    fraud_consumer.start()

    try:

        while fraud_consumer.is_running:

            await asyncio.sleep(1)

    finally:

        await fraud_consumer.stop()


if __name__ == "__main__":

    asyncio.run(
        run_fraud_consumer()
    )