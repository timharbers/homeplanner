"""Household routes."""

from __future__ import annotations

from typing import TYPE_CHECKING, Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import delete, select

from app.database.db import get_database
from app.managers.security import get_current_user
from app.models.household import Household, HouseholdRole, household_members
from app.schemas.response.household import (
    HouseholdMemberResponse,
    HouseholdResponse,
)

if TYPE_CHECKING:
    from sqlalchemy.ext.asyncio import AsyncSession

    from app.models.user import User
    from app.schemas.request.household import (
        CreateHouseholdRequest,
        UpdateHouseholdRequest,
    )

router = APIRouter(tags=["Household"], prefix="/household")


async def _get_household_for_user(
    db: AsyncSession, user_id: int
) -> Household:
    stmt = (
        select(Household)
        .join(
            household_members,
            household_members.c.household_id == Household.id,
        )
        .where(household_members.c.user_id == user_id)
    )
    household = (await db.execute(stmt)).scalar_one_or_none()
    if not household:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Household not found",
        )
    return household


async def _get_members(
    db: AsyncSession, household_id: UUID
) -> list[HouseholdMemberResponse]:
    result = await db.execute(
        select(
            household_members.c.user_id,
            household_members.c.role,
            household_members.c.joined_at,
        ).where(household_members.c.household_id == household_id)
    )
    members = []
    for row in result.all():
        members.append(
            HouseholdMemberResponse(
                userId=UUID(int=row.user_id),
                role=row.role,
                joinedAt=row.joined_at,
            )
        )
    return members


def _household_response(
    household: Household, members: list[HouseholdMemberResponse]
) -> HouseholdResponse:
    return HouseholdResponse(
        id=household.id,
        name=household.name,
        createdAt=household.created_at,
        ownerId=UUID(int=household.owner_id),
        members=members,
    )


@router.get(
    "",
    dependencies=[Depends(get_current_user)],
    response_model=HouseholdResponse,
    summary="Get household information",
    description="Fetch household details for the current user.",
)
async def get_household(
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_database)],
) -> HouseholdResponse:
    """Get household information for the current user."""
    household = await _get_household_for_user(db, user.id)
    members = await _get_members(db, household.id)
    return _household_response(household, members)


@router.post(
    "",
    dependencies=[Depends(get_current_user)],
    response_model=HouseholdResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create household",
    description=(
        "Create a new household. The authenticated user becomes the owner."
    ),
)
async def create_household(
    request: CreateHouseholdRequest,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_database)],
) -> HouseholdResponse:
    """Create a household for the current user."""
    existing = await db.execute(
        select(household_members.c.household_id).where(
            household_members.c.user_id == user.id
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already part of a household",
        )

    household = Household(name=request.name, owner_id=user.id)
    db.add(household)
    await db.flush()

    await db.execute(
        household_members.insert().values(
            household_id=household.id,
            user_id=user.id,
            role=HouseholdRole.owner,
        )
    )
    await db.flush()

    members = await _get_members(db, household.id)
    return _household_response(household, members)


@router.put(
    "",
    dependencies=[Depends(get_current_user)],
    response_model=HouseholdResponse,
    summary="Update household",
    description="Update the household name. Owner only.",
)
async def update_household(
    request: UpdateHouseholdRequest,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_database)],
) -> HouseholdResponse:
    """Update the household name."""
    household = await _get_household_for_user(db, user.id)
    if household.owner_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden – user is not the household owner",
        )
    household.name = request.name
    await db.flush()
    members = await _get_members(db, household.id)
    return _household_response(household, members)


@router.delete(
    "",
    dependencies=[Depends(get_current_user)],
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete household",
    description=(
        "Permanently delete the household and all associated data. "
        "Owner only."
    ),
)
async def delete_household(
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_database)],
) -> Response:
    """Delete the household."""
    household = await _get_household_for_user(db, user.id)
    if household.owner_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden – user is not the household owner",
        )
    await db.execute(
        delete(household_members).where(
            household_members.c.household_id == household.id
        )
    )
    await db.delete(household)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/leave",
    dependencies=[Depends(get_current_user)],
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Leave household",
    description="Current user leaves the household.",
)
async def leave_household(
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_database)],
) -> Response:
    """Leave the current household."""
    household = await _get_household_for_user(db, user.id)
    if household.owner_id == user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Owner cannot leave the household",
        )
    await db.execute(
        delete(household_members).where(
            household_members.c.household_id == household.id,
            household_members.c.user_id == user.id,
        )
    )
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete(
    "/users/{user_id}",
    dependencies=[Depends(get_current_user)],
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Remove household member",
    description=(
        "Remove a user from the household. "
        "Allowed for household owner or the user removing themselves."
    ),
)
async def remove_household_member(
    user_id: UUID,
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_database)],
) -> Response:
    """Remove a household member."""
    current_user_id = user.id
    household = await _get_household_for_user(db, current_user_id)
    if household.owner_id != current_user_id and UUID(int=current_user_id) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden – insufficient permissions",
        )
    membership = await db.execute(
        select(household_members.c.user_id).where(
            household_members.c.household_id == household.id,
            household_members.c.user_id == user_id.int,
        )
    )
    if not membership.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found in household",
        )
    await db.execute(
        delete(household_members).where(
            household_members.c.household_id == household.id,
            household_members.c.user_id == user_id.int,
        )
    )
    return Response(status_code=status.HTTP_204_NO_CONTENT)
