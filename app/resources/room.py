"""Room routes."""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.db import get_database
from app.database.quota import check_room_quota, get_user_household_id
from app.managers.security import get_current_user
from app.models.room import Room
from app.models.task import Task, TaskStatus, task_rooms
from app.models.user import User
from app.schemas.request.room import CreateRoomRequest, UpdateRoomRequest
from app.schemas.response.room import (
    RoomDetailsResponse,
    RoomResponse,
    RoomStatsResponse,
)

router = APIRouter(tags=["Rooms"], prefix="/rooms")


@router.get(
    "",
    response_model=list[RoomResponse],
    summary="Get household rooms",
    description=(
        "Fetch list of rooms in the household for task filtering, "
        "including color coding."
    ),
)
async def get_rooms(
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_database)],
) -> list[RoomResponse]:
    """Get all rooms for the user's household."""
    household_id = await get_user_household_id(db, user.id)
    result = await db.execute(
        select(Room).where(Room.household_id == household_id).order_by(Room.name)
    )
    rooms = result.scalars().all()
    return [RoomResponse.model_validate(room) for room in rooms]


@router.post(
    "",
    response_model=RoomResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create new room",
    description="Quick create a new room from within the task form.",
)
async def create_room(
    room_data: CreateRoomRequest,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_database)],
) -> RoomResponse:
    """Create a new room."""
    household_id = await get_user_household_id(db, user.id)
    await check_room_quota(db, household_id)

    room = Room(
        household_id=household_id,
        name=room_data.name,
        color=room_data.color,
        floor=room_data.floor,
    )
    db.add(room)
    await db.flush()
    return RoomResponse.model_validate(room)


@router.get(
    "/{room_id}",
    response_model=RoomDetailsResponse,
    summary="Get single room details",
    description=(
        "Fetch detailed information for a specific room including "
        "metadata and aggregated task statistics."
    ),
)
async def get_room(
    room_id: UUID,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_database)],
) -> RoomDetailsResponse:
    """Get a single room."""
    household_id = await get_user_household_id(db, user.id)
    result = await db.execute(
        select(Room).where(Room.id == room_id, Room.household_id == household_id)
    )
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Room not found"
        )
    response = RoomDetailsResponse.model_validate(room)
    response.stats = RoomStatsResponse()
    return response


@router.put(
    "/{room_id}",
    response_model=RoomResponse,
    summary="Update room",
    description="Update room details including name, color, and floor.",
)
async def update_room(
    room_id: UUID,
    room_data: UpdateRoomRequest,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_database)],
) -> RoomResponse:
    """Update a room."""
    household_id = await get_user_household_id(db, user.id)
    result = await db.execute(
        select(Room).where(Room.id == room_id, Room.household_id == household_id)
    )
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Room not found"
        )
    if room_data.name is not None:
        room.name = room_data.name
    if room_data.color is not None:
        room.color = room_data.color
    if room_data.floor is not None:
        room.floor = room_data.floor
    await db.flush()
    return RoomResponse.model_validate(room)


@router.delete(
    "/{room_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete room",
    description=(
        "Delete a room. Only allowed if no tasks are assigned, "
        "or tasks must be reassigned before deletion."
    ),
)
async def delete_room(
    room_id: UUID,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_database)],
) -> Response:
    """Delete a room."""
    household_id = await get_user_household_id(db, user.id)
    result = await db.execute(
        select(Room).where(Room.id == room_id, Room.household_id == household_id)
    )
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Room not found"
        )
    assigned_count = (
        await db.execute(
            select(func.count()).select_from(task_rooms).where(
                task_rooms.c.room_id == room_id
            )
        )
    ).scalar_one()
    if assigned_count > 0:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Room has assigned tasks",
        )
    await db.delete(room)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/{room_id}/stats",
    response_model=RoomStatsResponse,
    summary="Get room statistics",
    description="Fetch aggregated task statistics for a specific room.",
)
async def get_room_stats(
    room_id: UUID,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_database)],
) -> RoomStatsResponse:
    """Get room statistics."""
    household_id = await get_user_household_id(db, user.id)
    result = await db.execute(
        select(Room).where(Room.id == room_id, Room.household_id == household_id)
    )
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Room not found"
        )
    base_query = (
        select(Task)
        .join(task_rooms, task_rooms.c.task_id == Task.id)
        .where(task_rooms.c.room_id == room_id)
    )
    total = (
        await db.execute(select(func.count()).select_from(base_query.subquery()))
    ).scalar_one()
    completed = (
        await db.execute(
            select(func.count()).select_from(
                base_query.where(Task.status == TaskStatus.done).subquery()
            )
        )
    ).scalar_one()
    in_progress = (
        await db.execute(
            select(func.count()).select_from(
                base_query.where(Task.status == TaskStatus.in_progress).subquery()
            )
        )
    ).scalar_one()
    blocked = (
        await db.execute(
            select(func.count()).select_from(
                base_query.where(Task.status == TaskStatus.blocked).subquery()
            )
        )
    ).scalar_one()
    return RoomStatsResponse(
        total_tasks=total,
        completed=completed,
        in_progress=in_progress,
        blocked=blocked,
    )
