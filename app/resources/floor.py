"""Floor routes."""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.db import get_database
from app.managers.security import get_current_user
from app.models.floor import Floor
from app.schemas.request.floor import CreateFloorRequest, UpdateFloorRequest
from app.schemas.response.floor import FloorResponse

router = APIRouter(tags=["Floors"], prefix="/floors")


@router.get(
    "",
    dependencies=[Depends(get_current_user)],
    summary="Get floors",
    description=(
        "Fetch list of all floors in the household for dropdown selection."
    ),
)
async def get_floors(
    db: Annotated[AsyncSession, Depends(get_database)],
) -> list[FloorResponse]:
    """Get all floors."""
    result = await db.execute(select(Floor).order_by(Floor.order, Floor.name))
    floors = result.scalars().all()
    return [FloorResponse.model_validate(floor) for floor in floors]


@router.post(
    "",
    dependencies=[Depends(get_current_user)],
    status_code=status.HTTP_201_CREATED,
    summary="Create floor",
    description="Create a new floor for the household.",
)
async def create_floor(
    request: CreateFloorRequest,
    db: Annotated[AsyncSession, Depends(get_database)],
) -> FloorResponse:
    """Create a new floor."""
    floor = Floor(
        name=request.name,
        order=request.order if request.order is not None else 0,
    )
    db.add(floor)
    await db.flush()
    return FloorResponse.model_validate(floor)


@router.put(
    "/{floor_id}",
    dependencies=[Depends(get_current_user)],
    summary="Update floor",
    description="Update floor details.",
)
async def update_floor(
    floor_id: UUID,
    request: UpdateFloorRequest,
    db: Annotated[AsyncSession, Depends(get_database)],
) -> FloorResponse:
    """Update an existing floor."""
    floor = await db.get(Floor, floor_id)
    if not floor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Floor not found"
        )
    if request.name is not None:
        floor.name = request.name
    if request.order is not None:
        floor.order = request.order
    await db.flush()
    return FloorResponse.model_validate(floor)


@router.delete(
    "",
    dependencies=[Depends(get_current_user)],
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete floor",
    description="Delete a floor by id.",
)
async def delete_floor(
    floor_id: UUID,
    db: Annotated[AsyncSession, Depends(get_database)],
) -> Response:
    """Delete a floor."""
    floor = await db.get(Floor, floor_id)
    if not floor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Floor not found"
        )
    await db.delete(floor)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
