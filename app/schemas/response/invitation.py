"""Define Response schemas specific to Invitations."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.invitation import InvitationStatus


class InvitationResponse(BaseModel):
    """Response schema for an invitation."""

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: UUID
    email: EmailStr
    household_id: UUID
    invited_by_user_id: UUID
    status: InvitationStatus
    created_at: datetime
    expires_at: datetime
