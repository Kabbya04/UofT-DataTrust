"""Performance monitoring utilities."""

import time
import psutil
from functools import wraps
from typing import Any, Callable, Dict
from .logging import get_logger

logger = get_logger(__name__)


def track_execution_time(func: Callable) -> Callable:
    """Decorator to track function execution time."""
    @wraps(func)
    def wrapper(*args, **kwargs) -> Any:
        start_time = time.time()
        try:
            result = func(*args, **kwargs)
            execution_time = time.time() - start_time
            logger.info(f"{func.__name__} executed in {execution_time:.2f} seconds")
            return result
        except Exception as e:
            execution_time = time.time() - start_time
            logger.error(f"{func.__name__} failed after {execution_time:.2f} seconds: {e}")
            raise
    return wrapper


def memory_monitor() -> Dict[str, float]:
    """Get current memory usage statistics."""
    process = psutil.Process()
    memory_info = process.memory_info()

    return {
        "rss_mb": memory_info.rss / 1024 / 1024,  # Resident Set Size in MB
        "vms_mb": memory_info.vms / 1024 / 1024,  # Virtual Memory Size in MB
        "percent": process.memory_percent()
    }