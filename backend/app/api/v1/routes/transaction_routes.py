# This file defines the API routes for managing transactions in the application. It includes endpoints for creating new transactions, fetching all transactions, and fetching transactions based on their risk level (high-risk, fraudulent, legitimate). Access to these endpoints is restricted based on user roles, ensuring that only authorized users can perform specific actions.
from fastapi import (
    APIRouter,
    Depends
)

from backend.app.schemas.transaction_schema import (
    TransactionCreate
)

from backend.app.services.transaction_service import (
    create_new_transaction,
    fetch_all_transactions,
    fetch_transaction_by_id,
    fetch_high_risk_transactions,
    fetch_fraudulent_transactions,
    fetch_legitimate_transactions
)

from backend.app.core.rbac import (
    require_roles
)

router = APIRouter(
    prefix="/api/v1/transactions",
    tags=["Transactions"]
)

# Endpoint to create a new transaction. Only users with the "analyst", "fraud_manager", "admin", or "super_admin" roles can access this endpoint.
@router.post("")
async def create_transaction_route(
    transaction: TransactionCreate,
    current_user=Depends(
        require_roles(
            [
                "analyst",
                "fraud_manager",
                "admin",
                "super_admin"
            ]
        )
    )
):
    return await create_new_transaction(
        transaction
    )

# Endpoint to fetch all transactions. Only users with the "analyst", "fraud_manager", "admin", or "super_admin" roles can access this endpoint.
@router.get("")
async def get_transactions_route(
    current_user=Depends(
        require_roles(
            [
                "analyst",
                "fraud_manager",
                "admin",
                "super_admin"
            ]
        )
    )
):
    return await fetch_all_transactions()

# Endpoint to fetch a transaction by its ID. Only users with the "analyst", "fraud_manager", "admin", or "super_admin" roles can access this endpoint.
@router.get("/high-risk")
async def get_high_risk_route(
    current_user=Depends(
        require_roles(
            [
                "analyst",
                "fraud_manager",
                "admin",
                "super_admin"
            ]
        )
    )
):
    return await fetch_high_risk_transactions()

# Endpoint to fetch fraudulent transactions. Only users with the "analyst", "fraud_manager", "admin", or "super_admin" roles can access this endpoint.
@router.get("/fraudulent")
async def get_fraudulent_route(
    current_user=Depends(
        require_roles(
            [
                "analyst",
                "fraud_manager",
                "admin",
                "super_admin"
            ]
        )
    )
):
    return await fetch_fraudulent_transactions()

# Endpoint to fetch legitimate transactions. Only users with the "analyst", "fraud_manager", "admin", or "super_admin" roles can access this endpoint.
@router.get("/legitimate")
async def get_legitimate_route(
    current_user=Depends(
        require_roles(
            [
                "analyst",
                "fraud_manager",
                "admin",
                "super_admin"
            ]
        )
    )
):
    return await fetch_legitimate_transactions()

# Endpoint to fetch a transaction by its ID. Only users with the "analyst", "fraud_manager", "admin", or "super_admin" roles can access this endpoint.S
@router.get("/{transaction_id}")
async def get_transaction_by_id_route(
    transaction_id: str,
    current_user=Depends(
        require_roles(
            [
                "analyst",
                "fraud_manager",
                "admin",
                "super_admin"
            ]
        )
    )
):
    return await fetch_transaction_by_id(
        transaction_id
    )