import pandas as pd
import os
from sklearn.preprocessing import LabelEncoder, StandardScaler
df = pd.read_csv("backend/dataset/creditcard.csv")
df.drop_duplicates(inplace=True)
df.dropna(inplace=True)
df["Timestamp"] = pd.to_datetime(df["Timestamp"])
df["Hour"] = df["Timestamp"].dt.hour
df["Day"] = df["Timestamp"].dt.day
df["Month"] = df["Timestamp"].dt.month
df["Amount_to_Balance_Ratio"] = df["Transaction_Amount"] / (df["Account_Balance"] + 1)
df["Transaction_Frequency_Score"] = df["Daily_Transaction_Count"] / (df["Avg_Transaction_Amount_7d"] + 1)
df["Risk_Interaction"] = df["Risk_Score"] * df["Previous_Fraudulent_Activity"]
df["High_Distance_Flag"] = (
    df["Transaction_Distance"] > df["Transaction_Distance"].mean()
).astype(int)
categorical_cols = [
    "Transaction_Type",
    "Device_Type",
    "Location",
    "Merchant_Category",
    "Card_Type",
    "Authentication_Method"
]
le = LabelEncoder()
for col in categorical_cols:
    df[col] = le.fit_transform(df[col])
df.drop(["Transaction_ID", "User_ID", "Timestamp"], axis=1, inplace=True)
X = df.drop("Fraud_Label", axis=1)
y = df["Fraud_Label"]
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
os.makedirs("processed", exist_ok=True)
processed_df = pd.DataFrame(X_scaled, columns=X.columns)
processed_df["Fraud_Label"] = y.values
processed_df.to_csv("processed/processed_original_creditcard.csv", index=False)
print("Original dataset processed successfully")
print("X shape:", X.shape)
print("y shape:", y.shape)
print("\nTarget Distribution:\n", y.value_counts())


