from pydantic import BaseModel
from typing import List, Any, Optional

class StepResult(BaseModel):
    """Model for individual step execution result"""
    step_id: str
    function_name: str
    success: bool
    result: Optional[Any] = None
    error: Optional[str] = None
    execution_time_ms: float
    output_type: str  # "data", "plot", "info", "error"

class ExecutionResponse(BaseModel):
    """Response model for function chain execution"""
    execution_id: str
    node_id: str
    library: str
    success: bool
    steps_executed: int
    total_steps: int
    results: List[StepResult]
    final_output: Optional[Any] = None
    total_execution_time_ms: float
    timestamp: str

class DatasetInfo(BaseModel):
    """Model for dataset information"""
    name: str
    shape: List[int]
    columns: List[str]
    sample: List[dict]
    description: Optional[str] = None

class SampleDataResponse(BaseModel):
    """Response model for sample data endpoint"""
    datasets: dict[str, DatasetInfo]

class HealthResponse(BaseModel):
    """Response model for health check"""
    status: str
    timestamp: str

class ErrorResponse(BaseModel):
    """Response model for errors"""
    error: str
    detail: Optional[str] = None
    timestamp: str

class LLMResponse(BaseModel):
    """Response model for LLM analysis"""
    analysis: str
    model_used: str
    status: str
    execution_time_ms: Optional[float] = None

class WorkflowNodeResponse(BaseModel):
    """Response model for workflow node processing"""
    result: Optional[Any] = None
    analysis: Optional[str] = None
    error: Optional[str] = None
    status: str
    node_type: Optional[str] = None