"""Notebook-specific exceptions."""

from typing import Any, Dict, Optional
from .base import AppException, ProcessingError


class NotebookError(ProcessingError):
    """General notebook error."""
    pass


class NotebookConnectionError(AppException):
    """Notebook connection error."""

    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(message, details, status_code=503)