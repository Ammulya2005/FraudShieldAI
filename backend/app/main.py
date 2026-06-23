
from fastapi import FastAPI

from backend.app.api.v1.routes.auth_routes import (
    router as auth_router
)
from backend.app.api.v1.routes.role_routes import (
    router as role_router
)

from backend.app.api.v1.routes.user_role_routes import (
    router as user_role_router
)

from backend.app.api.v1.routes.bootstrap_routes import (
    router as bootstrap_router
)

from backend.app.api.v1.routes.user_routes import (
    router as user_router
)

from backend.app.api.v1.routes.transaction_routes import (
    router as transaction_router
)

from backend.app.api.v1.routes.fraud_case_routes import (
    router as fraud_case_router
)
from backend.app.api.v1.routes.alert_routes import (
    router as alert_router
)

from backend.app.api.v1.routes.dashboard_routes import (
    router as dashboard_router
)

from backend.app.api.v1.routes.case_review_routes import (
    router as case_review_router
)

app = FastAPI(
    title="FraudShieldAI"
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(bootstrap_router)
app.include_router(role_router)
app.include_router(user_role_router)
app.include_router(transaction_router)
app.include_router(fraud_case_router)
app.include_router(alert_router)
app.include_router(dashboard_router)
app.include_router(case_review_router)

@app.get("/")
async def root():
    return {
        "message": "FraudShieldAI Running"
    }