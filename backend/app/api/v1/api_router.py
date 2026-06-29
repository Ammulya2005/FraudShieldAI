from fastapi import APIRouter

from backend.app.api.v1.routes import (
    auth_routes,
    user_routes,
    transaction_routes,
    fraud_routes,
    fraud_case_routes,
    alert_routes,
    dashboard_routes,
    analytics_routes,
    report_routes,
    model_routes,
    admin_routes,
    audit_log_routes,
    health_routes,
    notification_routes,
    permission_routes,
    role_routes,
    settings_routes,
    stream_routes,
    user_role_routes,
    case_review_routes,
    bootstrap_routes,
)

api_router = APIRouter()

api_router.include_router(auth_routes.router)
api_router.include_router(user_routes.router)
api_router.include_router(transaction_routes.router)
api_router.include_router(fraud_routes.router)
api_router.include_router(fraud_case_routes.router)
api_router.include_router(alert_routes.router)
api_router.include_router(dashboard_routes.router)
api_router.include_router(analytics_routes.router)
api_router.include_router(report_routes.router)
api_router.include_router(model_routes.router)
api_router.include_router(admin_routes.router)
api_router.include_router(audit_log_routes.router)
api_router.include_router(health_routes.router)
api_router.include_router(notification_routes.router)
api_router.include_router(permission_routes.router)
api_router.include_router(role_routes.router)
api_router.include_router(settings_routes.router)
api_router.include_router(stream_routes.router)
api_router.include_router(user_role_routes.router)
api_router.include_router(case_review_routes.router)
api_router.include_router(bootstrap_routes.router)