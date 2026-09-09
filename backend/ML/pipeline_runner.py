import os
import sys
import joblib

from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

# ---------------------------------------------------------
# Project root
# ---------------------------------------------------------
PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../..")
)

sys.path.append(PROJECT_ROOT)

# ---------------------------------------------------------
# ML imports
# ---------------------------------------------------------
from backend.ML.preprocessing.data_load import (
    load_data,
    basic_cleaning
)

from backend.ML.preprocessing.balance_data import (
    balance_dataset
)

from backend.ML.preprocessing.feature_engineering import (
    create_features
)

from backend.ML.training.train_xgboost import (
    train_xgboost_pipeline
)

from backend.ML.training.train_isolation_forest import (
    train_and_save_isolation_forest
)


# ---------------------------------------------------------
# Paths
# ---------------------------------------------------------
RAW_DATA_PATH = (
    r"backend\ML\data\raw\creditcard.csv"
)

BALANCED_DATA_PATH = (
    r"backend\ML\data\processed\balanced_creditcard_new.csv"
)

FEATURE_DATA_PATH = (
    r"backend\ML\data\processed\feature_engineered_creditcard.csv"
)

MODEL_DIR = (
    r"backend\ML\saved_models"
)

ISO_MODEL_PATH = (
    r"backend\ML\saved_models\isolation_forest_model.pkl"
)

ENCODER_PATH = (
    r"backend\ML\saved_models\label_encoders.pkl"
)


# ---------------------------------------------------------
# Encode categorical columns
# ---------------------------------------------------------
def encode_categorical_columns(df):
    """
    Encode categorical columns using LabelEncoder.

    The encoders are saved so that the same mappings
    can be reused during live prediction.
    """

    label_encoders = {}

    categorical_columns = (
        df.select_dtypes(
            include=["object", "string"]
        ).columns
    )

    for col in categorical_columns:

        encoder = LabelEncoder()

        df[col] = encoder.fit_transform(
            df[col].astype(str)
        )

        label_encoders[col] = encoder

    return df, label_encoders


# ---------------------------------------------------------
# Main ML pipeline
# ---------------------------------------------------------
def run_pipeline():

    print("\n")
    print("=" * 70)
    print("FRAUDSHIELD AI - ML PIPELINE")
    print("=" * 70)

    # =====================================================
    # STEP 1 - LOAD DATA
    # =====================================================
    print("\n[1/8] Loading dataset...")

    df = load_data(
        RAW_DATA_PATH
    )

    print(
        "Raw dataset shape:",
        df.shape
    )

    # =====================================================
    # STEP 2 - BASIC CLEANING
    # =====================================================
    print("\n[2/8] Performing basic cleaning...")

    df = basic_cleaning(
        df
    )

    print(
        "Shape after cleaning:",
        df.shape
    )

    # =====================================================
    # STEP 3 - BALANCE DATASET
    # =====================================================
    print("\n[3/8] Balancing dataset...")

    df = balance_dataset(
        df
    )

    print(
        "Shape after balancing:",
        df.shape
    )

    # Save balanced dataset
    os.makedirs(
        os.path.dirname(
            BALANCED_DATA_PATH
        ),
        exist_ok=True
    )

    df.to_csv(
        BALANCED_DATA_PATH,
        index=False
    )

    print(
        "Balanced dataset saved:",
        BALANCED_DATA_PATH
    )

    # =====================================================
    # STEP 4 - FEATURE ENGINEERING
    # =====================================================
    print("\n[4/8] Creating features...")

    df = create_features(
        df
    )

    print(
        "Shape after feature engineering:",
        df.shape
    )

    # =====================================================
    # STEP 5 - ENCODE CATEGORICAL DATA
    # =====================================================
    print("\n[5/8] Encoding categorical columns...")

    df, label_encoders = (
        encode_categorical_columns(df)
    )

    print(
        "Categorical columns encoded:",
        list(label_encoders.keys())
    )

    # Save feature-engineered dataset
    os.makedirs(
        os.path.dirname(
            FEATURE_DATA_PATH
        ),
        exist_ok=True
    )

    df.to_csv(
        FEATURE_DATA_PATH,
        index=False
    )

    print(
        "Feature dataset saved:",
        FEATURE_DATA_PATH
    )

    # Save label encoders
    os.makedirs(
        MODEL_DIR,
        exist_ok=True
    )

    joblib.dump(
        label_encoders,
        ENCODER_PATH
    )

    print(
        "Label encoders saved:",
        ENCODER_PATH
    )

    # =====================================================
    # STEP 6 - TRAIN XGBOOST
    # =====================================================
    print("\n[6/8] Training XGBoost...")

    (
        xgb_model,
        X_train_scaled,
        X_test_scaled,
        y_test,
        validation_score
    ) = train_xgboost_pipeline(
        FEATURE_DATA_PATH
    )

    print(
        "\nXGBoost validation accuracy:",
        f"{validation_score:.4f}"
    )

    # =====================================================
    # STEP 7 - TRAIN ISOLATION FOREST
    # =====================================================
    print("\n[7/8] Training Isolation Forest...")

    print(
        "IMPORTANT: Isolation Forest is being trained "
        "on X_train_scaled."
    )

    iso_model = (
        train_and_save_isolation_forest(
            X_train_scaled,
            ISO_MODEL_PATH
        )
    )

    print(
        "Isolation Forest model saved:",
        ISO_MODEL_PATH
    )

    # =====================================================
    # STEP 8 - MODEL EVALUATION
    # =====================================================
    print("\n[8/8] Evaluating models...")

    # -----------------------------------------------------
    # XGBoost predictions
    # -----------------------------------------------------
    xgb_predictions = (
        xgb_model.predict(
            X_test_scaled
        )
    )

    print("\n")
    print("=" * 70)
    print("XGBOOST EVALUATION")
    print("=" * 70)

    print(
        "\nAccuracy:",
        f"{accuracy_score(y_test, xgb_predictions):.4f}"
    )

    print(
        "\nClassification Report:"
    )

    print(
        classification_report(
            y_test,
            xgb_predictions,
            zero_division=0
        )
    )

    print(
        "Confusion Matrix:"
    )

    print(
        confusion_matrix(
            y_test,
            xgb_predictions
        )
    )

    # -----------------------------------------------------
    # Isolation Forest predictions
    # -----------------------------------------------------
    iso_raw_predictions = (
        iso_model.predict(
            X_test_scaled
        )
    )

    iso_anomaly_count = int(
        (iso_raw_predictions == -1).sum()
    )

    iso_normal_count = int(
        (iso_raw_predictions == 1).sum()
    )

    total_test_records = len(
        iso_raw_predictions
    )

    iso_anomaly_percentage = (
        iso_anomaly_count
        / total_test_records
        * 100
        if total_test_records > 0
        else 0
    )

    print("\n")
    print("=" * 70)
    print("ISOLATION FOREST EVALUATION")
    print("=" * 70)

    print(
        "\nTest records:",
        total_test_records
    )

    print(
        "Normal:",
        iso_normal_count
    )

    print(
        "Anomalies:",
        iso_anomaly_count
    )

    print(
        "Anomaly percentage:",
        f"{iso_anomaly_percentage:.2f}%"
    )

    # -----------------------------------------------------
    # Isolation Forest decision scores
    # -----------------------------------------------------
    iso_scores = (
        iso_model.decision_function(
            X_test_scaled
        )
    )

    print(
        "\nIsolation Forest decision scores:"
    )

    print(
        "Minimum:",
        f"{iso_scores.min():.4f}"
    )

    print(
        "Maximum:",
        f"{iso_scores.max():.4f}"
    )

    print(
        "Mean:",
        f"{iso_scores.mean():.4f}"
    )

    # =====================================================
    # PIPELINE COMPLETE
    # =====================================================
    print("\n")
    print("=" * 70)
    print("ML PIPELINE COMPLETED SUCCESSFULLY")
    print("=" * 70)

    print(
        "\nSaved model files:"
    )

    print(
        "XGBoost:",
        os.path.join(
            MODEL_DIR,
            "xgboost_model.pkl"
        )
    )

    print(
        "Isolation Forest:",
        ISO_MODEL_PATH
    )

    print(
        "Scaler:",
        os.path.join(
            MODEL_DIR,
            "scaler.pkl"
        )
    )

    print(
        "Feature columns:",
        os.path.join(
            MODEL_DIR,
            "feature_columns.pkl"
        )
    )

    print(
        "Label encoders:",
        ENCODER_PATH
    )

    print("\n")


# ---------------------------------------------------------
# Script entry point
# ---------------------------------------------------------
if __name__ == "__main__":
    run_pipeline()