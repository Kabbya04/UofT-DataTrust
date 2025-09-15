from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any, Optional, Dict
import pandas as pd
import io

router = APIRouter()

class TransformRequest(BaseModel):
    node_id: str
    node_type: str
    parameters: Dict[str, Any]
    input_data: Any

class TransformResponse(BaseModel):
    success: bool
    output_data: Optional[Any] = None
    output_data_2: Optional[Any] = None
    error: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

@router.post("/if-branch", response_model=TransformResponse)
async def if_branch_transform(request: TransformRequest):
    """
    If/Branch transformation endpoint.
    Routes input data to output_data if condition=1, or to output_data_2 if condition=0.
    """
    try:
        # Extract condition parameter
        condition = request.parameters.get("condition", 1)
        
        # Validate condition value
        if condition not in [0, 1]:
            return TransformResponse(
                success=False,
                error="Invalid condition value. Must be 0 or 1.",
                metadata={"node_id": request.node_id, "node_type": request.node_type}
            )
        
        # Route data based on condition
        if condition == 1:
            # Route to True output (output_data)
            return TransformResponse(
                success=True,
                output_data=request.input_data,
                output_data_2=None,
                metadata={
                    "node_id": request.node_id,
                    "node_type": request.node_type,
                    "condition": condition,
                    "route": "true_output"
                }
            )
        else:
            # Route to False output (output_data_2)
            return TransformResponse(
                success=True,
                output_data=None,
                output_data_2=request.input_data,
                metadata={
                    "node_id": request.node_id,
                    "node_type": request.node_type,
                    "condition": condition,
                    "route": "false_output"
                }
            )
            
    except Exception as e:
        return TransformResponse(
            success=False,
            error=f"Transform error: {str(e)}",
            metadata={"node_id": request.node_id, "node_type": request.node_type}
        )

@router.post("/split", response_model=TransformResponse)
async def split_transform(request: TransformRequest):
    """
    Split transformation endpoint.
    Splits CSV data by rows or columns based on splitType parameter.
    """
    try:
        # Extract parameters
        split_type = request.parameters.get("splitType", "rows")
        row_count = request.parameters.get("rowCount", 10)
        selected_columns1 = request.parameters.get("selectedColumns1", [])
        selected_columns2 = request.parameters.get("selectedColumns2", [])
        
        # Parse CSV from input_data.csv_content
        csv_content = None
        if hasattr(request.input_data, 'csv_content'):
            csv_content = request.input_data.csv_content
        elif isinstance(request.input_data, dict) and 'csv_content' in request.input_data:
            csv_content = request.input_data['csv_content']
        else:
            return TransformResponse(
                success=False,
                error="No csv_content found in input_data",
                metadata={"node_id": request.node_id, "node_type": request.node_type}
            )
        
        # Read CSV into DataFrame
        df = pd.read_csv(io.StringIO(csv_content))
        
        if split_type == "rows":
            # Split by rows at rowCount index
            if row_count <= 0 or row_count >= len(df):
                return TransformResponse(
                    success=False,
                    error=f"Invalid row_count: {row_count}. Must be between 1 and {len(df)-1}",
                    metadata={"node_id": request.node_id, "node_type": request.node_type}
                )
            
            df1 = df.iloc[:row_count]
            df2 = df.iloc[row_count:]
            
        elif split_type == "columns":
            # Split by columns using selectedColumns1 and selectedColumns2
            if not selected_columns1 and not selected_columns2:
                return TransformResponse(
                    success=False,
                    error="No columns selected for splitting",
                    metadata={"node_id": request.node_id, "node_type": request.node_type}
                )
            
            # Validate column names exist in DataFrame
            all_selected = selected_columns1 + selected_columns2
            invalid_columns = [col for col in all_selected if col not in df.columns]
            if invalid_columns:
                return TransformResponse(
                    success=False,
                    error=f"Invalid columns: {invalid_columns}",
                    metadata={"node_id": request.node_id, "node_type": request.node_type}
                )
            
            # Create DataFrames with selected columns
            df1 = df[selected_columns1] if selected_columns1 else pd.DataFrame()
            df2 = df[selected_columns2] if selected_columns2 else pd.DataFrame()
            
        else:
            return TransformResponse(
                success=False,
                error=f"Invalid splitType: {split_type}. Must be 'rows' or 'columns'",
                metadata={"node_id": request.node_id, "node_type": request.node_type}
            )
        
        # Convert DataFrames back to CSV strings
        output1_csv = df1.to_csv(index=False)
        output2_csv = df2.to_csv(index=False)
        
        # Prepare metadata with shape and columns information
        metadata = {
            "node_id": request.node_id,
            "node_type": request.node_type,
            "split_type": split_type,
            "original_shape": list(df.shape),
            "original_columns": list(df.columns),
            "output1_shape": list(df1.shape),
            "output1_columns": list(df1.columns),
            "output2_shape": list(df2.shape),
            "output2_columns": list(df2.columns)
        }
        
        if split_type == "rows":
            metadata["row_count"] = row_count
        else:
            metadata["selected_columns1"] = selected_columns1
            metadata["selected_columns2"] = selected_columns2
        
        return TransformResponse(
            success=True,
            output_data=output1_csv,
            output_data_2=output2_csv,
            metadata=metadata
        )
        
    except pd.errors.EmptyDataError:
        return TransformResponse(
            success=False,
            error="Empty CSV data provided",
            metadata={"node_id": request.node_id, "node_type": request.node_type}
        )
    except pd.errors.ParserError as e:
        return TransformResponse(
            success=False,
            error=f"CSV parsing error: {str(e)}",
            metadata={"node_id": request.node_id, "node_type": request.node_type}
        )
    except Exception as e:
        return TransformResponse(
            success=False,
            error=f"Split transform error: {str(e)}",
            metadata={"node_id": request.node_id, "node_type": request.node_type}
        )