"""Prometheus metrics module for application observability."""

from app.metrics.custom import (
    increment_auth_failure,
    increment_login_attempt,
    increment_rate_limit_exceeded,
)
from app.metrics.instrumentator import get_instrumentator
from app.metrics.namespace import METRIC_NAMESPACE

__all__ = [
    "METRIC_NAMESPACE",
    "get_instrumentator",
    "increment_auth_failure",
    "increment_login_attempt",
    "increment_rate_limit_exceeded",
]
