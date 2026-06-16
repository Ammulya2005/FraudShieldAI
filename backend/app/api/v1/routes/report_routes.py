from fastapi import APIRouter

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.get("/fraud-summary")
async def fraud_summary_report():
    return {"message": "Fraud summary report endpoint ready"}


@router.get("/transaction-summary")
async def transaction_summary_report():
    return {"message": "Transaction summary report endpoint ready"}


@router.get("/high-risk-users")
async def high_risk_users_report():
    return {"message": "High-risk users report endpoint ready"}


@router.get("/daily")
async def daily_report():
    return {"message": "Daily report endpoint ready"}


@router.get("/monthly")
async def monthly_report():
    return {"message": "Monthly report endpoint ready"}


@router.get("/export/csv")
async def export_csv_report():
    return {"message": "CSV export endpoint ready"}


@router.get("/export/pdf")
async def export_pdf_report():
    return {"message": "PDF export endpoint ready"}