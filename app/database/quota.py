"""Resource quota checking utilities."""

import uuid

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.settings import get_settings
from app.models.floor import Floor
from app.models.household import household_members
from app.models.room import Room
from app.models.task import Task


class QuotaExceeded(HTTPException):
    """Exception raised when a resource quota is exceeded."""

    def __init__(self, resource: str, limit: int) -> None:
        """Initialize the exception."""
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Quota exceeded: maximum {limit} {resource} per household",
        )


async def get_user_household_id(db: AsyncSession, user_id: int) -> uuid.UUID:
    """Get the household_id for a user.

    Raises HTTPException 403 if user is not a member of any household.
    """
    result = await db.execute(
        select(household_members.c.household_id).where(
            household_members.c.user_id == user_id
        )
    )
    household_id = result.scalar_one_or_none()

    if household_id is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not a member of any household",
        )

    return household_id


async def check_floor_quota(db: AsyncSession, household_id: uuid.UUID) -> None:
    """Check if household has reached the floor quota."""
    settings = get_settings()
    if settings.max_floors_per_household == 0:
        return

    result = await db.execute(
        select(func.count(Floor.id)).where(Floor.household_id == household_id)
    )
    count = result.scalar() or 0

    if count >= settings.max_floors_per_household:
        raise QuotaExceeded("floors", settings.max_floors_per_household)


async def check_room_quota(db: AsyncSession, household_id: uuid.UUID) -> None:
    """Check if household has reached the room quota."""
    settings = get_settings()
    if settings.max_rooms_per_household == 0:
        return

    result = await db.execute(
        select(func.count(Room.id)).where(Room.household_id == household_id)
    )
    count = result.scalar() or 0

    if count >= settings.max_rooms_per_household:
        raise QuotaExceeded("rooms", settings.max_rooms_per_household)


async def check_task_quota(db: AsyncSession, household_id: uuid.UUID) -> None:
    """Check if household has reached the task quota."""
    settings = get_settings()
    if settings.max_tasks_per_household == 0:
        return

    result = await db.execute(
        select(func.count(Task.id)).where(Task.household_id == household_id)
    )
    count = result.scalar() or 0

    if count >= settings.max_tasks_per_household:
        raise QuotaExceeded("tasks", settings.max_tasks_per_household)
