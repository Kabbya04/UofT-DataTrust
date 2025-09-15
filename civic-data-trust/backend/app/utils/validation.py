"""Validation utilities."""

import os
from typing import List
from app.exceptions.file import InvalidFileTypeError


def validate_file_size(file_size: int, max_size: int) -> bool:
    """Validate file size against maximum allowed size."""
    return file_size <= max_size


def validate_file_type(file_path: str, allowed_types: List[str]) -> bool:
    """Validate file type against allowed types."""
    _, ext = os.path.splitext(file_path)
    return ext.lower() in [t.lower() for t in allowed_types]


def ensure_file_type(file_path: str, allowed_types: List[str]) -> None:
    """Ensure file type is valid, raise exception if not."""
    if not validate_file_type(file_path, allowed_types):
        _, ext = os.path.splitext(file_path)
        raise InvalidFileTypeError(ext, allowed_types)