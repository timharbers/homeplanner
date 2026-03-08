"""Add household_id to floors, rooms, and tasks.

Revision ID: add_household_id_to_resources
Revises: change_assigned_user_id_to_int
Create Date: 2026-03-08 12:00:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "add_household_id_to_resources"
down_revision: Union[str, None] = "change_assigned_user_id_to_int"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add household_id column to floors, rooms, and tasks tables."""
    # Delete existing orphan data (records without household association)
    op.execute("DELETE FROM task_rooms")
    op.execute("DELETE FROM task_dependencies")
    op.execute("DELETE FROM tasks")
    op.execute("DELETE FROM rooms")
    op.execute("DELETE FROM floors")

    # Add household_id to floors
    op.add_column(
        "floors",
        sa.Column(
            "household_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("households.id", ondelete="CASCADE"),
            nullable=False,
        ),
    )
    op.create_index("ix_floors_household_id", "floors", ["household_id"])

    # Add household_id to rooms
    op.add_column(
        "rooms",
        sa.Column(
            "household_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("households.id", ondelete="CASCADE"),
            nullable=False,
        ),
    )
    op.create_index("ix_rooms_household_id", "rooms", ["household_id"])

    # Add household_id to tasks
    op.add_column(
        "tasks",
        sa.Column(
            "household_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("households.id", ondelete="CASCADE"),
            nullable=False,
        ),
    )
    op.create_index("ix_tasks_household_id", "tasks", ["household_id"])


def downgrade() -> None:
    """Remove household_id column from floors, rooms, and tasks tables."""
    # Remove from tasks
    op.drop_index("ix_tasks_household_id", table_name="tasks")
    op.drop_column("tasks", "household_id")

    # Remove from rooms
    op.drop_index("ix_rooms_household_id", table_name="rooms")
    op.drop_column("rooms", "household_id")

    # Remove from floors
    op.drop_index("ix_floors_household_id", table_name="floors")
    op.drop_column("floors", "household_id")
