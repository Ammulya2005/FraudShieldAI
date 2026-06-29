from pathlib import Path
from datetime import datetime
from typing import Any, Dict

import joblib
import numpy as np
import pandas as pd


BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "saved_models"

XGBOOST_MODEL_PATH = MODEL_DIR / "xgboost_model.pkl"
ISOLATION_MODEL_PATH = MODEL_DIR / "isolation_forest_model.pkl"
ENCODERS_PATH = MODEL_DIR / "label_encoders.pkl"
SCALER_PATH = MODEL_DIR / "scaler.pkl"
FEATURE_COLUMNS_PATH = MODEL_DIR / "feature_columns.pkl"


class FraudPredictor:
    def __init__(self):
        self.xgb_model = joblib.load(XGBOOST_MODEL_PATH)
        self.iso_model = joblib.load(ISOLATION_MODEL_PATH)
        self.label_encoders = joblib.load(ENCODERS_PATH)
        self.scaler = joblib.load(SCALER_PATH)
        self.feature_columns = joblib.load(FEATURE_COLUMNS_PATH)

    def _parse_timestamp(
        self,
        timestamp_value: str
    ) -> datetime:
        try:
            return datetime.fromisoformat(
                timestamp_value.replace("Z", "")
            )
        except Exception:
            return datetime.strptime(
                timestamp_value,
                "%Y-%m-%d %H:%M:%S"
            )

    def _safe_label_encode(
        self,
        column_name: str,
        value: Any
    ) -> int:
        encoder = self.label_encoders.get(column_name)

        if encoder is None:
            raise ValueError(
                f"Missing label encoder for {column_name}"
            )

        value = str(value)

        if value in encoder.classes_:
            return int(
                encoder.transform([value])[0]
            )

        return -1

    def _build_feature_frame(
        self,
        transaction: Dict[str, Any]
    ) -> pd.DataFrame:
        timestamp_obj = self._parse_timestamp(
            transaction["timestamp"]
        )

        transaction_amount = float(
            transaction["transaction_amount"]
        )
        account_balance = float(
            transaction["account_balance"]
        )
        daily_transaction_count = float(
            transaction["daily_transaction_count"]
        )
        risk_score = float(
            transaction["risk_score"]
        )
        transaction_distance = float(
            transaction["transaction_distance"]
        )

        amount_balance_ratio = (
            transaction_amount / account_balance
            if account_balance > 0
            else 0.0
        )

        high_amount_flag = (
            1 if transaction_amount > 10000 else 0
        )

        high_velocity_flag = (
            1 if daily_transaction_count >= 5 else 0
        )

        geo_anomaly_flag = (
            1 if transaction_distance > 100 else 0
        )

        risk_amount_interaction = (
            risk_score * transaction_amount
        )

        row = {
            "Transaction_Amount": transaction_amount,
            "Transaction_Type": self._safe_label_encode(
                "Transaction_Type",
                transaction["transaction_type"]
            ),
            "Account_Balance": account_balance,
            "Device_Type": self._safe_label_encode(
                "Device_Type",
                transaction["device_type"]
            ),
            "Location": self._safe_label_encode(
                "Location",
                transaction["location"]
            ),
            "Merchant_Category": self._safe_label_encode(
                "Merchant_Category",
                transaction["merchant_category"]
            ),
            "IP_Address_Flag": float(
                transaction["ip_address_flag"]
            ),
            "Previous_Fraudulent_Activity": float(
                transaction["previous_fraudulent_activity"]
            ),
            "Daily_Transaction_Count": daily_transaction_count,
            "Avg_Transaction_Amount_7d": float(
                transaction["avg_transaction_amount_7d"]
            ),
            "Failed_Transaction_Count_7d": float(
                transaction["failed_transaction_count_7d"]
            ),
            "Card_Type": self._safe_label_encode(
                "Card_Type",
                transaction["card_type"]
            ),
            "Card_Age": float(
                transaction["card_age"]
            ),
            "Transaction_Distance": transaction_distance,
            "Authentication_Method": self._safe_label_encode(
                "Authentication_Method",
                transaction["authentication_method"]
            ),
            "Risk_Score": risk_score,
            "Is_Weekend": float(
                transaction["is_weekend"]
            ),
            "GPS_Location": self._safe_label_encode(
                "GPS_Location",
                transaction["gps_location"]
            ),
            "Transaction_Hour": timestamp_obj.hour,
            "Transaction_Day": timestamp_obj.day,
            "Transaction_Month": timestamp_obj.month,
            "Amount_Balance_Ratio": amount_balance_ratio,
            "High_Amount_Flag": high_amount_flag,
            "High_Velocity_Flag": high_velocity_flag,
            "Geo_Anomaly_Flag": geo_anomaly_flag,
            "Risk_Amount_Interaction": risk_amount_interaction
        }

        df = pd.DataFrame([row])

        for column in self.feature_columns:
            if column not in df.columns:
                df[column] = 0

        df = df[self.feature_columns]

        return df

    def predict(
        self,
        transaction: Dict[str, Any]
    ) -> Dict[str, Any]:
        df = self._build_feature_frame(
            transaction
        )

        scaled_features = self.scaler.transform(df)

        xgb_prediction = int(
            self.xgb_model.predict(scaled_features)[0]
        )

        xgb_probability = 0.0
        if hasattr(
            self.xgb_model,
            "predict_proba"
        ):
            xgb_probability = float(
                self.xgb_model.predict_proba(
                    scaled_features
                )[0][1]
            )

        isolation_prediction = int(
            self.iso_model.predict(
                scaled_features
            )[0]
        )

        anomaly_score = float(
            self.iso_model.decision_function(
                scaled_features
            )[0]
        )

        normalized_anomaly_score = max(
            0.0,
            min(
                1.0,
                (0.5 - anomaly_score)
            )
        )

        final_risk_score = round(
            (
                (xgb_probability * 0.7) +
                (normalized_anomaly_score * 0.3)
            ),
            4
        )

        final_prediction = (
            "fraud"
            if xgb_prediction == 1
            or isolation_prediction == -1
            or final_risk_score >= 0.65
            else "legitimate"
        )

        return {
            "xgboost_prediction": xgb_prediction,
            "xgboost_probability": round(
                xgb_probability,
                4
            ),
            "isolation_prediction": isolation_prediction,
            "anomaly_score": round(
                anomaly_score,
                4
            ),
            "risk_score": final_risk_score,
            "final_prediction": final_prediction,
            "status": (
                "pending_review"
                if final_prediction == "fraud"
                else "clean"
            )
        }


predictor = FraudPredictor()


def predict_transaction(
    transaction: Dict[str, Any]
) -> Dict[str, Any]:
    return predictor.predict(transaction)