"""Time-related utilities."""

from datetime import datetime, timedelta
from typing import Union


def get_timestamp() -> datetime:
    """Get current timestamp."""
    return datetime.now()


def format_duration(duration: Union[timedelta, float]) -> str:
    """Format duration as human-readable string."""
    if isinstance(duration, float):
        duration = timedelta(seconds=duration)

    total_seconds = int(duration.total_seconds())
    hours, remainder = divmod(total_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)

    if hours > 0:
        return f"{hours}h {minutes}m {seconds}s"
    elif minutes > 0:
        return f"{minutes}m {seconds}s"
    else:
        return f"{seconds}s"