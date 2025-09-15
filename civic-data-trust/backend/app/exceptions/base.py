"""Base exceptions for the application."""

from typing import Any, Dict, Optional


class AppException(Exception):
    """Base application exception."""

    def __init__(
        self,
        message: str,
        details: Optional[Dict[str, Any]] = None,
        status_code: int = 500
    ):
        self.message = message
        self.details = details or {}
        self.status_code = status_code
        super().__init__(self.message)


class ValidationError(AppException):
    """Validation error exception."""

    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(message, details, status_code=400)


class ProcessingError(AppException):
    """Processing error exception."""

    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(message, details, status_code=422)