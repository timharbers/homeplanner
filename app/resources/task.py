"""Task routes."""

from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database.db import get_database
from app.managers.security import get_current_user
from app.models.room import Room
from app.models.task import Task, TaskStatus, task_dependencies
from app.schemas.request.task import (
    AddDependencyRequest,
    CreateTaskRequest,
    UpdateTaskRequest,
    UpdateTaskStatusRequest,
)
from app.schemas.response.task import (
    PaginatedTasksResponse,
    TaskDashboardStats,
    TaskDependencyGraph,
    TaskDetailsResponse,
    TaskResponse,
    TaskSuggestion,
    TaskSummary,
)

router = APIRouter(tags=["Tasks"], prefix="/tasks")


def _task_response(task: Task) -> TaskResponse:
    return TaskResponse.model_validate(task)


def _task_summary(task: Task) -> TaskSummary:
    return TaskSummary.model_validate(task)


async def _get_task_or_404(
    db: AsyncSession, task_id: UUID, *, load_dependencies: bool = False
) -> Task:
    options = [selectinload(Task.rooms)]
    if load_dependencies:
        options.extend([selectinload(Task.depends_on), selectinload(Task.depended_by)])
    stmt = select(Task).where(Task.id == task_id).options(*options)
    task = (await db.execute(stmt)).scalar_one_or_none()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )
    return task


def _build_dependency_graph(edges: list[tuple[UUID, UUID]]) -> dict[UUID, set[UUID]]:
    adjacency: dict[UUID, set[UUID]] = {}
    for task_id, depends_on_id in edges:
        adjacency.setdefault(task_id, set()).add(depends_on_id)
    return adjacency


def _has_path(
    adjacency: dict[UUID, set[UUID]], start: UUID, target: UUID
) -> bool:
    seen: set[UUID] = set()
    stack = [start]
    while stack:
        node = stack.pop()
        if node == target:
            return True
        if node in seen:
            continue
        seen.add(node)
        stack.extend(adjacency.get(node, set()))
    return False


async def _would_create_cycle(
    db: AsyncSession, task_id: UUID, depends_on_task_id: UUID
) -> bool:
    if task_id == depends_on_task_id:
        return True
    result = await db.execute(
        select(
            task_dependencies.c.task_id,
            task_dependencies.c.depends_on_task_id,
        )
    )
    edges = result.all()
    adjacency = _build_dependency_graph(edges)
    adjacency.setdefault(task_id, set()).add(depends_on_task_id)
    return _has_path(adjacency, depends_on_task_id, task_id)


@router.get(
    "",
    dependencies=[Depends(get_current_user)],
    response_model=PaginatedTasksResponse,
    summary="Get all tasks",
    description=(
        "Fetch a paginated list of tasks for the household with filtering "
        "and sorting. Includes associated room data and dependency information."
    ),
)
async def get_tasks(
    db: Annotated[AsyncSession, Depends(get_database)],
    room_id: UUID | None = None,
    assigned_user_id: UUID | None = None,
    priority: int | None = None,
    difficulty: int | None = None,
    status: TaskStatus | None = None,
    blocked: bool | None = None,
    sort: str | None = None,
    order: str = "asc",
    page: int = 1,
    page_size: int = 20,
) -> PaginatedTasksResponse:
    """List tasks with filtering and pagination."""
    stmt = select(Task).options(selectinload(Task.rooms))
    if room_id:
        stmt = stmt.join(Task.rooms).where(Room.id == room_id).distinct()
    if assigned_user_id:
        stmt = stmt.where(Task.assigned_user_id == assigned_user_id)
    if priority:
        stmt = stmt.where(Task.priority == priority)
    if difficulty:
        stmt = stmt.where(Task.difficulty == difficulty)
    if status:
        stmt = stmt.where(Task.status == status)
    if blocked is True:
        stmt = stmt.where(Task.status == TaskStatus.blocked)
    elif blocked is False:
        stmt = stmt.where(Task.status != TaskStatus.blocked)

    sort_map = {
        "priority": Task.priority,
        "difficulty": Task.difficulty,
        "created_at": Task.created_at,
    }
    if sort in sort_map:
        sort_col = sort_map[sort]
        if order == "desc":
            stmt = stmt.order_by(sort_col.desc())
        else:
            stmt = stmt.order_by(sort_col.asc())

    total = (
        await db.execute(select(func.count()).select_from(stmt.subquery()))
    ).scalar_one()
    stmt = stmt.limit(page_size).offset((page - 1) * page_size)
    tasks = (await db.execute(stmt)).scalars().all()
    return PaginatedTasksResponse(
        items=[_task_response(task) for task in tasks],
        page=page,
        pageSize=page_size,
        total=total,
    )


@router.post(
    "",
    dependencies=[Depends(get_current_user)],
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create new task",
    description="Create a new task with rooms and dependencies.",
)
async def create_task(
    task_data: CreateTaskRequest,
    db: Annotated[AsyncSession, Depends(get_database)],
) -> TaskResponse:
    """Create a new task."""
    task = Task(
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority,
        difficulty=task_data.difficulty,
        status=task_data.status or TaskStatus.not_started,
        assigned_user_id=task_data.assigned_user_id,
    )
    if task_data.room_ids:
        rooms = (
            await db.execute(select(Room).where(Room.id.in_(task_data.room_ids)))
        ).scalars().all()
        if len(rooms) != len(set(task_data.room_ids)):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Room not found"
            )
        task.rooms = rooms
    if task_data.dependency_ids:
        dependencies = (
            await db.execute(
                select(Task).where(Task.id.in_(task_data.dependency_ids))
            )
        ).scalars().all()
        if len(dependencies) != len(set(task_data.dependency_ids)):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
            )
        task.depends_on = dependencies

    db.add(task)
    await db.flush()
    await db.refresh(task)
    task_with_rooms = (
        await db.execute(
            select(Task).where(Task.id == task.id).options(selectinload(Task.rooms))
        )
    ).scalar_one()
    return _task_response(task_with_rooms)


@router.get(
    "/suggestions",
    dependencies=[Depends(get_current_user)],
    response_model=list[TaskSuggestion],
    summary="Get smart task suggestions",
    description="Fetch top 1–3 recommended tasks with reasoning.",
)
async def get_task_suggestions(
    db: Annotated[AsyncSession, Depends(get_database)],
) -> list[TaskSuggestion]:
    """Get task suggestions."""
    stmt = (
        select(Task)
        .where(Task.status != TaskStatus.done)
        .order_by(Task.priority.desc(), Task.created_at.asc())
        .limit(3)
        .options(selectinload(Task.rooms))
    )
    tasks = (await db.execute(stmt)).scalars().all()
    suggestions: list[TaskSuggestion] = []
    for task in tasks:
        suggestion = TaskSuggestion.model_validate(task)
        suggestion.reason = "Highest priority in queue"
        suggestions.append(suggestion)
    return suggestions


@router.get(
    "/{task_id}",
    dependencies=[Depends(get_current_user)],
    response_model=TaskDetailsResponse,
    summary="Get single task details",
    description="Fetch complete task information including rooms and dependencies.",
)
async def get_task(
    task_id: UUID,
    db: Annotated[AsyncSession, Depends(get_database)],
) -> TaskDetailsResponse:
    """Get a single task."""
    task = await _get_task_or_404(db, task_id, load_dependencies=True)
    response = TaskDetailsResponse.model_validate(task)
    response.dependencies = [_task_summary(dep) for dep in task.depends_on]
    return response


@router.put(
    "/{task_id}",
    dependencies=[Depends(get_current_user)],
    response_model=TaskResponse,
    summary="Update existing task",
    description="Update any or all fields of an existing task.",
)
async def update_task(
    task_id: UUID,
    task_data: UpdateTaskRequest,
    db: Annotated[AsyncSession, Depends(get_database)],
) -> TaskResponse:
    """Update a task."""
    task = await _get_task_or_404(db, task_id)
    if task_data.title is not None:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description
    if task_data.priority is not None:
        task.priority = task_data.priority
    if task_data.difficulty is not None:
        task.difficulty = task_data.difficulty
    if task_data.status is not None:
        task.status = task_data.status
    if task_data.assigned_user_id is not None:
        task.assigned_user_id = task_data.assigned_user_id
    if task_data.room_ids is not None:
        if task_data.room_ids:
            rooms = (
                await db.execute(
                    select(Room).where(Room.id.in_(task_data.room_ids))
                )
            ).scalars().all()
            if len(rooms) != len(set(task_data.room_ids)):
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Room not found",
                )
            task.rooms = rooms
        else:
            task.rooms = []
    if task_data.dependency_ids is not None:
        if task_data.dependency_ids:
            dependencies = (
                await db.execute(
                    select(Task).where(
                        Task.id.in_(task_data.dependency_ids)
                    )
                )
            ).scalars().all()
            if len(dependencies) != len(set(task_data.dependency_ids)):
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Task not found",
                )
            task.depends_on = dependencies
        else:
            task.depends_on = []

    await db.flush()
    await db.refresh(task)
    return _task_response(task)


@router.delete(
    "/{task_id}",
    dependencies=[Depends(get_current_user)],
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete task",
    description="Permanently delete a task and all related records.",
)
async def delete_task(
    task_id: UUID,
    db: Annotated[AsyncSession, Depends(get_database)],
) -> Response:
    """Delete a task."""
    task = await _get_task_or_404(db, task_id)
    await db.delete(task)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/{task_id}/available-dependencies",
    dependencies=[Depends(get_current_user)],
    response_model=list[TaskSummary],
    summary="Get available tasks for dependencies",
    description=(
        "Excludes current task and tasks that would create circular dependencies."
    ),
)
async def get_available_dependencies(
    task_id: UUID,
    db: Annotated[AsyncSession, Depends(get_database)],
) -> list[TaskSummary]:
    """Get available dependency tasks."""
    await _get_task_or_404(db, task_id)
    result = await db.execute(
        select(
            task_dependencies.c.task_id,
            task_dependencies.c.depends_on_task_id,
        )
    )
    edges = result.all()
    reverse_map: dict[UUID, set[UUID]] = {}
    for task, depends_on in edges:
        reverse_map.setdefault(depends_on, set()).add(task)

    blocked_ids: set[UUID] = {task_id}
    stack = [task_id]
    while stack:
        current = stack.pop()
        for dependent in reverse_map.get(current, set()):
            if dependent not in blocked_ids:
                blocked_ids.add(dependent)
                stack.append(dependent)

    tasks = (await db.execute(select(Task))).scalars().all()
    return [
        _task_summary(task)
        for task in tasks
        if task.id not in blocked_ids
    ]


@router.post(
    "/{task_id}/dependencies",
    dependencies=[Depends(get_current_user)],
    status_code=status.HTTP_201_CREATED,
    summary="Add task dependency",
    description="Add a dependency where this task depends on another task.",
)
async def add_task_dependency(
    task_id: UUID,
    request: AddDependencyRequest,
    db: Annotated[AsyncSession, Depends(get_database)],
) -> Response:
    """Add a task dependency."""
    task = await _get_task_or_404(db, task_id)
    dependency = await _get_task_or_404(db, request.depends_on_task_id)
    if await _would_create_cycle(db, task_id, request.depends_on_task_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Circular dependency detected",
        )
    if dependency not in task.depends_on:
        task.depends_on.append(dependency)
    await db.flush()
    return Response(status_code=status.HTTP_201_CREATED)


@router.delete(
    "/{task_id}/dependencies/{depends_on_task_id}",
    dependencies=[Depends(get_current_user)],
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Remove task dependency",
)
async def delete_task_dependency(
    task_id: UUID,
    depends_on_task_id: UUID,
    db: Annotated[AsyncSession, Depends(get_database)],
) -> Response:
    """Remove a task dependency."""
    await _get_task_or_404(db, task_id)
    await db.execute(
        delete(task_dependencies).where(
            task_dependencies.c.task_id == task_id,
            task_dependencies.c.depends_on_task_id == depends_on_task_id,
        )
    )
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/{task_id}/dependency-graph",
    dependencies=[Depends(get_current_user)],
    response_model=TaskDependencyGraph,
    summary="Get task dependency graph",
    description="Fetch dependency graph data for visualization.",
)
async def get_task_dependency_graph(
    task_id: UUID,
    db: Annotated[AsyncSession, Depends(get_database)],
) -> TaskDependencyGraph:
    """Get a task dependency graph."""
    task = await _get_task_or_404(db, task_id, load_dependencies=True)
    return TaskDependencyGraph(
        dependsOn=[_task_summary(dep) for dep in task.depends_on],
        dependedBy=[_task_summary(dep) for dep in task.depended_by],
    )


@router.patch(
    "/{task_id}/status",
    dependencies=[Depends(get_current_user)],
    response_model=TaskResponse,
    summary="Quick update task status",
    description="Mark a task as done from dashboard suggestions.",
)
async def update_task_status(
    task_id: UUID,
    task_data: UpdateTaskStatusRequest,
    db: Annotated[AsyncSession, Depends(get_database)],
) -> TaskResponse:
    """Update task status."""
    if task_data.status != TaskStatus.done:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only 'done' status is supported",
        )
    task = await _get_task_or_404(db, task_id)
    task.status = TaskStatus.done
    await db.flush()
    await db.refresh(task)
    return _task_response(task)


@router.get(
    "/stats",
    dependencies=[Depends(get_current_user)],
    response_model=TaskDashboardStats,
    summary="Get dashboard statistics",
    description="Fetch aggregated task counts for the household.",
)
async def get_dashboard_stats(
    db: Annotated[AsyncSession, Depends(get_database)],
) -> TaskDashboardStats:
    """Get task dashboard stats."""
    total_open = (
        await db.execute(
            select(func.count()).where(Task.status != TaskStatus.done)
        )
    ).scalar_one()
    total_blocked = (
        await db.execute(
            select(func.count()).where(Task.status == TaskStatus.blocked)
        )
    ).scalar_one()
    total_completed = (
        await db.execute(
            select(func.count()).where(Task.status == TaskStatus.done)
        )
    ).scalar_one()
    return TaskDashboardStats(
        open=total_open, blocked=total_blocked, completed=total_completed
    )


