import os
import joblib
import pandas as pd
import sys
import os
sys.path.append(os.getcwd())
from backend.ML.inference.risk_scoring import (
    calculate_risk_score,
    assign_risk_level
)
MODEL_PATH = r"backend\ML\saved_models\random_forest_model.pkl"
SCALER_PATH = r"backend\ML\saved_models\scaler.pkl"
COLUMNS_PATH = r"backend\ML\saved_models\columns.pkl"
def load_prediction_artifacts():
    """
    Load trained model, scaler, and training columns.
    """
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    columns = joblib.load(COLUMNS_PATH)
    return model, scaler, columns
def prepare_input_data(transaction: dict, columns: list) -> pd.DataFrame:
    """
    Convert transaction dictionary into model-ready DataFrame.
    """
    input_df = pd.DataFrame([transaction])
    # Add missing columns
    for col in columns:
        if col not in input_df.columns:
            input_df[col] = 0

    # Keep same column order as training
    input_df = input_df[columns]

    return input_df


def predict_fraud(transaction: dict) -> dict:
    """
    Predict fraud status, fraud probability, risk score, and risk level.
    """

    model, scaler, columns = load_prediction_artifacts()

    input_df = prepare_input_data(transaction, columns)

    input_scaled = scaler.transform(input_df)

    fraud_prediction = int(model.predict(input_scaled)[0])

    fraud_probability = float(model.predict_proba(input_scaled)[0][1])

    risk_score = calculate_risk_score(fraud_probability)
    risk_level = assign_risk_level(risk_score)

    return {
        "fraud_prediction": fraud_prediction,
        "fraud_probability": round(fraud_probability, 4),
        "risk_score": risk_score,
        "risk_level": risk_level
    }