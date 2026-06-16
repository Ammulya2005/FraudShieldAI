# datapreprocess.py (Balanced dataset)
import pandas as pd     
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
# Load dataset
df = pd.read_csv("C:\\FraudShieldAI\\backend\\dataset\\balanced_creditcard_new.csv")
# 1. Basic Cleaning
df.drop_duplicates(inplace=True)
df.dropna(inplace=True)
# Convert Timestamp to datetime
df['Timestamp'] = pd.to_datetime(df['Timestamp'])
# 2. Feature Engineering
# Extract time-based features (velocity + behavior)
df['Hour'] = df['Timestamp'].dt.hour
df['Day'] = df['Timestamp'].dt.day
df['Month'] = df['Timestamp'].dt.month
# Spending behavior ratio
df['Amount_to_Balance_Ratio'] = df['Transaction_Amount'] / (df['Account_Balance'] + 1)
# Velocity feature
df['Transaction_Frequency_Score'] = df['Daily_Transaction_Count'] / (df['Avg_Transaction_Amount_7d'] + 1)
# Risk interaction feature
df['Risk_Interaction'] = df['Risk_Score'] * df['Previous_Fraudulent_Activity']
# 3. Encoding Categorical Variables
categorical_cols = [
    'Transaction_Type', 'Device_Type', 'Location',
    'Merchant_Category', 'Card_Type', 'Authentication_Method'
]
le = LabelEncoder()
for col in categorical_cols:
    df[col] = le.fit_transform(df[col])
# 4. Drop unnecessary columns
df.drop(['Transaction_ID', 'User_ID', 'Timestamp'], axis=1, inplace=True)
# 5. Define Input and Target
# Keep only numeric columns
X = df.drop('Fraud_Label', axis=1)
X = X.select_dtypes(include=[np.number])
y = df['Fraud_Label']
# 6. Feature Scaling
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
# 7. Final Output
print(" Data processed successfully")
print("Shape of X:", X.shape)
print("Shape of y:", y.shape)
print("\nTarget Distribution:\n", y.value_counts())