import os
import sys
PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../..")
)
sys.path.append(PROJECT_ROOT)
from backend.database.connection import get_database
db = get_database()
db["transactions"].delete_many({})
db["fraud_alerts"].delete_many({})
print("Database cleared successfully")