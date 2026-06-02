from sklearn.ensemble import IsolationForest
def create_isolation_forest_model() -> IsolationForest:
    """
    Create Isolation Forest model for anomaly detection.
    """
    model = IsolationForest(
        n_estimators=100,
        contamination=0.05,
        random_state=42,
        n_jobs=-1
    )
    return model
def train_isolation_forest_model(X_train) -> IsolationForest:
    """
    Train Isolation Forest model using feature data only.
    """
    model = create_isolation_forest_model()
    model.fit(X_train)
    return model
def predict_isolation_forest(model, X_test):
    """
    Predict anomalies using Isolation Forest.
    Output conversion:
    IsolationForest gives:
    1  = normal transaction
    -1 = anomaly/fraud transaction
    We convert:
    0 = normal
    1 = fraud/anomaly
    """
    raw_predictions = model.predict(X_test)
    predictions = [
        1 if value == -1 else 0
        for value in raw_predictions
    ]
    return predictions
def anomaly_score_isolation_forest(model, X_test):
    """
    Generate anomaly scores using Isolation Forest.
    Lower score means more abnormal transaction.
    """
    scores = model.decision_function(X_test)
    return scores