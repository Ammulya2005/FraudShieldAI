import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.v1.api_router import api_router
from backend.database.mongodb import client as mongo_client, get_database
from backend.app.core.logger import logger
from backend.app.core.config import APP_NAME


app = FastAPI(title=APP_NAME or "FraudShieldAI", version="0.1.0")

# Simple CORS - adjust origins in environment if needed
origins = os.getenv("CORS_ORIGINS", "*")
if origins == "*":
    allow_origins = ["*"]
else:
    allow_origins = [o.strip() for o in origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    # Ensure DB client is available on app state for other parts of the app
    try:
        app.state.mongo_client = mongo_client
        app.state.db = get_database()
        logger.info("Connected to MongoDB")
    except Exception as e:
        logger.exception("Error connecting to MongoDB: %s", e)


@app.on_event("shutdown")
async def shutdown_event():
    try:
        if hasattr(app.state, "mongo_client") and app.state.mongo_client:
            app.state.mongo_client.close()
            logger.info("Closed MongoDB connection")
    except Exception:
        logger.exception("Error closing MongoDB connection")


app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"message": f"{APP_NAME or 'FraudShieldAI'} Running"}