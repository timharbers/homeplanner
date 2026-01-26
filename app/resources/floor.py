"""Floor routes."""

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.db import get_database
from app.managers.security import get_current_user
from app.models.floor import Floor
from app.schemas.response.floor import FloorResponse

router = APIRouter(tags=["Floors"], prefix="/floors")


@router.get(
    "",
    dependencies=[Depends(get_current_user)],
    response_model=list[FloorResponse],
    summary="Get floors",
    description="Fetch list of all floors in the household for dropdown selection.",
)
async def get_floors(
    db: Annotated[AsyncSession, Depends(get_database)],
) -> list[FloorResponse]:
    """Get all floors."""
    result = await db.execute(select(Floor).order_by(Floor.order, Floor.name))
    floors = result.scalars().all()
    return [FloorResponse.model_validate(floor) for floor in floors]
