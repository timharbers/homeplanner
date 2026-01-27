"""Define Request schemas specific to Floors."""

from pydantic import BaseModel, ConfigDict, Field


class CreateFloorRequest(BaseModel):
    """Request schema for creating a floor."""

    model_config = ConfigDict(from_attributes=True)

    name: str = Field(min_length=1)
    order: int | None = Field(default=None, ge=0)


class UpdateFloorRequest(BaseModel):
    """Request schema for updating a floor."""

    model_config = ConfigDict(from_attributes=True)

    name: str | None = Field(default=None, min_length=1)
    order: int | None = Field(default=None, ge=0)
