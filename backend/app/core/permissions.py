VIEW_DASHBOARD = "view_dashboard"

VIEW_TRANSACTIONS = "view_transactions"

VIEW_FRAUD_PREDICTIONS = "view_fraud_predictions"

VIEW_ALERTS = "view_alerts"

REVIEW_TRANSACTIONS = "review_transactions"

MARK_FRAUD = "mark_fraud"

MARK_LEGITIMATE = "mark_legitimate"

ASSIGN_ALERTS = "assign_alerts"

RESOLVE_ALERTS = "resolve_alerts"

GENERATE_REPORTS = "generate_reports"

VIEW_ANALYTICS = "view_analytics"

MANAGE_USERS = "manage_users"

ASSIGN_ROLES = "assign_roles"

VIEW_AUDIT_LOGS = "view_audit_logs"

MANAGE_MODELS = "manage_models"

MANAGE_SYSTEM_SETTINGS = "manage_system_settings"

OVERRIDE_FRAUD_DECISIONS = "override_fraud_decisions"

ADMIN_ALL = "admin_all"

ROLE_PERMISSIONS = {
    "analyst": [
        VIEW_DASHBOARD,
        VIEW_TRANSACTIONS,
        VIEW_FRAUD_PREDICTIONS,
        VIEW_ALERTS,
        REVIEW_TRANSACTIONS
    ],

    "fraud_manager": [
        VIEW_DASHBOARD,
        VIEW_TRANSACTIONS,
        VIEW_FRAUD_PREDICTIONS,
        VIEW_ALERTS,
        REVIEW_TRANSACTIONS,
        MARK_FRAUD,
        MARK_LEGITIMATE,
        ASSIGN_ALERTS,
        RESOLVE_ALERTS,
        GENERATE_REPORTS,
        VIEW_ANALYTICS
    ],

    "admin": [
        MANAGE_USERS,
        ASSIGN_ROLES,
        VIEW_AUDIT_LOGS,
        GENERATE_REPORTS,
        VIEW_ANALYTICS
    ],

    "super_admin": [
        ADMIN_ALL
    ]
}