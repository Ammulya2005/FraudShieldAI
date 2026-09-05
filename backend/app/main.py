import os
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.app.api.v1.api_router import api_router
from backend.database.mongodb import (
    client as mongo_client,
    get_database
)

from backend.app.core.logger import logger
from backend.app.core.config import APP_NAME


# Lifespan handler (replaces startup/shutdown events)
@asynccontextmanager
async def lifespan(app: FastAPI):

    # Startup
    try:
        app.state.mongo_client = mongo_client
        app.state.db = get_database()

        logger.info(
            "Connected to MongoDB"
        )

    except Exception as e:

        logger.exception(
            "Error connecting to MongoDB: %s",
            e
        )

    yield

    # Shutdown
    try:

        if (
            hasattr(
                app.state,
                "mongo_client"
            )
            and app.state.mongo_client
        ):

            app.state.mongo_client.close()

            logger.info(
                "Closed MongoDB connection"
            )

    except Exception:

        logger.exception(
            "Error closing MongoDB connection"
        )

BASE_DIR = Path(__file__).resolve().parents[2]
FRONTEND_DIR = BASE_DIR / "frontend"


app = FastAPI(
    title=APP_NAME or "FraudShieldAI",
    version="0.1.0",
    lifespan=lifespan,
    swagger_ui_parameters={
        "persistAuthorization": True
    }
)


# CORS
origins = os.getenv(
    "CORS_ORIGINS",
    "*"
)

if origins == "*":

    allow_origins = ["*"]

else:

    allow_origins = [
        o.strip()
        for o in origins.split(",")
        if o.strip()
    ]


app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


app.include_router(
    api_router,
    prefix="/api/v1"
)


app.mount(
    "/",
    StaticFiles(
        directory=str(FRONTEND_DIR),
        html=True
    ),
    name="frontend"
)