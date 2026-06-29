from backend.app.repositories.settings_repository import (
    get_settings_by_key,
    get_all_settings,
    update_settings
)


async def fetch_settings(key: str):
    return await get_settings_by_key(key)


async def fetch_all_settings():
    return await get_all_settings()


async def update_system_settings(key: str, settings_data):
    result = await update_settings(key, settings_data)
    return {
        "message": "Settings updated successfully",
        "result": result
    }