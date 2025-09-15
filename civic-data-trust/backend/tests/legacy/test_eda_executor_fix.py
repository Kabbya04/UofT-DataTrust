#!/usr/bin/env python3
"""
Test script to verify EDA executor fixes
This tests the actual production flow through the EDA executor
"""

import pandas as pd
import sys

# Add the app directory to path
sys.path.append('app')

from app.core.eda_executor import EDAExecutor
from app.models.requests import FunctionStep

def test_eda_executor_flow():
    """Test EDA executor with the actual production flow"""
    
    # Load Housing.csv data as dict (like the real API)
    housing_data = pd.read_csv('../public/Housing.csv')
    data_as_records = housing_data.to_dict('records')
    
    print(f"Loaded Housing.csv with {len(data_as_records)} records")
    print(f"Sample record keys: {list(data_as_records[0].keys()) if data_as_records else 'None'}")
    print()
    
    # Initialize EDA executor
    executor = EDAExecutor()
    
    # Test data initialization directly
    print("Testing data initialization:")
    initialized_data = executor.initialize_data(data_as_records)
    print(f"Initialized data type: {type(initialized_data)}")
    print(f"Initialized data shape: {getattr(initialized_data, 'shape', 'No shape attribute')}")
    print(f"Initialized data columns: {getattr(initialized_data, 'columns', 'No columns attribute')}")
    print()
    
    # Create function steps that were failing
    failing_functions = [
        FunctionStep(
            id="test_value_counts",
            functionName="value_counts",
            category="Data Analysis",
            parameters={"column": "bedrooms"},
            description="Test value counts"
        ),
        FunctionStep(
            id="test_unique",
            functionName="unique", 
            category="Data Analysis",
            parameters={"column": "furnishingstatus"},
            description="Test unique values"
        ),
        FunctionStep(
            id="test_covariance",
            functionName="covariance",
            category="Statistical Analysis", 
            parameters={},
            description="Test covariance matrix"
        ),
        FunctionStep(
            id="test_detect_outliers_iqr",
            functionName="detect_outliers_iqr",
            category="Outlier Detection",
            parameters={"column": "price"},
            description="Test IQR outlier detection"
        ),
        FunctionStep(
            id="test_detect_outliers_zscore",
            functionName="detect_outliers_zscore", 
            category="Outlier Detection",
            parameters={"column": "area"},
            description="Test Z-score outlier detection"
        )
    ]
    
    print("Testing EDA executor with previously failing functions:")
    print("=" * 70)
    
    # Execute through the unified EDA pipeline (the actual production path)
    result = executor.execute_unified_eda_pipeline(
        data=data_as_records,
        function_chain=failing_functions,
        continue_on_error=True,
        track_progress=True
    )
    
    print(f"\nExecution Summary:")
    print(f"Success: {result['success']}")
    print(f"Steps executed: {result['steps_executed']}/{result['total_steps']}")
    print(f"Total execution time: {result['total_execution_time_ms']:.2f}ms")
    
    print(f"\nIndividual Step Results:")
    for step_result in result['results']:
        status = "[SUCCESS]" if step_result.success else "[FAILED]"
        print(f"{status} {step_result.function_name}")
        if step_result.success:
            print(f"   Output type: {step_result.output_type}")
            print(f"   Execution time: {step_result.execution_time_ms:.2f}ms")
        else:
            print(f"   Error: {step_result.error}")
            print(f"   Execution time: {step_result.execution_time_ms:.2f}ms")
    
    # Count success/failure
    successful_steps = sum(1 for step in result['results'] if step.success)
    total_steps = len(result['results'])
    
    print(f"\n" + "=" * 70)
    print(f"FINAL RESULTS: {successful_steps}/{total_steps} functions working")
    print(f"Success rate: {successful_steps/total_steps*100:.1f}%")
    
    if successful_steps == total_steps:
        print("SUCCESS: All functions are now working through the EDA executor!")
    else:
        failed_functions = [step.function_name for step in result['results'] if not step.success]
        print(f"STILL FAILING: {failed_functions}")

if __name__ == "__main__":
    test_eda_executor_flow()