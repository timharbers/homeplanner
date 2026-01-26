"""Define Request schemas specific to Rooms."""

from pydantic import BaseModel, ConfigDict, Field


class CreateRoomRequest(BaseModel):
    """Request schema for creating a room."""

    model_config = ConfigDict(from_attributes=True)

    name: str = Field(min_length=1)
    color: str | None = None
    floor: str | None = None


class UpdateRoomRequest(BaseModel):
    """Request schema for updating a room."""

    model_config = ConfigDict(from_attributes=True)

    name: str | None = None
    color: str | None = None
    floor: str | None = None
