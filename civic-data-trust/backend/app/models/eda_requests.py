from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional, Union
from enum import Enum

from app.models.requests import FunctionStep


class WorkflowType(str, Enum):
    """Enumeration of available EDA workflow types"""
    BASIC_EDA = "basic_eda"
    DATA_CLEANING = "data_cleaning"
    VISUALIZATION_SUITE = "visualization_suite"
    CUSTOM = "custom"
    AUTO_DETECT = "auto_detect"


class CloudflareConfig(BaseModel):
    """Configuration for Cloudflare tunnel integration"""
    tunnel_name: Optional[str] = Field(None, description="Name for the Cloudflare tunnel")
    hostname: Optional[str] = Field(None, description="Custom hostname for the tunnel")
    account_id: Optional[str] = Field(None, description="Cloudflare account ID")
    zone_id: Optional[str] = Field(None, description="Cloudflare zone ID")
    api_key: Optional[str] = Field(None, description="Cloudflare API key")
    tunnel_token: Optional[str] = Field(None, description="Cloudflare tunnel token")


class EDAExecutionRequest(BaseModel):
    """Request model for unified EDA execution"""
    node_id: str = Field(..., description="Unique identifier for the EDA node")
    
    # Workflow configuration
    workflow_type: WorkflowType = Field(WorkflowType.CUSTOM, description="Type of EDA workflow to execute")
    function_chain: Optional[List[FunctionStep]] = Field(None, description="Custom function chain (required for CUSTOM workflow)")
    
    # Input data
    input_data: Optional[Dict[str, Any]] = Field(None, description="Input data for processing")
    
    # Execution options
    continue_on_error: bool = Field(True, description="Whether to continue execution after errors")
    track_progress: bool = Field(True, description="Whether to track execution progress")
    timeout_seconds: Optional[int] = Field(300, description="Execution timeout in seconds")
    
    # Output options
    generate_download_link: bool = Field(False, description="Whether to generate Cloudflare download link")
    colab_optimized: bool = Field(False, description="Whether to optimize output for Google Colab")
    include_colab_notebook: bool = Field(False, description="Whether to include a Colab notebook in the package")
    
    # Cloudflare configuration
    cloudflare_config: Optional[CloudflareConfig] = Field(None, description="Cloudflare tunnel configuration")
    
    # Performance options
    enable_performance_monitoring: bool = Field(True, description="Whether to enable detailed performance monitoring")
    auto_cleanup: bool = Field(True, description="Whether to automatically cleanup temporary files")
    
    class Config:
        json_schema_extra = {
            "example": {
                "node_id": "eda-processor-1",
                "workflow_type": "basic_eda",
                "input_data": {
                    "csv_content": "id,name,age,salary\n1,Alice,25,50000\n2,Bob,30,60000",
                    "filename": "employee_data.csv"
                },
                "generate_download_link": True,
                "colab_optimized": True
            },
            "custom_workflow_example": {
                "node_id": "eda-processor-2",
                "workflow_type": "custom",
                "function_chain": [
                    {
                        "id": "step-1",
                        "functionName": "head",
                        "category": "Data Inspection",
                        "library": "pandas",
                        "parameters": {"n": 5},
                        "description": "View first 5 rows"
                    },
                    {
                        "id": "step-2",
                        "functionName": "mean",
                        "category": "Mathematical Operations",
                        "library": "numpy",
                        "parameters": {"axis": "None"},
                        "description": "Calculate mean"
                    },
                    {
                        "id": "step-3",
                        "functionName": "histogram",
                        "category": "Basic Plots",
                        "library": "matplotlib",
                        "parameters": {"column": "age", "bins": 10},
                        "description": "Age distribution"
                    }
                ],
                "input_data": {
                    "csv_content": "id,name,age,salary\n1,Alice,25,50000\n2,Bob,30,60000",
                    "filename": "custom_analysis.csv"
                },
                "generate_download_link": True,
                "cloudflare_config": {
                    "tunnel_name": "eda-results-tunnel",
                    "hostname": "eda-results.example.com"
                }
            }
        }


class ProgressUpdate(BaseModel):
    """Model for progress updates during execution"""
    execution_id: str
    progress_percentage: float = Field(..., ge=0, le=100)
    current_step: Optional[str] = None
    current_library: Optional[str] = None
    estimated_time_remaining_ms: Optional[float] = None
    message: Optional[str] = None


class FileProcessingRequest(BaseModel):
    """Request model for file processing and routing"""
    files: List[Dict[str, Any]] = Field(..., description="List of files to process")
    auto_detect_workflow: bool = Field(True, description="Whether to auto-detect appropriate workflow")
    batch_processing: bool = Field(False, description="Whether to process files as a batch")
    
    class Config:
        json_schema_extra = {
            "example": {
                "files": [
                    {
                        "file_content": "id,name,age\n1,Alice,25\n2,Bob,30",
                        "filename": "data.csv",
                        "file_type": "text/csv"
                    },
                    {
                        "file_content": "binary_audio_data",
                        "filename": "audio.mp3",
                        "file_type": "audio/mpeg"
                    }
                ],
                "auto_detect_workflow": True,
                "batch_processing": True
            }
        }