from predict_fraud import predict_single_transaction
sample_transaction = {
    "Transaction_Amount": 15000,
    "Account_Balance": 25000,
    "Transaction_Type": "Online",
    "Device_Type": "Mobile",
    "Location": "Delhi",
    "Merchant_Category": "Electronics",
    "IP_Address_Flag": 1,
    "Previous_Fraudulent_Activity": 1,
    "Daily_Transaction_Count": 40,
    "Avg_Transaction_Amount_7d": 1000,
    "Transaction_Distance": 500,
    "Risk_Score": 85
}
result = predict_single_transaction(sample_transaction)
print("\n========== FRAUD PREDICTION RESULT ==========")
print("Fraud Prediction:", result["fraud_prediction"])
print("Fraud Probability:", result["fraud_probability"])
print("Risk Level:", result["risk_level"])