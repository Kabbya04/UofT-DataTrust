"""EDA-specific exceptions."""

from typing import Any, Dict, Optional
from .base import AppException, ProcessingError


class EDAExecutionError(ProcessingError):
    """EDA execution error."""

    def __init__(
        self,
        message: str,
        function_name: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        details = details or {}
        if function_name:
            details["function_name"] = function_name
        super().__init__(message, details)


class EDAValidationError(AppException):
    """EDA validation error."""

    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(message, details, status_code=400)