from backend.app.repositories.transaction_repository import get_all_transactions


async def fetch_stream_status():
    return {
        "status": "active",
        "source": "transaction_stream"
    }


async def fetch_recent_stream_data():
    transactions = await get_all_transactions()
    return {
        "stream_records": transactions[-20:]
    }