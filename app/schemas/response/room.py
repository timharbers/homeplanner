"""Define Response schemas specific to Rooms."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class RoomResponse(BaseModel):
    """Response schema for a room."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    color: str | None = None
    floor: str | None = None


class RoomStatsResponse(BaseModel):
    """Response schema for room statistics."""

    totalTasks: int = 0
    completed: int = 0
    inProgress: int = 0
    blocked: int = 0


class RoomDetailsResponse(RoomResponse):
    """Response schema for room details."""

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    createdAt: datetime | None = Field(default=None, alias="created_at")
    stats: RoomStatsResponse = Field(default_factory=RoomStatsResponse)
