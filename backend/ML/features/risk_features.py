import pandas as pd

#Adding risk features to the dataset

def add_risk_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create risk-score and anomaly related features.
    """
    df = df.copy()
    if "Risk_Score" in df.columns and "Transaction_Amount" in df.columns:
        df["Risk_Amount_Interaction"] = (
            df["Risk_Score"] * df["Transaction_Amount"]
        )
    if "Transaction_Distance" in df.columns:
        threshold = df["Transaction_Distance"].quantile(0.90)
        df["Geo_Anomaly_Flag"] = (
            df["Transaction_Distance"] > threshold
        ).astype(int)
    if "Risk_Score" in df.columns:
        df["High_Risk_Flag"] = (
            df["Risk_Score"] >= 70
        ).astype(int)
    return df
