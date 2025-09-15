"""API dependencies for dependency injection."""

from .core import get_settings, get_eda_executor, get_file_processor
from .auth import get_current_user  # Placeholder for future auth
from .validation import validate_file_upload, validate_execution_request

__all__ = [
    "get_settings",
    "get_eda_executor",
    "get_file_processor",
    "get_current_user",
    "validate_file_upload",
    "validate_execution_request",
]