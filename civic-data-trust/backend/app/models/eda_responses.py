from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

from app.models.responses import StepResult
from app.models.eda_requests import WorkflowType


class LibrarySummary(BaseModel):
    """Summary of execution results for a specific library"""
    functions_executed: int = Field(..., description="Number of functions executed")
    successful_functions: int = Field(..., description="Number of successful functions")
    failed_functions: int = Field(..., description="Number of failed functions")
    total_time_ms: float = Field(..., description="Total execution time in milliseconds")
    data_outputs: int = Field(0, description="Number of data outputs generated")
    calculations: int = Field(0, description="Number of calculations performed")
    visualizations: int = Field(0, description="Number of visualizations created")


class PerformanceSummary(BaseModel):
    """Performance metrics for the execution"""
    total_time_ms: float = Field(..., description="Total execution time")
    average_step_time_ms: float = Field(..., description="Average time per step")
    library_performance: Dict[str, Dict[str, Any]] = Field(..., description="Per-library performance metrics")
    memory_usage_mb: Optional[float] = Field(None, description="Peak memory usage in MB")
    cache_hits: Optional[int] = Field(None, description="Number of cache hits")


class ProgressTracking(BaseModel):
    """Progress tracking information"""
    total_steps: int = Field(..., description="Total number of steps")
    completed_steps: int = Field(..., description="Number of completed steps")
    progress_percentage: float = Field(..., ge=0, le=100, description="Progress percentage")
    current_library: Optional[str] = Field(None, description="Currently executing library")
    estimated_time_remaining_ms: Optional[float] = Field(None, description="Estimated time remaining")


class DownloadInfo(BaseModel):
    """Information about generated download links"""
    download_url: str = Field(..., description="Public download URL")
    wget_command: str = Field(..., description="wget command for Google Colab")
    colab_compatible: bool = Field(..., description="Whether the link is Colab compatible")
    package_size_mb: float = Field(..., description="Size of the download package in MB")
    expiry_timestamp: Optional[str] = Field(None, description="When the download link expires")
    colab_instructions: Optional[str] = Field(None, description="Instructions for using in Google Colab")


class FileProcessingInfo(BaseModel):
    """Information about file processing and routing"""
    file_type: str = Field(..., description="Detected file type")
    processing_route: str = Field(..., description="Processing route taken")
    eda_skipped: bool = Field(False, description="Whether EDA processing was skipped")
    reason_skipped: Optional[str] = Field(None, description="Reason EDA was skipped")


class CleanupInfo(BaseModel):
    """Information about cleanup operations"""
    temporary_files_cleaned: int = Field(..., description="Number of temporary files cleaned")
    memory_released_mb: float = Field(..., description="Amount of memory released in MB")
    cleanup_time_ms: float = Field(..., description="Time taken for cleanup in milliseconds")


class EDAExecutionResponse(BaseModel):
    """Response model for unified EDA execution"""
    # Basic execution info
    success: bool = Field(..., description="Whether the execution was successful")
    execution_id: str = Field(..., description="Unique execution identifier")
    node_id: str = Field(..., description="Node identifier")
    workflow_type: WorkflowType = Field(..., description="Type of workflow executed")
    
    # Execution results
    results: List[StepResult] = Field(..., description="Detailed results for each step")
    steps_executed: int = Field(..., description="Number of steps successfully executed")
    total_steps: int = Field(..., description="Total number of steps in the workflow")
    
    # Library-specific summaries
    pandas_summary: Optional[LibrarySummary] = Field(None, description="Pandas execution summary")
    numpy_summary: Optional[LibrarySummary] = Field(None, description="NumPy execution summary")
    matplotlib_summary: Optional[LibrarySummary] = Field(None, description="Matplotlib execution summary")
    
    # Performance and progress
    total_execution_time_ms: float = Field(..., description="Total execution time")
    performance_summary: Optional[PerformanceSummary] = Field(None, description="Performance metrics")
    progress_tracking: Optional[ProgressTracking] = Field(None, description="Progress information")
    
    # Output data
    final_output: Optional[Any] = Field(None, description="Final output from the execution")
    pandas_results: Optional[Dict[str, Any]] = Field(None, description="Pandas-specific results")
    numpy_results: Optional[Dict[str, Any]] = Field(None, description="NumPy-specific results")
    matplotlib_results: Optional[Dict[str, Any]] = Field(None, description="Matplotlib-specific results")
    
    # File processing info
    file_type: Optional[str] = Field(None, description="Detected input file type")
    processing_route: Optional[str] = Field(None, description="Processing route taken")
    eda_skipped: Optional[bool] = Field(None, description="Whether EDA processing was skipped")
    
    # Download and sharing
    download_url: Optional[str] = Field(None, description="Public download URL")
    wget_command: Optional[str] = Field(None, description="wget command for Colab")
    colab_compatible: Optional[bool] = Field(None, description="Colab compatibility")
    colab_instructions: Optional[str] = Field(None, description="Colab usage instructions")
    download_info: Optional[DownloadInfo] = Field(None, description="Detailed download information")
    
    # Metadata
    timestamp: str = Field(..., description="Execution timestamp")
    error: Optional[str] = Field(None, description="Error message if execution failed")
    warnings: Optional[List[str]] = Field(None, description="Warning messages")
    
    # Cleanup and resource management
    cleanup_info: Optional[CleanupInfo] = Field(None, description="Cleanup operation results")
    
    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "execution_id": "eda_exec_123456",
                "node_id": "eda-processor-1",
                "workflow_type": "basic_eda",
                "results": [
                    {
                        "step_id": "step-1",
                        "function_name": "head",
                        "success": True,
                        "result": [{"id": 1, "name": "Alice", "age": 25}],
                        "execution_time_ms": 45.2,
                        "output_type": "data"
                    }
                ],
                "steps_executed": 4,
                "total_steps": 4,
                "pandas_summary": {
                    "functions_executed": 3,
                    "successful_functions": 3,
                    "failed_functions": 0,
                    "total_time_ms": 150.5,
                    "data_outputs": 2
                },
                "matplotlib_summary": {
                    "functions_executed": 1,
                    "successful_functions": 1,
                    "failed_functions": 0,
                    "total_time_ms": 250.3,
                    "visualizations": 1
                },
                "total_execution_time_ms": 1500.8,
                "download_url": "https://eda-results.example.com/download/package.zip",
                "wget_command": "wget https://eda-results.example.com/download/package.zip",
                "colab_compatible": True,
                "timestamp": "2024-01-15T10:30:00Z"
            }
        }


class FileProcessingResponse(BaseModel):
    """Response model for file processing and routing"""
    success: bool = Field(..., description="Whether file processing was successful")
    files_processed: int = Field(..., description="Number of files processed")
    processing_results: List[Dict[str, Any]] = Field(..., description="Results for each file")
    recommended_workflows: Dict[str, str] = Field(..., description="Recommended workflows for each file")
    batch_summary: Optional[Dict[str, Any]] = Field(None, description="Summary for batch processing")
    timestamp: str = Field(..., description="Processing timestamp")
    error: Optional[str] = Field(None, description="Error message if processing failed")


class WorkflowListResponse(BaseModel):
    """Response model for available workflows"""
    workflows: Dict[str, Dict[str, Any]] = Field(..., description="Available workflows with descriptions")
    custom_workflow_supported: bool = Field(True, description="Whether custom workflows are supported")
    
    class Config:
        json_schema_extra = {
            "example": {
                "workflows": {
                    "basic_eda": {
                        "name": "Basic EDA",
                        "description": "Essential exploratory data analysis",
                        "functions": ["head", "info", "describe", "heatmap"],
                        "estimated_time_ms": 2000
                    },
                    "data_cleaning": {
                        "name": "Data Cleaning",
                        "description": "Clean and prepare data for analysis",
                        "functions": ["dropna", "drop_duplicates", "describe"],
                        "estimated_time_ms": 1500
                    },
                    "visualization_suite": {
                        "name": "Visualization Suite",
                        "description": "Comprehensive data visualization",
                        "functions": ["histogram", "box_plot", "scatter_plot", "heatmap"],
                        "estimated_time_ms": 3000
                    }
                },
                "custom_workflow_supported": True
            }
        }


class HealthCheckResponse(BaseModel):
    """Response model for EDA system health check"""
    status: str = Field(..., description="System status")
    eda_executor_status: str = Field(..., description="EDA executor status")
    file_detector_status: str = Field(..., description="File detector status")
    cloudflare_service_status: Optional[str] = Field(None, description="Cloudflare service status")
    active_executions: int = Field(..., description="Number of active executions")
    system_load: Optional[float] = Field(None, description="Current system load")
    memory_usage_mb: Optional[float] = Field(None, description="Current memory usage")
    timestamp: str = Field(..., description="Health check timestamp")
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "healthy",
                "eda_executor_status": "operational",
                "file_detector_status": "operational",
                "cloudflare_service_status": "operational",
                "active_executions": 2,
                "system_load": 0.65,
                "memory_usage_mb": 512.3,
                "timestamp": "2024-01-15T10:30:00Z"
            }
        }