"""Define tests for the household routes of the application."""

from typing import Any
from uuid import UUID

import pytest
from faker import Faker
from fastapi import status
from httpx import AsyncClient
from sqlalchemy import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.helpers import hash_password
from app.managers.auth import AuthManager
from app.models.enums import RoleType
from app.models.household import Household, HouseholdRole, household_members
from app.models.user import User


@pytest.mark.asyncio
@pytest.mark.integration
class TestHouseholdRoutes:
    """Test the household routes of the application."""

    def get_test_user(self, admin: bool = False) -> dict[str, Any]:
        """Return a test user payload."""
        fake = Faker()
        return {
            "email": fake.email(),
            "first_name": "Test",
            "last_name": "User",
            "password": hash_password("test12345!"),
            "verified": True,
            "role": RoleType.admin if admin else RoleType.user,
        }

    async def test_create_household(
        self, client: AsyncClient, test_db: AsyncSession
    ) -> None:
        """Ensure a user can create a household."""
        user = User(**self.get_test_user())
        test_db.add(user)
        await test_db.commit()
        await test_db.refresh(user)

        token = AuthManager.encode_token(user)

        response = await client.post(
            "/household",
            json={"name": "The Smith Family"},
            headers={"Authorization": f"Bearer {token}"},
        )

        assert response.status_code == status.HTTP_201_CREATED
        payload = response.json()
        assert payload["name"] == "The Smith Family"
        assert payload["ownerId"] == str(UUID(int=user.id))
        assert len(payload["members"]) == 1
        assert payload["members"][0]["role"] == HouseholdRole.owner.value
        assert payload["members"][0]["userId"] == str(UUID(int=user.id))

    async def test_create_household_when_member(
        self, client: AsyncClient, test_db: AsyncSession
    ) -> None:
        """Ensure creating a household fails for existing members."""
        user = User(**self.get_test_user())
        test_db.add(user)
        await test_db.commit()
        await test_db.refresh(user)

        household = Household(name="Existing Household", owner_id=user.id)
        test_db.add(household)
        await test_db.commit()
        await test_db.refresh(household)

        await test_db.execute(
            insert(household_members).values(
                household_id=household.id,
                user_id=user.id,
                role=HouseholdRole.owner,
            )
        )
        await test_db.commit()

        token = AuthManager.encode_token(user)

        response = await client.post(
            "/household",
            json={"name": "New Household"},
            headers={"Authorization": f"Bearer {token}"},
        )

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.json() == {
            "detail": "User is already part of a household"
        }
