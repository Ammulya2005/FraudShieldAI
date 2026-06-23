#Import necessary libraries
import os
import sys
import joblib

from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
sys.path.append(os.getcwd())
from backend.ML.preprocessing.data_load import load_data, basic_cleaning
from backend.ML.preprocessing.balance_data import balance_dataset
from backend.ML.preprocessing.feature_engineering import create_features
from backend.ML.training.train_XGBoost import train_xgboost_pipeline
from backend.ML.training.train_isolation_forest import train_and_save_isolation_forest
RAW_DATA_PATH = r"backend\ML\data\raw\creditcard.csv"
BALANCED_DATA_PATH = r"backend\ML\data\processed\balanced_creditcard_new.csv"
FEATURE_DATA_PATH = r"backend\ML\data\processed\feature_engineered_creditcard.csv"
MODEL_DIR = r"backend\ML\saved_models"
ISO_MODEL_PATH = r"backend\ML\saved_models\isolation_forest_model.pkl"
ENCODER_PATH = r"backend\ML\saved_models\label_encoders.pkl"

#A function to encode categorical columns using LabelEncoder
def encode_categorical_columns(df):
    """
    Encode categorical columns using LabelEncoder.
    """
    label_encoders = {}
    categorical_columns = df.select_dtypes(
        include=["object", "string"]
    ).columns
    for col in categorical_columns:
        encoder = LabelEncoder()
        df[col] = encoder.fit_transform(df[col].astype(str))
        label_encoders[col] = encoder
    return df, label_encoders

#A function to run the complete ML pipeline
def run_pipeline():
    """
    Complete FraudShield AI ML pipeline.
    """
    print("\n========== FRAUDSHIELD AI ML PIPELINE STARTED ==========")
    df = load_data(RAW_DATA_PATH)
    df = basic_cleaning(df)
    df = balance_dataset(df)
    os.makedirs(os.path.dirname(BALANCED_DATA_PATH), exist_ok=True)
    df.to_csv(BALANCED_DATA_PATH, index=False)
    print("\nBalanced dataset saved at:", BALANCED_DATA_PATH)
    df = create_features(df)
    df, label_encoders = encode_categorical_columns(df)
    os.makedirs(os.path.dirname(FEATURE_DATA_PATH), exist_ok=True)
    df.to_csv(FEATURE_DATA_PATH, index=False)
    print("\nFeature engineered dataset saved at:", FEATURE_DATA_PATH)

    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(label_encoders, ENCODER_PATH)
    print("\nLabel encoders saved successfully")

    print("\n========== TRAINING XGBOOST MODEL ==========")
    xgb_model, X_test_scaled, y_test, validation_score = train_xgboost_pipeline(
        FEATURE_DATA_PATH
    )
    print("\n========== XGBOOST RESULTS ==========")
    print(f"Validation Accuracy: {validation_score:.4f}")
    y_pred = xgb_model.predict(X_test_scaled)
    print("\n========== XGBOOST MODEL EVALUATION ==========")
    print("Test Accuracy:", accuracy_score(y_test, y_pred))
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    
    print("\n========== TRAINING ISOLATION FOREST MODEL ==========")
    iso_model = train_and_save_isolation_forest(
        X_test_scaled,
        ISO_MODEL_PATH
    )
    print("\nIsolation Forest model saved at:", ISO_MODEL_PATH)
    print("\n========== PIPELINE COMPLETED SUCCESSFULLY ==========")
if __name__ == "__main__":
    run_pipeline()