import pandas as pd
import numpy as np

#Adding transaction features to the dataset
def add_transaction_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create transaction amount and balance related features.
    """
    df = df.copy()
    if "Transaction_Amount" in df.columns and "Account_Balance" in df.columns:
        df["Amount_Balance_Ratio"] = (
            df["Transaction_Amount"] / (df["Account_Balance"] + 1)
        )
    if "Transaction_Amount" in df.columns:
        threshold = df["Transaction_Amount"].quantile(0.90)
        df["High_Amount_Flag"] = (
            df["Transaction_Amount"] > threshold
        ).astype(int)
    df.replace([np.inf, -np.inf], 0, inplace=True)
    df.fillna(0, inplace=True)
    return df