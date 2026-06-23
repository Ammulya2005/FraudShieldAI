import pandas as pd

# Adding behavioral features to the dataset

def add_behavioral_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create spending behavior related features.
    """
    df = df.copy()
    if "Transaction_Amount" in df.columns and "Avg_Transaction_Amount_7d" in df.columns:
        df["Spending_Behavior_Ratio"] = (
            df["Transaction_Amount"] / (df["Avg_Transaction_Amount_7d"] + 1)
        )
    if "Previous_Fraudulent_Activity" in df.columns:
        df["Previous_Fraud_Flag"] = (
            df["Previous_Fraudulent_Activity"] > 0
        ).astype(int)
    return df