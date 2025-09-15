"""File processing core functionality."""

from .detector import FileTypeDetector, FileProcessor
from .manager import FileManager
from .models import FileInfo, ProcessingResult

__all__ = [
    "FileTypeDetector",
    "FileProcessor",
    "FileManager",
    "FileInfo",
    "ProcessingResult",
]