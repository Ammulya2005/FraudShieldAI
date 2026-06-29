from backend.app.repositories.permission_repository import (
    create_permission,
    get_all_permissions,
    get_permission_by_id,
    update_permission,
    delete_permission
)


async def create_new_permission(permission_data):
    payload = permission_data.model_dump() if hasattr(permission_data, "model_dump") else dict(permission_data)
    inserted_id = await create_permission(payload)

    return {
        "message": "Permission created successfully",
        "permission_db_id": inserted_id
    }


async def fetch_permissions():
    return await get_all_permissions()


async def fetch_permission(permission_id: str):
    return await get_permission_by_id(permission_id)


async def update_existing_permission(permission_id: str, permission_update):
    update_payload = permission_update.model_dump(exclude_none=True)
    modified_count = await update_permission(permission_id, update_payload)

    return {
        "message": "Permission updated successfully",
        "modified_count": modified_count
    }


async def delete_permission(permission_id: str):
    deleted_count = await delete_permission(permission_id)
    return {
        "message": "Permission deleted successfully",
        "deleted_count": deleted_count
    }