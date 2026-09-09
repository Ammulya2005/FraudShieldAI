from datetime import datetime
from types import SimpleNamespace

from fastapi import HTTPException

from backend.ML.predictor import predict_transaction

from backend.app.repositories.transaction_repository import (
    create_transaction,
    get_all_transactions,
    count_transactions,
    get_transaction_by_id,
    get_high_risk_transactions,
    get_fraudulent_transactions,
    get_legitimate_transactions,
    search_transactions
)

from backend.app.services.fraud_case_service import (
    create_new_fraud_case
)

from backend.app.services.alert_service import (
    create_new_alert
)

from backend.app.repositories.fraud_case_repository import (
    search_fraud_cases
)

from backend.app.repositories.alert_repository import (
    search_alerts
)
def build_case_priority(
    risk_score: float,
    final_prediction: str
) -> str:
    if final_prediction == "fraud":
        return "high"

    if risk_score >= 0.85:
        return "high"

    if risk_score >= 0.65:
        return "medium"

    return "low"


def build_alert_severity(
    risk_score: float,
    final_prediction: str
) -> str:
    if final_prediction == "fraud":
        return "critical"

    if risk_score >= 0.85:
        return "high"

    if risk_score >= 0.65:
        return "medium"

    return "low"


def build_alert_type(
    risk_score: float,
    final_prediction: str
) -> str:
    if final_prediction == "fraud":
        return "fraud_detected"

    if risk_score >= 0.65:
        return "high_risk_transaction"

    return "transaction_monitoring"


def build_alert_message(
    transaction_id: str,
    risk_score: float,
    final_prediction: str
) -> str:
    return (
        f"Transaction {transaction_id} flagged with "
        f"prediction={final_prediction} and risk_score={risk_score}"
    )


async def create_new_transaction(transaction):
    existing = await get_transaction_by_id(
        transaction.transaction_id
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Transaction ID already exists"
        )

    transaction_dict = transaction.model_dump()

    prediction_result = predict_transaction(
        transaction_dict
    )

    final_prediction = prediction_result.get(
        "final_prediction",
        "legitimate"
    )
    risk_score = float(
        prediction_result.get("risk_score", 0.0)
    )

    transaction_doc = {
        **transaction_dict,
        **prediction_result,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    inserted_id = await create_transaction(
        transaction_doc
    )

    fraud_case_result = None
    alert_result = None

    should_create_case_or_alert = (
        final_prediction == "fraud"
        or risk_score >= 0.65
    )

    if should_create_case_or_alert:
        fraud_case_payload = SimpleNamespace(
            transaction_id=transaction.transaction_id,
            user_id=transaction.user_id,
            risk_score=risk_score,
            final_prediction=final_prediction,
            priority=build_case_priority(
                risk_score,
                final_prediction
            )
        )

        fraud_case_result = await create_new_fraud_case(
            fraud_case_payload
        )

        alert_payload = SimpleNamespace(
            transaction_id=transaction.transaction_id,
            user_id=transaction.user_id,
            risk_score=risk_score,
            alert_type=build_alert_type(
                risk_score,
                final_prediction
            ),
            severity=build_alert_severity(
                risk_score,
                final_prediction
            ),
            message=build_alert_message(
                transaction.transaction_id,
                risk_score,
                final_prediction
            )
        )

        alert_result = await create_new_alert(
            alert_payload
        )

    return {
        "message": "Transaction created successfully",
        "transaction_db_id": inserted_id,
        "transaction_id": transaction.transaction_id,
        "prediction": prediction_result,
        "fraud_case": fraud_case_result,
        "alert": alert_result
    }


async def fetch_all_transactions(page: int = 1, page_size: int = 50):
    transactions = await get_all_transactions(page, page_size)
    total = await count_transactions()
    return {"items": transactions, "page": page, "page_size": page_size, "total": total, "pages": (total + page_size - 1) // page_size}


async def fetch_transaction_by_id(
    transaction_id: str
):
    transaction = await get_transaction_by_id(
        transaction_id
    )

    if not transaction:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    return transaction


async def fetch_high_risk_transactions():
    return await get_high_risk_transactions()


async def fetch_fraudulent_transactions():
    return await get_fraudulent_transactions()


async def fetch_legitimate_transactions():
    return await get_legitimate_transactions()
async def fetch_global_search(
    search_term: str,
    limit: int = 20
):
    """
    Search transactions, fraud cases, and alerts.
    """

    search_term = search_term.strip()

    if not search_term:
        return {
            "query": search_term,
            "transactions": [],
            "fraud_cases": [],
            "alerts": [],
            "total": 0
        }

    transactions = await search_transactions(
        search_term,
        limit
    )

    fraud_cases = await search_fraud_cases(
        search_term,
        limit
    )

    alerts = await search_alerts(
        search_term,
        limit
    )

    return {
        "query": search_term,
        "transactions": transactions,
        "fraud_cases": fraud_cases,
        "alerts": alerts,
        "total": (
            len(transactions)
            + len(fraud_cases)
            + len(alerts)
        )
    }