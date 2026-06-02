from xgboost import XGBClassifier
def build_xgboost_model() -> XGBClassifier:
    """
    Create XGBoost classification model for fraud detection.
    """
    model = XGBClassifier(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        eval_metric="logloss",
        random_state=42
    )
    return model
def train_xgboost_model(X_train, y_train):
    """
    Train XGBoost fraud detection model.
    """
    model = build_xgboost_model()
    model.fit(X_train, y_train)
    return model
def predict_xgboost_model(model, X_test):
    """
    Predict fraud labels using trained XGBoost model.
    """
    predictions = model.predict(X_test)
    return predictions
def predict_xgboost_probability(model, X_test):
    """
    Predict fraud probability using trained XGBoost model.
    """
    probabilities = model.predict_proba(X_test)[:, 1]
    return probabilities