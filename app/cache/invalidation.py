"""Cache invalidation utilities.

Provides helper functions to clear cached data when underlying data
changes.

All invalidation functions handle errors gracefully - cache failures
are logged but don't prevent the operation from succeeding. This ensures
the app continues functioning (with stale cache) if the cache backend
fails.
"""

from fastapi_cache import FastAPICache
from redis.exceptions import RedisError

from app.cache.constants import CacheNamespaces
from app.logs import LogCategory, category_logger


def _cache_initialized() -> bool:
    """Return True if FastAPICache has been initialized."""
    backend = getattr(FastAPICache, "_backend", None)
    prefix = getattr(FastAPICache, "_prefix", None)
    return backend is not None and prefix is not None


async def invalidate_user_cache(user_id: int) -> None:
    """Invalidate all cached data for a specific user.

    Clears user-scoped cache entries (e.g., /users/me).
    Also clears the single-user cache namespace.

    Args:
        user_id: The ID of the user whose cache should be cleared.

    Example:
        ```python
        # After user edit
        await invalidate_user_cache(user.id)
        ```

    Note:
        Cache failures are logged but don't raise exceptions. The app
        continues with stale cache until TTL expires.
    """
    if not _cache_initialized():
        return
    try:
        # Clear /users/me style cache (namespace: "user:{user_id}")
        namespace = CacheNamespaces.USER_ME_FORMAT.format(user_id=user_id)
        await FastAPICache.clear(namespace=namespace)

        # Clear single user lookup cache (namespace: "users:{user_id}")
        users_namespace = CacheNamespaces.USERS_SINGLE_FORMAT.format(
            user_id=user_id
        )
        await FastAPICache.clear(namespace=users_namespace)

        category_logger.info(
            f"Cleared cache for user {user_id}", LogCategory.CACHE
        )
    except (RedisError, OSError, RuntimeError) as e:
        category_logger.error(
            f"Failed to invalidate cache for user {user_id}: {e}",
            LogCategory.CACHE,
        )




async def invalidate_user_related_caches(user_id: int) -> None:
    """Invalidate all user-related caches in parallel for better performance.

    Clears user-specific cache entries. This is more efficient than
    calling invalidation functions sequentially.

    Args:
        user_id: The ID of the user whose caches should be cleared.

    Example:
        ```python
        # After user edit, delete, or role change
        await invalidate_user_related_caches(user.id)
        ```

    Note:
        Cache failures are logged but don't raise exceptions. Individual
        cache invalidation failures don't prevent other caches from being
        cleared. The app continues with stale cache until TTL expires.
    """
    if not _cache_initialized():
        return
    await invalidate_user_cache(user_id)


async def invalidate_namespace(namespace: str) -> None:
    """Invalidate all cache keys under a namespace.

    Clears all cache entries stored under the given namespace prefix.
    Useful for custom endpoint groups without dedicated invalidation
    helpers.

    Args:
        namespace: Cache namespace prefix to clear (e.g., "products:123").

    Example:
        ```python
        # Clear all caches under "products:123" namespace
        await invalidate_namespace("products:123")
        ```

    Note:
        Cache failures are logged but don't raise exceptions. The app
        continues with stale cache until TTL expires.
    """
    if not _cache_initialized():
        return
    try:
        await FastAPICache.clear(namespace=namespace)
        category_logger.info(
            f"Cleared cache namespace: {namespace}",
            LogCategory.CACHE,
        )
    except (RedisError, OSError, RuntimeError) as e:
        category_logger.error(
            f"Failed to invalidate cache namespace {namespace}: {e}",
            LogCategory.CACHE,
        )
