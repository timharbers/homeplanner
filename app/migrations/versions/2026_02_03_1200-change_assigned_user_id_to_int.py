"""Change assigned_user_id from UUID to INTEGER.

Revision ID: change_assigned_user_id_to_int
Revises: drop_api_keys_table
Create Date: 2026-02-03 12:00:00.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "change_assigned_user_id_to_int"
down_revision: Union[str, None] = "drop_api_keys_table"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade database to this revision."""
    op.execute("ALTER TABLE tasks DROP COLUMN IF EXISTS assigned_user_id")
    op.add_column(
        "tasks",
        sa.Column("assigned_user_id", sa.Integer(), nullable=True),
    )


def downgrade() -> None:
    """Downgrade database to the previous revision."""
    op.execute("ALTER TABLE tasks DROP COLUMN IF EXISTS assigned_user_id")
    op.add_column(
        "tasks",
        sa.Column(
            "assigned_user_id", postgresql.UUID(as_uuid=True), nullable=True
        ),
    )
