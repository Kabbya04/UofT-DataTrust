from fastapi import APIRouter, HTTPException
from datetime import datetime
import uuid

from app.models.requests import ExecutionRequest
from app.models.responses import ExecutionResponse, StepResult
from app.core.executor import DataScienceExecutor

router = APIRouter()

@router.post("/", response_model=ExecutionResponse)
async def execute_function_chain(request: ExecutionRequest):
    """Execute a function chain for a data science node"""
    execution_id = str(uuid.uuid4())
    start_time = datetime.now()
    
    executor = DataScienceExecutor()
    results = []
    final_output = None
    success = True
    
    try:
        # Initialize data
        current_data = executor.initialize_data(request.input_data)
        
        # Execute each function in the chain
        for i, step in enumerate(request.function_chain):
            step_start = datetime.now()
            
            try:
                # Execute function based on library
                result, output_type, returns_data = executor.execute_function(
                    current_data, request.library, step.functionName, step.parameters
                )
                
                step_end = datetime.now()
                execution_time = (step_end - step_start).total_seconds() * 1000
                
                if result is not None:
                    step_result = StepResult(
                        step_id=step.id,
                        function_name=step.functionName,
                        success=True,
                        result=result,
                        execution_time_ms=execution_time,
                        output_type=output_type
                    )
                    
                    # Update current_data for next step if this function returns data
                    if returns_data and output_type == "data":
                        current_data = executor.update_current_data(result)
                    
                    # Set final output (last successful step with data)
                    if output_type in ["data", "plot"]:
                        final_output = result
                
                else:
                    step_result = StepResult(
                        step_id=step.id,
                        function_name=step.functionName,
                        success=False,
                        error=f"The {step.functionName} function couldn't process your data. Please check if the column names and parameters are correct.",
                        execution_time_ms=execution_time,
                        output_type="error"
                    )
                    success = False
                
                results.append(step_result)
                
            except Exception as e:
                step_end = datetime.now()
                execution_time = (step_end - step_start).total_seconds() * 1000
                
                # Make error messages more user-friendly
                user_friendly_error = executor.format_user_friendly_error(str(e), step.functionName)
                
                step_result = StepResult(
                    step_id=step.id,
                    function_name=step.functionName,
                    success=False,
                    error=user_friendly_error,
                    execution_time_ms=execution_time,
                    output_type="error"
                )
                results.append(step_result)
                success = False
        
        end_time = datetime.now()
        total_execution_time = (end_time - start_time).total_seconds() * 1000
        
        return ExecutionResponse(
            execution_id=execution_id,
            node_id=request.node_id,
            library=request.library,
            success=success,
            steps_executed=len([r for r in results if r.success]),
            total_steps=len(request.function_chain),
            results=results,
            final_output=final_output,
            total_execution_time_ms=total_execution_time,
            timestamp=datetime.now().isoformat()
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Execution failed: {str(e)}"
        )