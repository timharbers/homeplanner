"""Fixtures and configuration for the test suite."""

from __future__ import annotations

import asyncio
import os
from typing import TYPE_CHECKING, Any

if os.name == "nt":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

import pytest
import pytest_asyncio
from fastapi_cache import FastAPICache
from fastapi_cache.backends.inmemory import InMemoryBackend
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.pool import NullPool
from typer.testing import CliRunner

from app.config.helpers import get_project_root
from app.database.db import Base, get_database, get_database_url
from app.main import app
from app.managers.email import EmailManager

if TYPE_CHECKING:
    from collections.abc import AsyncGenerator

    from pyfakefs.fake_filesystem import FakeFilesystem


@pytest.hookimpl(tryfirst=True)
def pytest_configure(config) -> None:
    """Clear the screen before running tests."""
    os.system("cls" if os.name == "nt" else "clear")  # noqa: S605


# Initialize cache backend if needed and clear before each test
@pytest_asyncio.fixture(autouse=True, scope="function")
async def init_and_clear_cache() -> None:
    """Initialize FastAPICache if needed, then clear before each test."""
    backend = getattr(FastAPICache, "_backend", None)
    if not isinstance(backend, InMemoryBackend):
        FastAPICache.init(InMemoryBackend(), prefix="fastapi-cache")
    await FastAPICache.clear()


@pytest_asyncio.fixture(scope="function")
async def async_engine():
    """Create an async engine for the test database.

    Uses NullPool to avoid connection pooling issues with event loops.
    """
    engine = create_async_engine(
        get_database_url(use_test_db=True),
        echo=False,
        poolclass=NullPool,
    )
    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest_asyncio.fixture(scope="function")
async def async_test_sessionmaker(async_engine):
    """Return a sessionmaker bound to the test database."""
    return async_sessionmaker(async_engine, expire_on_commit=False)


@pytest_asyncio.fixture(scope="function")
async def test_db(
    async_test_sessionmaker,
) -> AsyncGenerator[AsyncSession, Any]:
    """Fixture to yield a database connection for testing."""
    async with async_test_sessionmaker() as session:
        yield session


@pytest_asyncio.fixture(scope="function")
async def client(
    async_test_sessionmaker,
) -> AsyncGenerator[AsyncClient, Any]:
    """Fixture to yield a test client for the app."""

    async def get_database_override() -> AsyncGenerator[AsyncSession, Any]:
        """Return the database connection for testing."""
        async with async_test_sessionmaker() as session, session.begin():
            yield session

    app.dependency_overrides[get_database] = get_database_override

    transport = ASGITransport(app=app)

    async with AsyncClient(
        transport=transport,
        base_url="http://testserver",
        headers={"Content-Type": "application/json"},
        timeout=10,
    ) as client:
        yield client

    app.dependency_overrides = {}


@pytest.fixture(scope="module")
def email_manager() -> EmailManager:
    """Fixture to return an EmailManager instance."""
    return EmailManager(suppress_send=True)


@pytest.fixture
def runner() -> CliRunner:
    """Return a CliRunner instance."""
    return CliRunner()


@pytest.fixture
def fake_toml(fs: FakeFilesystem) -> FakeFilesystem:
    """Fixture to create a fake toml file."""
    toml_file = get_project_root() / "pyproject.toml"
    fs.create_file(
        toml_file,
        contents=(
            '[project]\nname = "Test Runner"\nversion = "1.2.3"\n'
            'description = "Test Description"\n'
            'authors = [{name="Test Author", email="test@author.com"}]\n'
        ),
    )
    return fs
