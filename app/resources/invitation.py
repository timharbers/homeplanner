"""Invitation routes."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.db import get_database
from app.managers.security import get_current_user
from app.models.household import household_members
from app.models.invitation import Invitation, InvitationStatus
from app.models.user import User
from app.schemas.request.invitation import CreateInvitationRequest
from app.schemas.response.invitation import InvitationResponse

router = APIRouter(tags=["Invitations"], prefix="/invitations")


async def _get_user_household_id(
    db: AsyncSession, user_id: int
) -> UUID | None:
    result = await db.execute(
        select(household_members.c.household_id).where(
            household_members.c.user_id == user_id
        )
    )
    return result.scalar_one_or_none()


def _invitation_response(invitation: Invitation) -> InvitationResponse:
    return InvitationResponse(
        id=invitation.id,
        email=invitation.email,
        householdId=invitation.household_id,
        invitedByUserId=UUID(int=invitation.invited_by_user_id),
        status=invitation.status,
        createdAt=invitation.created_at,
        expiresAt=invitation.expires_at,
    )


@router.get(
    "",
    dependencies=[Depends(get_current_user)],
    response_model=list[InvitationResponse],
    summary="Get pending invitations",
    description="Fetch list of pending invitations sent from the household.",
)
async def get_invitations(
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_database)],
) -> list[InvitationResponse]:
    """Get pending invitations for the user's household."""
    household_id = await _get_user_household_id(db, user.id)
    if not household_id:
        return []
    invitations = (
        await db.execute(
            select(Invitation).where(
                Invitation.household_id == household_id,
                Invitation.status == InvitationStatus.pending,
            )
        )
    ).scalars().all()
    return [_invitation_response(invitation) for invitation in invitations]


@router.post(
    "",
    dependencies=[Depends(get_current_user)],
    response_model=InvitationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Invite user to household",
    description="Send an invitation email to join the household.",
)
async def invite_user(
    request: CreateInvitationRequest,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_database)],
) -> InvitationResponse:
    """Create an invitation for the user's household."""
    household_id = await _get_user_household_id(db, user.id)
    if not household_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not in a household",
        )
    invitation = Invitation(
        email=request.email,
        household_id=household_id,
        invited_by_user_id=user.id,
        status=InvitationStatus.pending,
        expires_at=datetime.now(timezone.utc) + timedelta(days=7),
    )
    db.add(invitation)
    await db.flush()
    return _invitation_response(invitation)


@router.delete(
    "/{invitation_id}",
    dependencies=[Depends(get_current_user)],
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Cancel invitation",
    description="Cancel a pending household invitation.",
)
async def cancel_invitation(
    invitation_id: UUID,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_database)],
) -> Response:
    """Cancel a pending invitation."""
    invitation = await db.get(Invitation, invitation_id)
    if not invitation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invitation not found",
        )
    if invitation.invited_by_user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden – only household owner can cancel invitations",
        )
    invitation.status = InvitationStatus.cancelled
    await db.flush()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/{invitation_id}/accept",
    dependencies=[Depends(get_current_user)],
    response_model=dict,
    summary="Accept invitation to join household",
    description="Accept an invitation and join the household.",
)
async def accept_invitation(
    invitation_id: UUID,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_database)],
) -> dict:
    """Accept an invitation."""
    invitation = await db.get(Invitation, invitation_id)
    if not invitation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invitation not found",
        )
    if invitation.status != InvitationStatus.pending:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invitation already used or expired",
        )
    invitation.status = InvitationStatus.accepted
    await db.execute(
        household_members.insert().values(
            household_id=invitation.household_id,
            user_id=user.id,
            role="member",
            joined_at=datetime.now(timezone.utc),
        )
    )
    await db.flush()
    return {"householdId": invitation.household_id}


@router.post(
    "/{invitation_id}/decline",
    dependencies=[Depends(get_current_user)],
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Decline invitation to join household",
    description="Decline a household invitation.",
)
async def decline_invitation(
    invitation_id: UUID,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_database)],
) -> Response:
    """Decline an invitation."""
    invitation = await db.get(Invitation, invitation_id)
    if not invitation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invitation not found",
        )
    if invitation.status != InvitationStatus.pending:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invitation already used or expired",
        )
    invitation.status = InvitationStatus.declined
    await db.flush()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
