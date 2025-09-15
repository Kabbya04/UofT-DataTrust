"""Common type definitions."""

from enum import Enum
from typing import Any, Dict, Optional
from dataclasses import dataclass
from datetime import datetime


class ExecutionStatus(str, Enum):
    """Execution status enumeration."""
    PENDING = "pending"
    INITIALIZING = "initializing"
    EXECUTING = "executing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


@dataclass
class WorkflowResult:
    """Workflow execution result."""
    execution_id: str
    status: ExecutionStatus
    start_time: datetime
    end_time: Optional[datetime] = None
    result_data: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    execution_time_seconds: Optional[float] = None

    @property
    def is_successful(self) -> bool:
        """Check if execution was successful."""
        return self.status == ExecutionStatus.COMPLETED

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary representation."""
        return {
            "execution_id": self.execution_id,
            "status": self.status.value,
            "start_time": self.start_time.isoformat(),
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "result_data": self.result_data,
            "error_message": self.error_message,
            "execution_time_seconds": self.execution_time_seconds,
            "is_successful": self.is_successful
        }