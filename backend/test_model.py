import joblib
from pathlib import Path

MODEL_PATH = Path(__file__).resolve().parent / "ML" / "saved_models" / "isolation_forest_model.pkl"

iso = joblib.load(MODEL_PATH)


def test_isolation_forest_model_loads():
	assert iso is not None