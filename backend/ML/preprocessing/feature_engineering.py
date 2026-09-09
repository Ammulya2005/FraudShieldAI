import pandas as pd
import numpy as np


def create_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create consistent fraud detection features.

    The same feature definitions must be used during
    training and live prediction.
    """

    df = df.copy()

    print("\nStarting Feature Engineering...")

    # ---------------------------------------------------------
    # Timestamp features
    # ---------------------------------------------------------
    if "Timestamp" in df.columns:
        df["Timestamp"] = pd.to_datetime(
            df["Timestamp"],
            errors="coerce"
        )

        df["Transaction_Hour"] = df["Timestamp"].dt.hour
        df["Transaction_Day"] = df["Timestamp"].dt.day
        df["Transaction_Month"] = df["Timestamp"].dt.month

        df.drop(
            columns=["Timestamp"],
            inplace=True
        )

    # ---------------------------------------------------------
    # Amount / Balance Ratio
    # ---------------------------------------------------------
    if (
        "Transaction_Amount" in df.columns
        and "Account_Balance" in df.columns
    ):
        df["Amount_Balance_Ratio"] = (
            df["Transaction_Amount"]
            / (df["Account_Balance"] + 1)
        )

    # ---------------------------------------------------------
    # High Amount Flag
    # ---------------------------------------------------------
    if "Transaction_Amount" in df.columns:
        amount_threshold = 10000

        df["High_Amount_Flag"] = (
            df["Transaction_Amount"] > amount_threshold
        ).astype(int)

    # ---------------------------------------------------------
    # High Velocity Flag
    # ---------------------------------------------------------
    if "Daily_Transaction_Count" in df.columns:
        velocity_threshold = 5

        df["High_Velocity_Flag"] = (
            df["Daily_Transaction_Count"] >= velocity_threshold
        ).astype(int)

    # ---------------------------------------------------------
    # Geographic Anomaly Flag
    # ---------------------------------------------------------
    if "Transaction_Distance" in df.columns:
        distance_threshold = 100

        df["Geo_Anomaly_Flag"] = (
            df["Transaction_Distance"] > distance_threshold
        ).astype(int)

    # ---------------------------------------------------------
    # Risk / Amount Interaction
    # ---------------------------------------------------------
    if (
        "Risk_Score" in df.columns
        and "Transaction_Amount" in df.columns
    ):
        df["Risk_Amount_Interaction"] = (
            df["Risk_Score"]
            * df["Transaction_Amount"]
        )

    # ---------------------------------------------------------
    # Drop unnecessary ID columns
    # ---------------------------------------------------------
    drop_columns = [
        "Transaction_ID",
        "User_ID",
        "IP_Address"
    ]

    existing_drop_columns = [
        col
        for col in drop_columns
        if col in df.columns
    ]

    df.drop(
        columns=existing_drop_columns,
        inplace=True
    )

    # ---------------------------------------------------------
    # Handle invalid values
    # ---------------------------------------------------------
    df.replace(
        [np.inf, -np.inf],
        0,
        inplace=True
    )

    df.fillna(
        0,
        inplace=True
    )

    print(
        "Feature Engineering Completed"
    )

    print(
        "Shape After Feature Engineering:",
        df.shape
    )

    return df