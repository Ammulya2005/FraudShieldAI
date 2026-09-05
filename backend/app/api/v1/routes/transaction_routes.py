# This file defines API routes for transaction management
# with role-based authorization.

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
    prefix="/transactions",
    tags=["Transactions"]
)

# Create Transaction
# User, Admin and Superadmin only
@router.post("")
async def create_transaction_route(
    transaction: TransactionCreate,
    current_user=Depends(
        require_roles(
            [
                "user",
                "admin",
                "super_admin"
            ]
        )
    )
):

    return await create_new_transaction(
        transaction
    )


# View All Transactions
# Analyst, Fraud Manager, Admin, Superadmin
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


# High Risk Transactions
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


# Fraudulent Transactions
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


# Legitimate Transactions
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


# Transaction By ID
@router.get("/transaction_id")
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