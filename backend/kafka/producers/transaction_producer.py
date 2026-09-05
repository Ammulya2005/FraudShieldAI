import os
import sys
import json
import time
PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../../..")
)
sys.path.append(PROJECT_ROOT)
from kafka import KafkaProducer
from backend.kafka.config import (
    KAFKA_BOOTSTRAP_SERVERS,
    PRODUCER_INTERVAL_SECONDS,
    PRODUCER_MAX_TRANSACTIONS
)
from backend.kafka.topics import TRANSACTION_TOPIC
from backend.kafka.data_pipeline.streaming.transaction_generator import (
    generate_transaction
)
def create_kafka_producer():
    """
    Create Kafka producer instance.
    """
    producer = KafkaProducer(
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        value_serializer=lambda data: json.dumps(data).encode("utf-8")
    )
    return producer
def send_transaction(producer, transaction: dict):
    """
    Send transaction to Kafka topic.
    """
    producer.send(
        TRANSACTION_TOPIC,
        transaction
    )
    producer.flush()
def run_transaction_producer():
    """
    Produce limited transactions based on config.py.
    """
    producer = create_kafka_producer()
    print("\nKafka Producer Started...\n")
    for count in range(PRODUCER_MAX_TRANSACTIONS):
        transaction = generate_transaction()
        send_transaction(
            producer,
            transaction
        )
        print(
            f"[{count + 1}/{PRODUCER_MAX_TRANSACTIONS}] "
            f"Produced Transaction: {transaction['transaction_id']}"
        )
        time.sleep(PRODUCER_INTERVAL_SECONDS)
    producer.close()
    print("\nKafka Producer Finished Successfully")
if __name__ == "__main__":
    run_transaction_producer()