import os

KAFKA_BOOTSTRAP_SERVERS = os.getenv(
    "KAFKA_BOOTSTRAP_SERVERS",
    "localhost:9092"
)

KAFKA_TOPIC = os.getenv(
    "KAFKA_TOPIC",
    "fraud_transactions"
)

KAFKA_CONSUMER_GROUP = os.getenv(
    "KAFKA_CONSUMER_GROUP",
    "fraudshield-fraud-consumer"
)

PRODUCER_MAX_TRANSACTIONS = int(
    os.getenv("PRODUCER_MAX_TRANSACTIONS", "5")
)

CONSUMER_MAX_TRANSACTIONS = int(
    os.getenv("CONSUMER_MAX_TRANSACTIONS", "5")
)

PRODUCER_INTERVAL_SECONDS = float(
    os.getenv("PRODUCER_INTERVAL_SECONDS", "1")
)