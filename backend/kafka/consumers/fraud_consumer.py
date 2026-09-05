import os
import sys
import json
import asyncio

from fastapi import HTTPException
from kafka import KafkaConsumer

PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../../..")
)

sys.path.append(PROJECT_ROOT)


from backend.kafka.config import (
    KAFKA_BOOTSTRAP_SERVERS,
    KAFKA_CONSUMER_GROUP,
    CONSUMER_MAX_TRANSACTIONS
)

from backend.kafka.topics import TRANSACTION_TOPIC

from backend.app.schemas.transaction_schema import (
    TransactionCreate
)

from backend.app.services.transaction_service import (
    create_new_transaction
)

# Process one transaction


async def process_transaction(transaction: dict):
    """
    Validate and process one Kafka transaction
    using the existing transaction service.
    """

    transaction_model = TransactionCreate(
        **transaction
    )

    result = await create_new_transaction(
        transaction_model
    )

    return result


# Create Kafka consumer

def create_kafka_consumer():
    """
    Create Kafka consumer instance.
    """

    return KafkaConsumer(
        TRANSACTION_TOPIC,
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        group_id=KAFKA_CONSUMER_GROUP,
        auto_offset_reset="earliest",
        enable_auto_commit=False,
        value_deserializer=lambda data: json.loads(
            data.decode("utf-8")
        )
    )


# Run fraud consumer

async def run_fraud_consumer():
    """
    Consume transactions from Kafka and process them.
    """

    consumer = create_kafka_consumer()

    print("\nKafka Fraud Consumer Started...\n")

    count = 0

    try:

        for message in consumer:

            transaction = message.value

            try:

                # Process transaction
                result = await process_transaction(
                    transaction
                )

                # Extract prediction
                prediction = result.get(
                    "prediction",
                    {}
                )

                print(
                    f"[{count + 1}/{CONSUMER_MAX_TRANSACTIONS}] "
                    f"Consumed: {transaction.get('transaction_id')} "
                    f"| Fraud: {prediction.get('final_prediction')} "
                    f"| Risk: {prediction.get('risk_score')}"
                )

            except HTTPException as e:

                # Duplicate transaction
                if (
                    e.status_code == 400
                    and "already exists" in str(e.detail).lower()
                ):

                    print(
                        f"[SKIPPED DUPLICATE] "
                        f"{transaction.get('transaction_id')}"
                    )

                else:

                    # Any other HTTPException is a real error
                    raise

            # Increase processed-message count
            count += 1

            # Commit only after successful processing
            # or intentional duplicate skipping
            consumer.commit()

            # Stop after configured number of messages
            if count >= CONSUMER_MAX_TRANSACTIONS:
                break

    finally:

        consumer.close()

    print(
        "\nKafka Fraud Consumer Finished Successfully"
    )

# Main

if __name__ == "__main__":

    asyncio.run(
        run_fraud_consumer()
    )