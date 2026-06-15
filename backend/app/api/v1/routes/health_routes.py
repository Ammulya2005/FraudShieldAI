from fastapi import APIRouter

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("/")
async def health():
    return {"status": "healthy", "service": "FraudShield AI"}


@router.get("/db")
async def db_health():
    return {"database": "connected"}


@router.get("/kafka")
async def kafka_health():
    return {"kafka": "running"}


@router.get("/model")
async def model_health():
    return {"model": "loaded"}