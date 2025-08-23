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
    input_data: Optional[Dict[str, Any]] = Field(None, description="Input data for the chain")
    
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
            }
        }

class FileUploadRequest(BaseModel):
    """Request model for file upload"""
    dataset_name: str = Field(..., description="Name for the uploaded dataset")
    description: Optional[str] = Field(None, description="Description of the dataset")