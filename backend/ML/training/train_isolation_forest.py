import sys
import os

sys.path.append(os.getcwd())
import os
import joblib
from backend.ML.models.isolation_forest_model import train_isolation_forest_model

# Add a function to load the model from the saved path
def train_and_save_isolation_forest(X_train, model_path: str):
    """
    Train Isolation Forest anomaly detection model and save it.
    """
    print("\nTraining Isolation Forest Model...")
    model = train_isolation_forest_model(X_train)
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    joblib.dump(model, model_path)
    print("Isolation Forest model trained and saved successfully")
    print("Saved at:", model_path)
    return model