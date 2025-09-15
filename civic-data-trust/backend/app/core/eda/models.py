"""EDA data models."""

from typing import Any, Dict, List, Optional
from dataclasses import dataclass
from datetime import datetime
from app.core.common.types import ExecutionStatus


@dataclass
class EDARequest:
    """EDA execution request model."""
    node_id: str
    workflow_type: str
    input_data: Optional[Any] = None
    function_chain: Optional[List[Dict[str, Any]]] = None
    continue_on_error: bool = True
    track_progress: bool = True
    ship_to_notebook: bool = False


@dataclass
class EDAResult:
    """EDA execution result model."""
    execution_id: str
    node_id: str
    status: ExecutionStatus
    start_time: datetime
    end_time: Optional[datetime] = None
    results: Optional[Dict[str, Any]] = None
    visualizations: Optional[List[str]] = None
    errors: Optional[List[str]] = None
    performance_metrics: Optional[Dict[str, Any]] = None

    @property
    def execution_time_seconds(self) -> Optional[float]:
        """Calculate execution time in seconds."""
        if self.start_time and self.end_time:
            return (self.end_time - self.start_time).total_seconds()
        return None

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary representation."""
        return {
            "execution_id": self.execution_id,
            "node_id": self.node_id,
            "status": self.status.value,
            "start_time": self.start_time.isoformat(),
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "results": self.results,
            "visualizations": self.visualizations,
            "errors": self.errors,
            "performance_metrics": self.performance_metrics,
            "execution_time_seconds": self.execution_time_seconds,
        }