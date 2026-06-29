import joblib

iso = joblib.load(
    "ML/saved_models/isolation_forest_model.pkl"
)

print(type(iso))