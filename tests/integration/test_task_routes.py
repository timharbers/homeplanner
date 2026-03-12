"""Define tests for the task routes of the application."""

from typing import Any
from uuid import UUID

import pytest
from faker import Faker
from fastapi import status
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.helpers import hash_password
from app.managers.auth import AuthManager
from app.models.enums import RoleType
from app.models.household import Household, household_members
from app.models.room import Room
from app.models.task import Task, TaskStatus
from app.models.user import User


@pytest.mark.asyncio
@pytest.mark.integration
class TestTaskRoutes:
    """Test the task routes of the application."""

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

    async def _create_user_and_household(
        self, test_db: AsyncSession
    ) -> tuple[User, Household]:
        """Create a user and household for testing."""
        user = User(**self.get_test_user())
        test_db.add(user)
        await test_db.commit()
        await test_db.refresh(user)

        household = Household(name="Test Household", owner_id=user.id)
        test_db.add(household)
        await test_db.commit()
        await test_db.refresh(household)

        await test_db.execute(
            household_members.insert().values(
                household_id=household.id,
                user_id=user.id,
            )
        )
        await test_db.commit()

        return user, household

    async def _create_task(
        self,
        test_db: AsyncSession,
        household_id: UUID,
        title: str,
        priority: int,
        difficulty: int,
        status: TaskStatus,
        room: Room | None = None,
    ) -> Task:
        """Create a task belonging to a household (and optionally a room)."""
        task = Task(
            household_id=household_id,
            title=title,
            description=None,
            priority=priority,
            difficulty=difficulty,
            status=status,
        )
        if room is not None:
            task.rooms.append(room)
        test_db.add(task)
        await test_db.commit()
        await test_db.refresh(task)
        return task

    async def test_get_tasks_filters_by_multiple_status_and_priority(
        self, client: AsyncClient, test_db: AsyncSession
    ) -> None:
        """Ensure GET /tasks supports multi-select for status and priority."""
        user, household = await self._create_user_and_household(test_db)
        token = AuthManager.encode_token(user)

        # Create tasks with different status/priority combinations
        await self._create_task(
            test_db,
            household_id=household.id,
            title="low not started",
            priority=1,
            difficulty=1,
            status=TaskStatus.not_started,
        )
        await self._create_task(
            test_db,
            household_id=household.id,
            title="medium in progress",
            priority=2,
            difficulty=1,
            status=TaskStatus.in_progress,
        )
        await self._create_task(
            test_db,
            household_id=household.id,
            title="high blocked",
            priority=3,
            difficulty=1,
            status=TaskStatus.blocked,
        )

        response = await client.get(
            "/tasks",
            params={
                "statuses": [TaskStatus.not_started.value, TaskStatus.blocked.value],
                "priorities": [1, 3],
            },
            headers={"Authorization": f"Bearer {token}"},
        )

        assert response.status_code == status.HTTP_200_OK
        payload = response.json()
        titles = {task["title"] for task in payload["items"]}
        assert "low not started" in titles
        assert "high blocked" in titles
        assert "medium in progress" not in titles

    async def test_get_tasks_filters_by_multiple_rooms(
        self, client: AsyncClient, test_db: AsyncSession
    ) -> None:
        """Ensure GET /tasks supports multi-select for rooms."""
        user, household = await self._create_user_and_household(test_db)
        token = AuthManager.encode_token(user)

        # Create rooms in the same household
        kitchen = Room(name="Kitchen", order=1, household_id=household.id)
        living = Room(name="Living", order=2, household_id=household.id)
        other_household = Household(name="Other", owner_id=user.id)

        test_db.add_all([kitchen, living, other_household])
        await test_db.commit()
        await test_db.refresh(kitchen)
        await test_db.refresh(living)
        await test_db.refresh(other_household)

        # Task in kitchen, task in living, and a task in another household
        await self._create_task(
            test_db,
            household_id=household.id,
            title="kitchen task",
            priority=1,
            difficulty=1,
            status=TaskStatus.not_started,
            room=kitchen,
        )
        await self._create_task(
            test_db,
            household_id=household.id,
            title="living task",
            priority=1,
            difficulty=1,
            status=TaskStatus.not_started,
            room=living,
        )
        await self._create_task(
            test_db,
            household_id=other_household.id,
            title="other household task",
            priority=1,
            difficulty=1,
            status=TaskStatus.not_started,
        )

        response = await client.get(
            "/tasks",
            params={
                "room_ids": [str(kitchen.id), str(living.id)],
            },
            headers={"Authorization": f"Bearer {token}"},
        )

        assert response.status_code == status.HTTP_200_OK
        payload = response.json()
        titles = {task["title"] for task in payload["items"]}
        assert "kitchen task" in titles
        assert "living task" in titles
        # Should not leak tasks from another household
        assert "other household task" not in titles

