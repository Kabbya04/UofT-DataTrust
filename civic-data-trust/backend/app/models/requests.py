from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class FunctionStep(BaseModel):
    """Model for a single function step in the execution chain"""
    id: str
    functionName: str
    category: str
    parameters: Dict[str, Any] = Field(default_factory=dict)
    description: str

class ExecutionRequest(BaseModel):
    """Request model for function chain execution"""
    node_id: str
    library: str = Field(..., description="Library to use: pandas, numpy, or matplotlib")
    function_chain: List[FunctionStep] = Field(..., description="List of functions to execute sequentially")
    input_data: Optional[Dict[str, Any]] = Field(None, description="Input data for the chain. Can contain 'dataset_name' for sample data or 'csv_content' for uploaded CSV data")
    
    class Config:
        json_schema_extra = {
            "example": {
                "node_id": "pandas-node-1",
                "library": "pandas",
                "function_chain": [
                    {
                        "id": "step-1",
                        "functionName": "filter_rows",
                        "category": "Data Selection",
                        "parameters": {
                            "column": "age",
                            "operator": ">",
                            "value": "30"
                        },
                        "description": "Filter users over 30"
                    }
                ],
                "input_data": {
                    "dataset_name": "users"
                }
            },
            "csv_example": {
                "node_id": "csv-node-1",
                "library": "numpy",
                "function_chain": [
                    {
                        "id": "step-1",
                        "functionName": "mean",
                        "category": "Mathematical Operations",
                        "parameters": {
                            "axis": "None"
                        },
                        "description": "Calculate mean of numeric data"
                    }
                ],
                "input_data": {
                    "csv_content": "id,value1,value2\n1,10,20\n2,15,25\n3,12,22",
                    "filename": "custom_data.csv"
                }
            }
        }

class FileUploadRequest(BaseModel):
    """Request model for file upload"""
    dataset_name: str = Field(..., description="Name for the uploaded dataset")
    description: Optional[str] = Field(None, description="Description of the dataset")

class LLMRequest(BaseModel):
    """Request model for LLM analysis"""
    data: Dict[str, Any] = Field(..., description="Data to analyze (CSV data as dict)")
    analysis_type: str = Field(default="eda", description="Type of analysis: eda, processing, explanation")
    query: Optional[str] = Field(None, description="Optional user query or specific question")
    model: Optional[str] = Field(None, description="Specific model to use (optional)")

class WorkflowNodeRequest(BaseModel):
    """Request model for workflow node processing"""
    node_type: str = Field(..., description="Type of node (e.g., 'llama', 'analysis')")
    input_data: Dict[str, Any] = Field(..., description="Input data from previous nodes")
    node_config: Dict[str, Any] = Field(default_factory=dict, description="Node configuration")