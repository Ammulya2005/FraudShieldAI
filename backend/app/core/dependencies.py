# Dependencies for FastAPI routes, including user authentication and authorization.
from fastapi import Depends, HTTPException, status
from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials
)

from backend.app.core.jwt_handler import (
    verify_access_token
)

from backend.app.repositories.user_repository import (
    get_user_by_id
)

security = HTTPBearer()

# Dependency to get the current authenticated user based on the access token provided in the request.
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    payload = verify_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

    user_id = payload.get("sub")

    user = await get_user_by_id(user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return user