import time
from fastapi import APIRouter, status, HTTPException
from backend.database.mongodb import db

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("", status_code=status.HTTP_200_OK)
async def detailed_health_check():
    """Performs an operational check against downstream infrastructure dependencies."""
    health_status = "healthy"
    dependencies = {}

    # 1. MongoDB Check
    try:
        start_time = time.time()
        # Execute a lightweight administrative ping statement
        await db.command("ping")
        latency_ms = (time.time() - start_time) * 1000
        dependencies["mongodb"] = {"status": "connected", "latency_ms": round(latency_ms, 2)}
    except Exception as e:
        health_status = "unhealthy"
        dependencies["mongodb"] = {"status": "disconnected", "error": str(e)}

    # 2. Add Kafka / ML checks here as needed
    # (e.g., verifying client.brokers or checking if the .pkl model file is initialized in memory)

    if health_status == "unhealthy":
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={"status": "unhealthy", "dependencies": dependencies}
        )

    return {"status": "healthy", "timestamp": time.time(), "dependencies": dependencies}


@router.get("/liveness", status_code=status.HTTP_200_OK)
def liveness_check():
    """Basic runtime status check for orchestrators (e.g. Kubernetes, Docker)."""
    return {"status": "alive"}


@router.get("/readiness", status_code=status.HTTP_200_OK)
async def readiness_check():
    """Verifies that database connection pools are initialized and accepting traffic."""
    try:
        await db.command("ping")
        return {"status": "ready"}
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service unready: Downstream database connection dropped."
        )