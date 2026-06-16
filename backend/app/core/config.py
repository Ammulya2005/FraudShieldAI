import os
from dotenv import load_dotenv

load_dotenv()

APP_NAME = os.getenv("APP_NAME")
APP_VERSION = os.getenv("APP_VERSION")

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

KAFKA_BOOTSTRAP_SERVERS = os.getenv(
    "KAFKA_BOOTSTRAP_SERVERS"
)

KAFKA_TOPIC = os.getenv(
    "KAFKA_TOPIC"
)

KAFKA_CONSUMER_GROUP = os.getenv(
    "KAFKA_CONSUMER_GROUP"
)

PRODUCER_MAX_TRANSACTIONS = int(
    os.getenv("PRODUCER_MAX_TRANSACTIONS", 20)
)

CONSUMER_MAX_TRANSACTIONS = int(
    os.getenv("CONSUMER_MAX_TRANSACTIONS", 20)
)

PRODUCER_INTERVAL_SECONDS = int(
    os.getenv("PRODUCER_INTERVAL_SECONDS", 2)
)

SECRET_KEY = os.getenv("SECRET_KEY")

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60)
)

ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

DEBUG = os.getenv("DEBUG", "True").lower() == "true"