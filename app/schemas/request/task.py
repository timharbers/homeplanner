"""Define Request schemas specific to Tasks."""

from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.task import TaskStatus


class CreateTaskRequest(BaseModel):
    """Request schema for creating a task."""

    model_config = ConfigDict(from_attributes=True)

    title: str
    description: str | None = None
    priority: int = Field(ge=1, le=5)
    difficulty: int = Field(ge=1, le=5)
    assigned_user_id: int | None = None
    status: TaskStatus | None = None
    room_ids: list[UUID] | None = None
    dependency_ids: list[UUID] | None = None


class UpdateTaskRequest(BaseModel):
    """Request schema for updating a task."""

    model_config = ConfigDict(from_attributes=True)

    title: str | None = None
    description: str | None = None
    priority: int | None = Field(default=None, ge=1, le=5)
    difficulty: int | None = Field(default=None, ge=1, le=5)
    assigned_user_id: int | None = None
    status: TaskStatus | None = None
    room_ids: list[UUID] | None = None
    dependency_ids: list[UUID] | None = None


class AddDependencyRequest(BaseModel):
    """Request schema for adding a task dependency."""

    model_config = ConfigDict(from_attributes=True)

    depends_on_task_id: UUID


class UpdateTaskStatusRequest(BaseModel):
    """Request schema for updating task status."""

    model_config = ConfigDict(from_attributes=True)

    status: TaskStatus
