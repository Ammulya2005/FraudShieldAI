# Risk scoring logic to convert fraud probability into business risk levels.
def calculate_risk_level(fraud_probability: float) -> str:
    """
    Convert fraud probability into business risk level.
    """
    if fraud_probability >= 0.80:
        return "High Risk"
    elif fraud_probability >= 0.50:
        return "Medium Risk"
    else:
        return "Low Risk"