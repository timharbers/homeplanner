"""Define Response schemas specific to Floors."""

from uuid import UUID

from pydantic import BaseModel, ConfigDict


class FloorResponse(BaseModel):
    """Response schema for a floor."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    order: int | None = None
