import os
import sys
import json
import asyncio

PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../../..")
)

sys.path.append(PROJECT_ROOT)

from kafka import KafkaConsumer

from backend.kafka.config import (
    KAFKA_BOOTSTRAP_SERVERS,
    KAFKA_CONSUMER_GROUP,
    CONSUMER_MAX_TRANSACTIONS
)

from backend.kafka.topics import TRANSACTION_TOPIC

from backend.ML.inference.predict_fraud import predict_single_transaction

from backend.database.transaction_repository import save_transaction
from backend.database.alert_repository import save_fraud_alert


def create_kafka_consumer():
    """
    Create Kafka consumer instance.
    """

    return KafkaConsumer(
        TRANSACTION_TOPIC,
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        group_id=KAFKA_CONSUMER_GROUP,
        auto_offset_reset="latest",
        enable_auto_commit=True,
        value_deserializer=lambda data: json.loads(data.decode("utf-8"))
    )


async def process_transaction(transaction: dict):
    """
    Predict fraud and save transaction details using Motor async MongoDB.
    """

    prediction_result = predict_single_transaction(transaction)

    await save_transaction(transaction, prediction_result)

    await save_fraud_alert(transaction, prediction_result)

    return prediction_result


async def run_fraud_consumer():
    """
    Consume limited Kafka transactions and process fraud prediction.
    """

    consumer = create_kafka_consumer()

    print("\nKafka Fraud Consumer Started...\n")

    count = 0

    try:
        for message in consumer:
            transaction = message.value

            prediction_result = await process_transaction(transaction)

            count += 1

            print(
                f"[{count}/{CONSUMER_MAX_TRANSACTIONS}] "
                f"Consumed: {transaction.get('Transaction_ID')} "
                f"| Fraud: {prediction_result['fraud_prediction']} "
                f"| Risk: {prediction_result['risk_level']}"
            )

            if count >= CONSUMER_MAX_TRANSACTIONS:
                break

    finally:
        consumer.close()

    print("\nKafka Fraud Consumer Finished Successfully")


if __name__ == "__main__":
    asyncio.run(run_fraud_consumer())