"""Notebook data models."""

from enum import Enum
from typing import Any, Dict, List, Optional
from dataclasses import dataclass
from datetime import datetime


class NotebookStatus(str, Enum):
    """Notebook session status."""
    STOPPED = "stopped"
    STARTING = "starting"
    RUNNING = "running"
    STOPPING = "stopping"
    ERROR = "error"


@dataclass
class NotebookSession:
    """Notebook session information."""
    session_id: str
    status: NotebookStatus
    port: Optional[int] = None
    process_id: Optional[int] = None
    start_time: Optional[datetime] = None
    notebook_directory: Optional[str] = None
    base_url: Optional[str] = None
    token: Optional[str] = None
    error_message: Optional[str] = None

    @property
    def is_running(self) -> bool:
        """Check if notebook session is running."""
        return self.status == NotebookStatus.RUNNING

    @property
    def url(self) -> Optional[str]:
        """Get notebook URL if available."""
        if self.base_url and self.token:
            return f"{self.base_url}?token={self.token}"
        return None

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary representation."""
        return {
            "session_id": self.session_id,
            "status": self.status.value,
            "port": self.port,
            "process_id": self.process_id,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "notebook_directory": self.notebook_directory,
            "base_url": self.base_url,
            "url": self.url,
            "is_running": self.is_running,
            "error_message": self.error_message
        }