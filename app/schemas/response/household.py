"""Define Response schemas specific to Households."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class HouseholdMemberResponse(BaseModel):
    """Response schema for a household member."""

    userId: int = Field(alias="userId")
    role: str
    joinedAt: datetime = Field(alias="joinedAt")


class HouseholdResponse(BaseModel):
    """Response schema for a household."""

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: UUID
    name: str
    created_at: datetime = Field(alias="createdAt")
    owner_id: int = Field(alias="ownerId")
    members: list[HouseholdMemberResponse] = Field(default_factory=list)
