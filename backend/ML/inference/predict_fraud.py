import os
import sys
import joblib
import pandas as pd
PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../../..")
)
ML_ROOT = os.path.join(PROJECT_ROOT, "backend", "ML")
sys.path.append(ML_ROOT)
from preprocessing.feature_engineering import create_features
from inference.risk_scoring import calculate_risk_level
MODEL_PATH = os.path.join(
    PROJECT_ROOT,
    "backend",
    "ML",
    "saved_models",
    "xgboost_model.pkl"
)
SCALER_PATH = os.path.join(
    PROJECT_ROOT,
    "backend",
    "ML",
    "saved_models",
    "scaler.pkl"
)
FEATURE_COLUMNS_PATH = os.path.join(
    PROJECT_ROOT,
    "backend",
    "ML",
    "saved_models",
    "feature_columns.pkl"
)
ENCODER_PATH = os.path.join(
    PROJECT_ROOT,
    "backend",
    "ML",
    "saved_models",
    "label_encoders.pkl"
)
def load_artifacts():
    """
    Load trained model, scaler, feature columns, and label encoders.
    """
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    feature_columns = joblib.load(FEATURE_COLUMNS_PATH)
    if os.path.exists(ENCODER_PATH):
        label_encoders = joblib.load(ENCODER_PATH)
    else:
        label_encoders = {}
    return model, scaler, feature_columns, label_encoders
def encode_input_data(
    df: pd.DataFrame,
    label_encoders: dict
) -> pd.DataFrame:
    """
    Encode categorical input columns using saved LabelEncoders.
    Unknown values are replaced with the first known class.
    """
    df = df.copy()
    for col, encoder in label_encoders.items():
        if col in df.columns:
            df[col] = df[col].astype(str)
            known_classes = set(encoder.classes_)
            df[col] = df[col].apply(
                lambda value: value
                if value in known_classes
                else encoder.classes_[0]
            )
            df[col] = encoder.transform(df[col])
    return df
def align_columns(
    df: pd.DataFrame,
    feature_columns: list
) -> pd.DataFrame:
    """
    Align input columns with training feature columns.
    Missing columns are filled with 0.
    """
    df = df.copy()
    for col in feature_columns:
        if col not in df.columns:
            df[col] = 0
    df = df[feature_columns]
    return df
def predict_single_transaction(transaction: dict) -> dict:
    """
    Predict fraud for a single transaction.
    """
    model, scaler, feature_columns, label_encoders = load_artifacts()
    input_df = pd.DataFrame([transaction])
    input_df = create_features(input_df)
    input_df = encode_input_data(
        input_df,
        label_encoders
    )
    input_df = align_columns(
        input_df,
        feature_columns
    )
    input_scaled = scaler.transform(input_df)
    prediction = model.predict(input_scaled)[0]
    fraud_probability = model.predict_proba(input_scaled)[0][1]
    risk_level = calculate_risk_level(fraud_probability)
    return {
        "fraud_prediction": int(prediction),
        "fraud_probability": round(float(fraud_probability), 4),
        "risk_level": risk_level
    }