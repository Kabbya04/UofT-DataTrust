"""Custom exceptions for the application."""

from .base import AppException, ValidationError, ProcessingError
from .eda import EDAExecutionError, EDAValidationError
from .file import FileProcessingError, FileNotFoundError, InvalidFileTypeError
from .notebook import NotebookError, NotebookConnectionError

__all__ = [
    "AppException",
    "ValidationError",
    "ProcessingError",
    "EDAExecutionError",
    "EDAValidationError",
    "FileProcessingError",
    "FileNotFoundError",
    "InvalidFileTypeError",
    "NotebookError",
    "NotebookConnectionError",
]