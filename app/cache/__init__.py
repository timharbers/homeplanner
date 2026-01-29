"""Cache module for FastAPI application.

Provides cache decorators, key builders, and invalidation utilities.
"""

from app.cache.decorators import cached
from app.cache.invalidation import (
    invalidate_namespace,
    invalidate_user_cache,
    invalidate_user_related_caches,
)
from app.cache.key_builders import (
    paginated_key_builder,
    user_scoped_key_builder,
)

__all__ = [
    "cached",
    "invalidate_namespace",
    "invalidate_user_cache",
    "invalidate_user_related_caches",
    "paginated_key_builder",
    "user_scoped_key_builder",
]
