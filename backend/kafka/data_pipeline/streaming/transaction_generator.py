import random
import uuid
from datetime import datetime, timezone


def generate_transaction() -> dict:
    now = datetime.now(timezone.utc)

    locations = [
        "Delhi",
        "Mumbai",
        "Chennai",
        "Hyderabad",
        "Bangalore"
    ]

    location = random.choice(locations)

    return {
        "transaction_id": str(uuid.uuid4()),
        "user_id": float(random.randint(1000, 9999)),

        "transaction_amount": round(
            random.uniform(100, 50000),
            2
        ),

        "transaction_type": random.choice([
            "Online",
            "POS",
            "ATM",
            "UPI"
        ]),

        "timestamp": now.isoformat(),

        "account_balance": round(
            random.uniform(1000, 200000),
            2
        ),

        "device_type": random.choice([
            "Mobile",
            "Laptop",
            "Tablet",
            "Desktop"
        ]),

        "location": location,

        "merchant_category": random.choice([
            "Electronics",
            "Food",
            "Travel",
            "Shopping",
            "Fuel"
        ]),

        "ip_address_flag": random.choice([0, 1]),

        "previous_fraudulent_activity":
            random.choice([0, 1]),

        "daily_transaction_count":
            random.randint(1, 60),

        "avg_transaction_amount_7d":
            round(random.uniform(500, 20000), 2),

        "failed_transaction_count_7d":
            random.randint(0, 10),

        "card_type": random.choice([
            "Credit",
            "Debit"
        ]),

        "card_age": random.randint(30, 3650),

        "transaction_distance":
            round(random.uniform(1, 1000), 2),

        "authentication_method": random.choice([
            "OTP",
            "PIN",
            "Biometric",
            "Password"
        ]),

        "risk_score": round(
            random.uniform(0, 1),
            4
        ),

        "is_weekend":
            1 if now.weekday() >= 5 else 0,

        "ip_address": (
            f"192.168."
            f"{random.randint(0,255)}."
            f"{random.randint(1,254)}"
        ),

        "gps_location": location
    }