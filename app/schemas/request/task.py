"""Define Request schemas specific to Tasks."""

from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.task import TaskStatus


class CreateTaskRequest(BaseModel):
    """Request schema for creating a task."""

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    title: str
    description: str | None = None
    priority: int = Field(ge=1, le=5)
    difficulty: int = Field(ge=1, le=5)
    assigned_user_id: UUID | None = Field(default=None, alias="assignedUserId")
    status: TaskStatus | None = None
    room_ids: list[UUID] | None = Field(default=None, alias="roomIds")
    dependency_ids: list[UUID] | None = Field(
        default=None, alias="dependencyIds"
    )


class UpdateTaskRequest(BaseModel):
    """Request schema for updating a task."""

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    title: str | None = None
    description: str | None = None
    priority: int | None = Field(default=None, ge=1, le=5)
    difficulty: int | None = Field(default=None, ge=1, le=5)
    assigned_user_id: UUID | None = Field(default=None, alias="assignedUserId")
    status: TaskStatus | None = None
    room_ids: list[UUID] | None = Field(default=None, alias="roomIds")
    dependency_ids: list[UUID] | None = Field(
        default=None, alias="dependencyIds"
    )


class AddDependencyRequest(BaseModel):
    """Request schema for adding a task dependency."""

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    depends_on_task_id: UUID = Field(alias="dependsOnTaskId")


class UpdateTaskStatusRequest(BaseModel):
    """Request schema for updating task status."""

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    status: TaskStatus
