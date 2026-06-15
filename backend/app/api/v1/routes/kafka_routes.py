from fastapi import APIRouter

router = APIRouter(prefix="/stream", tags=["Kafka Streaming"])


@router.post("/start-producer")
async def start_producer():
    return {"message": "Producer start endpoint ready"}


@router.post("/stop-producer")
async def stop_producer():
    return {"message": "Producer stop endpoint ready"}


@router.post("/start-consumer")
async def start_consumer():
    return {"message": "Consumer start endpoint ready"}


@router.post("/stop-consumer")
async def stop_consumer():
    return {"message": "Consumer stop endpoint ready"}


@router.get("/status")
async def stream_status():
    return {"kafka_status": "running"}


@router.post("/publish-transaction")
async def publish_transaction():
    return {"message": "Publish transaction endpoint ready"}