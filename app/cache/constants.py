"""Cache namespace constants.

Centralized cache namespace strings to prevent typos and make
refactoring easier. Use these constants instead of hardcoded strings
when working with cache invalidation or decorators.

Example:
    ```python
    from app.cache.constants import CacheNamespaces

    @cached(namespace=CacheNamespaces.USER_ME)
    async def get_my_user():
        ...
    ```
"""


class CacheNamespaces:
    """Cache namespace constants.

    Organized by resource type. Format follows {resource}:{scope}
    pattern where applicable.
    """

    # User-related namespaces
    USER_ME = "user"  # Current user data (/users/me)
    USERS_SINGLE = "users"  # Base namespace for /users/ endpoint

    # Format templates for dynamic namespaces
    # Use f-strings with these templates for user-scoped caches
    USER_ME_FORMAT = "user:{user_id}"  # User-scoped cache
    USERS_SINGLE_FORMAT = "users:{user_id}"  # Single user cache
