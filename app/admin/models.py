"""Define the admin views for the models."""

from typing import Any, ClassVar

from fastapi import Request
from sqladmin import ModelView
from sqlalchemy.orm import InstrumentedAttribute

from app.database.helpers import hash_password
from app.models.user import User


class UserAdmin(ModelView, model=User):
    """Admin view for the User model."""

    column_list: ClassVar[list[Any]] = [
        User.id,
        User.email,
        User.verified,
        User.role,
        User.banned,
    ]

    column_labels: ClassVar[dict[str | InstrumentedAttribute[Any], str]] = {
        "id": "User ID",
        "email": "Email",
        "verified": "Verified",
        "role": "Role",
        "banned": "Banned",
        "first_name": "First Name",
        "last_name": "Last Name",
    }

    column_details_exclude_list: ClassVar[list[Any]] = [User.password]
    form_excluded_columns: ClassVar[list[Any]] = []

    form_create_rules: ClassVar[list[str]] = [
        "email",
        "password",
        "first_name",
        "last_name",
        "verified",
        "role",
        "banned",
    ]
    form_edit_rules: ClassVar[list[str]] = [
        "email",
        "first_name",
        "last_name",
        "verified",
        "role",
        "banned",
    ]

    icon = "fa-solid fa-user"

    async def on_model_change(
        self,
        data: dict[str, Any],
        _model: User,
        is_created: bool,  # noqa: FBT001
        _request: Request,
    ) -> None:
        """Customize the password hash before saving into DB."""
        if is_created:
            # Hash the password before saving into DB !
            data["password"] = hash_password(data["password"])
