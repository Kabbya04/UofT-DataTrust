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

class MergeRequest(BaseModel):
    node_id: str
    node_type: str
    parameters: Dict[str, Any]
    input_data_1: Any
    input_data_2: Any

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

@router.post("/merge", response_model=TransformResponse)
async def merge_transform(request: MergeRequest):
    """
    Merge transformation endpoint.
    Merges two CSV datasets either by columns (horizontal) or rows (vertical).
    """
    try:
        # Extract parameters
        merge_type = request.parameters.get("mergeType", "columns")
        selected_columns = request.parameters.get("selectedColumns", {"input1": [], "input2": []})
        
        # Parse CSV from both inputs
        def extract_csv_content(input_data):
            if hasattr(input_data, 'csv_content'):
                return input_data.csv_content
            elif isinstance(input_data, dict) and 'csv_content' in input_data:
                return input_data['csv_content']
            else:
                return None
        
        csv_content1 = extract_csv_content(request.input_data_1)
        csv_content2 = extract_csv_content(request.input_data_2)
        
        if not csv_content1 or not csv_content2:
            return TransformResponse(
                success=False,
                error="Both input_data_1 and input_data_2 must contain csv_content",
                metadata={"node_id": request.node_id, "node_type": request.node_type}
            )
        
        # Read CSVs into DataFrames
        df1 = pd.read_csv(io.StringIO(csv_content1))
        df2 = pd.read_csv(io.StringIO(csv_content2))
        
        if merge_type == "columns":
            # Column merge (horizontal concatenation)
            # Check if row counts match
            if len(df1) != len(df2):
                return TransformResponse(
                    success=False,
                    error=f"Row count mismatch: Input 1 has {len(df1)} rows, Input 2 has {len(df2)} rows. Column merge requires same row count.",
                    metadata={"node_id": request.node_id, "node_type": request.node_type}
                )
            
            # Filter columns if specified
            if selected_columns.get("input1"):
                # Validate selected columns exist
                invalid_cols1 = [col for col in selected_columns["input1"] if col not in df1.columns]
                if invalid_cols1:
                    return TransformResponse(
                        success=False,
                        error=f"Invalid columns in input1: {invalid_cols1}",
                        metadata={"node_id": request.node_id, "node_type": request.node_type}
                    )
                df1 = df1[selected_columns["input1"]]
            
            if selected_columns.get("input2"):
                # Validate selected columns exist
                invalid_cols2 = [col for col in selected_columns["input2"] if col not in df2.columns]
                if invalid_cols2:
                    return TransformResponse(
                        success=False,
                        error=f"Invalid columns in input2: {invalid_cols2}",
                        metadata={"node_id": request.node_id, "node_type": request.node_type}
                    )
                df2 = df2[selected_columns["input2"]]
            
            # Handle column name conflicts by adding suffixes
            common_columns = set(df1.columns) & set(df2.columns)
            if common_columns:
                df1 = df1.add_suffix('_1')
                df2 = df2.add_suffix('_2')
            
            # Concatenate horizontally
            merged_df = pd.concat([df1, df2], axis=1)
            
        elif merge_type == "rows":
            # Row merge (vertical concatenation)
            # Check if columns are compatible
            if not df1.columns.equals(df2.columns):
                # Get all unique columns from both DataFrames
                all_columns = list(df1.columns.union(df2.columns))
                
                # Reindex both DataFrames to have the same columns, filling missing with empty strings
                df1 = df1.reindex(columns=all_columns, fill_value="")
                df2 = df2.reindex(columns=all_columns, fill_value="")
            
            # Concatenate vertically
            merged_df = pd.concat([df1, df2], axis=0, ignore_index=True)
            
        else:
            return TransformResponse(
                success=False,
                error=f"Invalid mergeType: {merge_type}. Must be 'columns' or 'rows'",
                metadata={"node_id": request.node_id, "node_type": request.node_type}
            )
        
        # Fill any remaining missing values with empty strings
        merged_df = merged_df.fillna("")
        
        # Convert merged DataFrame back to CSV string
        output_csv = merged_df.to_csv(index=False)
        
        # Prepare metadata
        metadata = {
            "node_id": request.node_id,
            "node_type": request.node_type,
            "merge_type": merge_type,
            "input1_shape": list(df1.shape),
            "input1_columns": list(df1.columns),
            "input2_shape": list(df2.shape),
            "input2_columns": list(df2.columns),
            "output_shape": list(merged_df.shape),
            "output_columns": list(merged_df.columns)
        }
        
        if merge_type == "columns" and selected_columns:
            metadata["selected_columns"] = selected_columns
        
        return TransformResponse(
            success=True,
            output_data=output_csv,
            metadata=metadata
        )
        
    except pd.errors.EmptyDataError:
        return TransformResponse(
            success=False,
            error="Empty CSV data provided in one or both inputs",
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
            error=f"Merge transform error: {str(e)}",
            metadata={"node_id": request.node_id, "node_type": request.node_type}
        )