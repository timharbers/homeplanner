"""Define the Floor model."""

import uuid

from sqlalchemy import Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database.db import Base


class Floor(Base):
    """Define the Floor model."""

    __tablename__ = "floors"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(100))
    order: Mapped[int] = mapped_column(Integer)

    def __repr__(self) -> str:
        """Define the model representation."""
        return f'Floor({self.id}, "{self.name}")'
