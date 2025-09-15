"""File processing exceptions."""

from typing import Any, Dict, Optional
from .base import AppException, ProcessingError


class FileProcessingError(ProcessingError):
    """File processing error."""
    pass


class FileNotFoundError(AppException):
    """File not found error."""

    def __init__(self, file_path: str, details: Optional[Dict[str, Any]] = None):
        message = f"File not found: {file_path}"
        details = details or {}
        details["file_path"] = file_path
        super().__init__(message, details, status_code=404)


class InvalidFileTypeError(AppException):
    """Invalid file type error."""

    def __init__(
        self,
        file_type: str,
        allowed_types: list,
        details: Optional[Dict[str, Any]] = None
    ):
        message = f"Invalid file type: {file_type}. Allowed types: {allowed_types}"
        details = details or {}
        details.update({
            "file_type": file_type,
            "allowed_types": allowed_types
        })
        super().__init__(message, details, status_code=400)