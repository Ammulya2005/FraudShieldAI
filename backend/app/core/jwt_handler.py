from datetime import datetime, timedelta
from jose import jwt, JWTError

from backend.app.core.config import (
    JWT_SECRET_KEY,
    JWT_REFRESH_SECRET_KEY,
    JWT_ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_DAYS
)


def create_access_token(data: dict):

    payload = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload.update(
        {
            "exp": expire,
            "type": "access"
        }
    )

    return jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM
    )


def create_refresh_token(data: dict):

    payload = data.copy()

    expire = datetime.utcnow() + timedelta(
        days=REFRESH_TOKEN_EXPIRE_DAYS
    )

    payload.update(
        {
            "exp": expire,
            "type": "refresh"
        }
    )

    return jwt.encode(
        payload,
        JWT_REFRESH_SECRET_KEY,
        algorithm=JWT_ALGORITHM
    )


def verify_access_token(token: str):

    try:

        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM]
        )

        if payload.get("type") != "access":
            return None

        return payload

    except JWTError:
        return None


def verify_refresh_token(token: str):

    try:

        payload = jwt.decode(
            token,
            JWT_REFRESH_SECRET_KEY,
            algorithms=[JWT_ALGORITHM]
        )

        if payload.get("type") != "refresh":
            return None

        return payload

    except JWTError:
        return None
def get_user_id_from_token(token: str):

    payload = verify_access_token(token)

    if not payload:
        return None

    return payload.get("sub")