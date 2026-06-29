from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/health", tags=["Health"])

@router.get("")
def health_check():
    return {"status": "healthy"}

@router.get("/readiness")
def readiness_check():
    return {"status": "ready"}

@router.get("/liveness")
def liveness_check():
    return {"status": "alive"}
