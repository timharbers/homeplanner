"""Define Request schemas specific to Invitations."""

from pydantic import BaseModel, ConfigDict, EmailStr


class CreateInvitationRequest(BaseModel):
    """Request schema for creating an invitation."""

    model_config = ConfigDict(from_attributes=True)

    email: EmailStr
