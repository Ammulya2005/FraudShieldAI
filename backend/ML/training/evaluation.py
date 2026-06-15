from sklearn.model_selection import cross_val_score
def calculate_validation_score(
    model,
    X_train,
    y_train
):
    """
    Calculate Cross Validation Score
    """
    scores = cross_val_score(
        model,
        X_train,
        y_train,
        cv=5,
        scoring="accuracy"
    )
    return scores.mean()