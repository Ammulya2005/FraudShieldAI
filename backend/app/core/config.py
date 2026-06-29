from dotenv import load_dotenv
import os

load_dotenv()
# Load configuration from environment variables
APP_NAME = os.getenv("APP_NAME")

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_REFRESH_SECRET_KEY = os.getenv("JWT_REFRESH_SECRET_KEY")

JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30)
)

REFRESH_TOKEN_EXPIRE_DAYS = int(
    os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7)
)
# Logging configuration
LOG_DIR = os.getenv("LOG_DIR", "logs")
LOG_FILE = os.getenv("LOG_FILE", "app.log")

LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
TRANSACTIONS_COLLECTION = os.getenv("TRANSACTIONS_COLLECTION", "transactions")
FRAUD_CASES_COLLECTION = os.getenv("FRAUD_CASES_COLLECTION", "fraud_cases")
ALERTS_COLLECTION = os.getenv("ALERTS_COLLECTION", "alerts")
AUDIT_LOGS_COLLECTION = os.getenv("AUDIT_LOGS_COLLECTION", "audit_logs")
MODELS_COLLECTION = os.getenv("MODELS_COLLECTION", "models")
NOTIFICATIONS_COLLECTION = os.getenv("NOTIFICATIONS_COLLECTION", "notifications")
PERMISSIONS_COLLECTION = os.getenv("PERMISSIONS_COLLECTION", "permissions")
SETTINGS_COLLECTION = os.getenv("SETTINGS_COLLECTION", "settings")
USERS_COLLECTION = "users"
ROLES_COLLECTION = "roles"
USER_ROLES_COLLECTION = "user_roles"
CASE_REVIEWS_COLLECTION = "case_reviews"