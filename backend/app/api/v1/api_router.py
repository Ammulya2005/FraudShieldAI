from fastapi import APIRouter

from backend.app.api.v1.routes import (
    auth_routes,
    user_routes,
    transaction_routes,
    fraud_detection_routes,
    alert_routes,
    dashboard_routes,
    analytics_routes,
    report_routes,
    kafka_routes,
    model_routes,
    admin_routes,
    audit_log_routes,
    health_routes,
)

api_router = APIRouter()

api_router.include_router(auth_routes.router)
api_router.include_router(user_routes.router)
api_router.include_router(transaction_routes.router)
api_router.include_router(fraud_detection_routes.router)
api_router.include_router(alert_routes.router)
api_router.include_router(dashboard_routes.router)
api_router.include_router(analytics_routes.router)
api_router.include_router(report_routes.router)
api_router.include_router(kafka_routes.router)
api_router.include_router(model_routes.router)
api_router.include_router(admin_routes.router)
api_router.include_router(audit_log_routes.router)
api_router.include_router(health_routes.router)