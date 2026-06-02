import pandas as pd

def add_velocity_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create transaction velocity based features.
    """
    df = df.copy()
    if "Daily_Transaction_Count" in df.columns:
        threshold = df["Daily_Transaction_Count"].quantile(0.90)
        df["High_Velocity_Flag"] = (
            df["Daily_Transaction_Count"] > threshold
        ).astype(int)
    if "Avg_Transaction_Amount_7d" in df.columns and "Transaction_Amount" in df.columns:
        df["Amount_Deviation_7d"] = (
            df["Transaction_Amount"] - df["Avg_Transaction_Amount_7d"]
        )
    return df