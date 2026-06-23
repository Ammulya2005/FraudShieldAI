import os
import sys
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../../..")
)
sys.path.append(os.path.join(PROJECT_ROOT, "backend", "ML"))
from models.XGBoost_model import train_xgboost_model
from training.evaluation import calculate_validation_score
def train_xgboost_pipeline(dataset_path: str):
    """
    Complete XGBoost training pipeline for FraudShield AI.
    """
    print("=" * 50)
    print("Loading Dataset...")
    print("=" * 50)
    df = pd.read_csv(dataset_path)
    target_column = "Fraud_Label"
    if target_column not in df.columns:
        raise ValueError(f"{target_column} column not found in dataset")
    X = df.drop(columns=[target_column])
    y = df[target_column]
    print("Features Shape:", X.shape)
    print("Target Shape:", y.shape)
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y
    )
    print("\nTrain-Test Split Completed")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    print("Feature Scaling Completed")
    print("\nTraining XGBoost Model...")
    model = train_xgboost_model(
        X_train_scaled,
        y_train
    )
    print("XGBoost Training Completed")
    validation_score = calculate_validation_score(
        model,
        X_train_scaled,
        y_train
    )
    print(f"\nValidation Accuracy: {validation_score:.4f}")
    model_dir = os.path.join(PROJECT_ROOT, "backend", "ML", "saved_models")
    os.makedirs(model_dir, exist_ok=True)
    joblib.dump(
        model,
        os.path.join(model_dir, "xgboost_model.pkl")
    )
    joblib.dump(
        scaler,
        os.path.join(model_dir, "scaler.pkl")
    )
    joblib.dump(
        X.columns.tolist(),
        os.path.join(model_dir, "feature_columns.pkl")
    )
    print("\nArtifacts Saved Successfully")
    return model, X_test_scaled, y_test, validation_score
