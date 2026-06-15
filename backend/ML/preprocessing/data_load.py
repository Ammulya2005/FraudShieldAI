import pandas as pd


def load_data(path: str) -> pd.DataFrame:
    """
    Load dataset from given path
    """
    df = pd.read_csv(path)
    return df


def basic_cleaning(df: pd.DataFrame) -> pd.DataFrame:
    """
    Perform basic cleaning
    """
    df = df.dropna()
    return df



