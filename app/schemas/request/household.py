"""Define Request schemas specific to Households."""

from pydantic import BaseModel, ConfigDict, Field


class UpdateHouseholdRequest(BaseModel):
    """Request schema for updating a household."""

    model_config = ConfigDict(from_attributes=True)

    name: str = Field(min_length=1)
