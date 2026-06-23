from backend.app.repositories.role_repository import (
    create_role,
    get_all_roles
)


async def create_new_role(role):

    role_data = {
        "name": role.name,
        "description": role.description
    }

    role_id = await create_role(role_data)

    return {
        "message": "Role created",
        "role_id": role_id
    }


async def fetch_roles():

    return await get_all_roles()