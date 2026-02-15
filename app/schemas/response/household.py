"""Define Response schemas specific to Households."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class HouseholdMemberResponse(BaseModel):
    """Response schema for a household member."""

    user_id: int
    first_name: str
    last_name: str
    role: str
    joined_at: datetime


class HouseholdResponse(BaseModel):
    """Response schema for a household."""

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: UUID
    name: str
    created_at: datetime
    owner_id: int
    members: list[HouseholdMemberResponse] = Field(default_factory=list)
