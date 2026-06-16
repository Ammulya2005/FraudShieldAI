import random
import uuid
def generate_transaction() -> dict:
    """
    Generate one simulated real-time transaction.
    """
    return {
        "Transaction_ID": str(uuid.uuid4()),
        "Transaction_Amount": round(random.uniform(100, 50000), 2),
        "Account_Balance": round(random.uniform(1000, 200000), 2),
        "Transaction_Type": random.choice(["Online", "POS", "ATM", "UPI"]),
        "Device_Type": random.choice(["Mobile", "Laptop", "Tablet", "Desktop"]),
        "Location": random.choice(["Delhi", "Mumbai", "Chennai", "Hyderabad", "Bangalore"]),
        "Merchant_Category": random.choice(["Electronics", "Food", "Travel", "Shopping", "Fuel"]),
        "IP_Address_Flag": random.choice([0, 1]),
        "Previous_Fraudulent_Activity": random.choice([0, 1]),
        "Daily_Transaction_Count": random.randint(1, 60),
        "Avg_Transaction_Amount_7d": round(random.uniform(500, 20000), 2),
        "Transaction_Distance": round(random.uniform(1, 1000), 2),
        "Risk_Score": random.randint(1, 100)
    }