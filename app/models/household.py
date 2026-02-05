"""Define the Household models."""

from __future__ import annotations

import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Table,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.db import Base


class HouseholdRole(str, enum.Enum):
    """Allowed household roles."""

    owner = "owner"
    member = "member"


household_members = Table(
    "household_members",
    Base.metadata,
    Column(
        "household_id",
        UUID(as_uuid=True),
        ForeignKey("households.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "user_id",
        Integer(),
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "role",
        Enum(HouseholdRole),
        nullable=False,
        server_default=HouseholdRole.member.value,
    ),
    Column(
        "joined_at",
        DateTime(timezone=True),
        default=datetime.now(timezone.utc),
    ),
)


class Household(Base):
    """Define the Household model."""

    __tablename__ = "households"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(200))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.now(timezone.utc)
    )
    owner_id: Mapped[int] = mapped_column(Integer)

    members = relationship(
        "User",
        secondary=household_members,
        back_populates="households",
        viewonly=True,
    )

    def __repr__(self) -> str:
        """Define the model representation."""
        return f'Household({self.id}, "{self.name}")'
