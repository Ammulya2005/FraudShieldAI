import pandas as pd
from sklearn.utils import resample


def balance_dataset(df: pd.DataFrame) -> pd.DataFrame:
    """
    Balance fraud and non-fraud classes
    """

    print("\nOriginal Fraud Label Count:")
    print(df["Fraud_Label"].value_counts())

    fraud_0 = df[df["Fraud_Label"] == 0]
    fraud_1 = df[df["Fraud_Label"] == 1]

    minority_count = min(len(fraud_0), len(fraud_1))

    fraud_0_balanced = resample(
        fraud_0,
        replace=False,
        n_samples=minority_count,
        random_state=42
    )

    fraud_1_balanced = resample(
        fraud_1,
        replace=False,
        n_samples=minority_count,
        random_state=42
    )

    balanced_df = pd.concat([
        fraud_0_balanced,
        fraud_1_balanced
    ])

    balanced_df = balanced_df.sample(
        frac=1,
        random_state=42
    ).reset_index(drop=True)

    print("\nBalanced Fraud Label Count:")
    print(balanced_df["Fraud_Label"].value_counts())

    return balanced_df