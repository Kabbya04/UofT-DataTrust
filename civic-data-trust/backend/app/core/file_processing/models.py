"""File processing data models."""

from typing import Any, Dict, List, Optional
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path


@dataclass
class FileInfo:
    """Information about a processed file."""
    file_path: str
    file_name: str
    file_size: int
    file_type: str
    mime_type: Optional[str] = None
    encoding: Optional[str] = None
    created_at: Optional[datetime] = None
    metadata: Optional[Dict[str, Any]] = None

    @property
    def file_extension(self) -> str:
        """Get file extension."""
        return Path(self.file_path).suffix.lower()

    @property
    def is_text_file(self) -> bool:
        """Check if file is a text file."""
        text_extensions = {'.txt', '.csv', '.json', '.xml', '.html', '.md'}
        return self.file_extension in text_extensions

    @property
    def is_image_file(self) -> bool:
        """Check if file is an image file."""
        image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'}
        return self.file_extension in image_extensions

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary representation."""
        return {
            "file_path": self.file_path,
            "file_name": self.file_name,
            "file_size": self.file_size,
            "file_type": self.file_type,
            "file_extension": self.file_extension,
            "mime_type": self.mime_type,
            "encoding": self.encoding,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "metadata": self.metadata,
            "is_text_file": self.is_text_file,
            "is_image_file": self.is_image_file
        }


@dataclass
class ProcessingResult:
    """Result of file processing operation."""
    file_info: FileInfo
    success: bool
    processed_data: Optional[Any] = None
    error_message: Optional[str] = None
    processing_time_seconds: Optional[float] = None
    warnings: Optional[List[str]] = None

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary representation."""
        return {
            "file_info": self.file_info.to_dict(),
            "success": self.success,
            "processed_data": self.processed_data,
            "error_message": self.error_message,
            "processing_time_seconds": self.processing_time_seconds,
            "warnings": self.warnings or []
        }