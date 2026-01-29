"""Security dependencies for the API."""

from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.requests import Request

from app.managers.auth import oauth2_schema
from app.models.user import User


async def get_current_user(
    _request: Request,
    jwt_user: User | None = Depends(oauth2_schema),
) -> User:
    """Get the current user from JWT token."""
    if jwt_user:
        return jwt_user

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated. Use a JWT token.",
        headers={"WWW-Authenticate": "Bearer"},
    )


# Make the dependency optional for routes that allow unauthenticated access
async def get_optional_user(
    current_user: Annotated[User | None, Depends(get_current_user)],
) -> User | None:
    """Get the current user if authenticated, otherwise return None."""
    return current_user
