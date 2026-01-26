"""Define Response schemas specific to Tasks."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.task import TaskStatus
from app.schemas.response.room import RoomResponse


class TaskSummary(BaseModel):
    """Summary representation of a task."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    status: TaskStatus
    priority: int
    difficulty: int


class TaskResponse(BaseModel):
    """Response schema for a task."""

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: UUID
    title: str
    description: str | None = None
    priority: int
    difficulty: int
    status: TaskStatus
    assigned_user_id: UUID | None = Field(default=None, alias="assignedUserId")
    rooms: list[RoomResponse] = Field(default_factory=list)


class TaskDetailsResponse(TaskResponse):
    """Response schema for task details."""

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    dependencies: list[TaskSummary] = Field(default_factory=list)
    created_at: datetime | None = Field(default=None, alias="createdAt")
    updated_at: datetime | None = Field(default=None, alias="updatedAt")


class TaskDependencyGraph(BaseModel):
    """Response schema for task dependency graph."""

    dependsOn: list[TaskSummary] = Field(default_factory=list)
    dependedBy: list[TaskSummary] = Field(default_factory=list)


class TaskDashboardStats(BaseModel):
    """Response schema for task dashboard stats."""

    open: int = 0
    blocked: int = 0
    completed: int = 0


class TaskSuggestion(TaskResponse):
    """Response schema for task suggestions."""

    reason: str


class PaginatedTasksResponse(BaseModel):
    """Response schema for paginated tasks."""

    items: list[TaskResponse]
    page: int
    pageSize: int
    total: int
