def calculate_risk_score(fraud_probability: float) -> int:
    """
    Convert fraud probability into business-friendly risk score.
    Risk score range: 0 to 100.
    """
    risk_score = int(fraud_probability * 100)
    if risk_score < 0:
        risk_score = 0
    if risk_score > 100:
        risk_score = 100
    return risk_score
def assign_risk_level(risk_score: int) -> str:
    """
    Assign risk category based on risk score.
    """
    if risk_score >= 75:
        return "High Risk"
    elif risk_score >= 40:
        return "Medium Risk"
    else:
        return "Low Risk"