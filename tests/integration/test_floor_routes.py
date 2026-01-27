"""Define tests for the floor routes of the application."""

from typing import Any

import pytest
from faker import Faker
from fastapi import status
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.helpers import hash_password
from app.managers.auth import AuthManager
from app.models.enums import RoleType
from app.models.floor import Floor
from app.models.user import User


@pytest.mark.asyncio
@pytest.mark.integration
class TestFloorRoutes:
    """Test the floor routes of the application."""

    def get_test_user(self) -> dict[str, Any]:
        """Return a test user payload."""
        fake = Faker()
        return {
            "email": fake.email(),
            "first_name": "Test",
            "last_name": "User",
            "password": hash_password("test12345!"),
            "verified": True,
            "role": RoleType.user,
        }

    async def test_create_floor(
        self, client: AsyncClient, test_db: AsyncSession
    ) -> None:
        """Ensure a user can create a floor."""
        user = User(**self.get_test_user())
        test_db.add(user)
        await test_db.commit()
        await test_db.refresh(user)

        token = AuthManager.encode_token(user)

        response = await client.post(
            "/floors",
            json={"name": "Ground floor", "order": 1},
            headers={"Authorization": f"Bearer {token}"},
        )

        assert response.status_code == status.HTTP_201_CREATED
        payload = response.json()
        assert payload["name"] == "Ground floor"
        assert payload["order"] == 1

    async def test_update_floor(
        self, client: AsyncClient, test_db: AsyncSession
    ) -> None:
        """Ensure a user can update a floor."""
        user = User(**self.get_test_user())
        test_db.add(user)
        await test_db.commit()
        await test_db.refresh(user)

        floor = Floor(name="Old", order=1)
        test_db.add(floor)
        await test_db.commit()
        await test_db.refresh(floor)

        token = AuthManager.encode_token(user)

        response = await client.put(
            f"/floors/{floor.id}",
            json={"name": "New", "order": 2},
            headers={"Authorization": f"Bearer {token}"},
        )

        assert response.status_code == status.HTTP_200_OK
        payload = response.json()
        assert payload["name"] == "New"
        assert payload["order"] == 2

    async def test_delete_floor(
        self, client: AsyncClient, test_db: AsyncSession
    ) -> None:
        """Ensure a user can delete a floor."""
        user = User(**self.get_test_user())
        test_db.add(user)
        await test_db.commit()
        await test_db.refresh(user)

        floor = Floor(name="Delete", order=0)
        test_db.add(floor)
        await test_db.commit()
        await test_db.refresh(floor)

        token = AuthManager.encode_token(user)

        response = await client.delete(
            "/floors",
            params={"floor_id": str(floor.id)},
            headers={"Authorization": f"Bearer {token}"},
        )

        assert response.status_code == status.HTTP_204_NO_CONTENT
