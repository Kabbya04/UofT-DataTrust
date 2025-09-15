#!/usr/bin/env python3
"""
Final comprehensive test of ALL pandas functions through the EDA executor
This simulates the real production flow
"""

import pandas as pd
import sys

# Add the app directory to path
sys.path.append('app')

from app.core.eda_executor import EDAExecutor
from app.models.requests import FunctionStep

def test_all_functions_comprehensive():
    """Test ALL pandas functions through EDA executor (production flow)"""
    
    # Load Housing.csv data as dict (like the real API)
    housing_data = pd.read_csv('../public/Housing.csv')
    data_as_records = housing_data.to_dict('records')
    
    print(f"Loaded Housing.csv with {len(data_as_records)} records")
    print(f"Testing ALL pandas functions through EDA executor (production flow)")
    print()
    
    # Initialize EDA executor
    executor = EDAExecutor()
    
    # ALL pandas functions test - the complete set
    all_functions = [
        # Data Inspection
        FunctionStep(id="test_head", functionName="head", category="Inspection", parameters={"n": 3}, description="Test head"),
        FunctionStep(id="test_tail", functionName="tail", category="Inspection", parameters={"n": 3}, description="Test tail"),
        FunctionStep(id="test_info", functionName="info", category="Inspection", parameters={}, description="Test info"),
        FunctionStep(id="test_describe", functionName="describe", category="Inspection", parameters={}, description="Test describe"),
        FunctionStep(id="test_shape", functionName="shape", category="Inspection", parameters={}, description="Test shape"),
        FunctionStep(id="test_dtypes", functionName="dtypes", category="Inspection", parameters={}, description="Test dtypes"),
        
        # Data Quality Analysis  
        FunctionStep(id="test_isnull", functionName="isnull", category="Quality", parameters={}, description="Test isnull"),
        FunctionStep(id="test_value_counts", functionName="value_counts", category="Analysis", parameters={"column": "bedrooms"}, description="Test value counts"),
        FunctionStep(id="test_unique", functionName="unique", category="Analysis", parameters={"column": "furnishingstatus"}, description="Test unique"),
        FunctionStep(id="test_nunique", functionName="nunique", category="Analysis", parameters={}, description="Test nunique"),
        
        # Data Cleaning
        FunctionStep(id="test_dropna", functionName="dropna", category="Cleaning", parameters={}, description="Test dropna"),
        FunctionStep(id="test_drop_duplicates", functionName="drop_duplicates", category="Cleaning", parameters={}, description="Test drop duplicates"),
        
        # Data Manipulation  
        FunctionStep(id="test_groupby", functionName="groupby", category="Manipulation", parameters={"by": "bedrooms", "agg_func": "mean"}, description="Test groupby"),
        FunctionStep(id="test_sort_values", functionName="sort_values", category="Manipulation", parameters={"by": "price"}, description="Test sort values"),
        FunctionStep(id="test_filter_rows", functionName="filter_rows", category="Manipulation", parameters={"column": "bedrooms", "operator": ">", "value": "2"}, description="Test filter rows"),
        FunctionStep(id="test_select_columns", functionName="select_columns", category="Manipulation", parameters={"columns": "price,area,bedrooms"}, description="Test select columns"),
        
        # Statistical Analysis
        FunctionStep(id="test_correlation", functionName="correlation", category="Statistics", parameters={}, description="Test correlation"),
        FunctionStep(id="test_covariance", functionName="covariance", category="Statistics", parameters={}, description="Test covariance"),
        
        # Outlier Detection  
        FunctionStep(id="test_outliers_iqr", functionName="detect_outliers_iqr", category="Outliers", parameters={"column": "price"}, description="Test IQR outliers"),
        FunctionStep(id="test_outliers_zscore", functionName="detect_outliers_zscore", category="Outliers", parameters={"column": "area"}, description="Test Z-score outliers"),
    ]
    
    print(f"Testing {len(all_functions)} pandas functions:")
    print("=" * 70)
    
    # Execute through the unified EDA pipeline (the actual production path)
    result = executor.execute_unified_eda_pipeline(
        data=data_as_records,
        function_chain=all_functions,
        continue_on_error=True,
        track_progress=True
    )
    
    print(f"\nExecution Summary:")
    print(f"Overall Success: {result['success']}")
    print(f"Steps executed: {result['steps_executed']}/{result['total_steps']}")
    print(f"Total execution time: {result['total_execution_time_ms']:.2f}ms")
    
    # Group results by category
    categories = {}
    for step_result in result['results']:
        # Find the category from the original function step
        category = "Unknown"
        for func_step in all_functions:
            if func_step.id == step_result.step_id:
                category = func_step.category
                break
        
        if category not in categories:
            categories[category] = {"success": 0, "total": 0, "functions": []}
        
        categories[category]["total"] += 1
        categories[category]["functions"].append({
            "name": step_result.function_name,
            "success": step_result.success,
            "error": step_result.error if not step_result.success else None
        })
        
        if step_result.success:
            categories[category]["success"] += 1
    
    print(f"\nResults by Category:")
    overall_success = 0
    overall_total = 0
    
    for category, stats in categories.items():
        success_rate = (stats["success"] / stats["total"]) * 100
        print(f"  {category}: {stats['success']}/{stats['total']} ({success_rate:.1f}%)")
        
        # Show failed functions
        failed_functions = [f["name"] for f in stats["functions"] if not f["success"]]
        if failed_functions:
            print(f"    Failed: {failed_functions}")
        
        overall_success += stats["success"]
        overall_total += stats["total"]
    
    print(f"\n" + "=" * 70)
    print(f"FINAL RESULTS: {overall_success}/{overall_total} functions working")
    print(f"Overall success rate: {overall_success/overall_total*100:.1f}%")
    
    if overall_success == overall_total:
        print("SUCCESS: ALL PANDAS FUNCTIONS ARE NOW WORKING IN PRODUCTION!")
        print("The 'Function returned no result' issue has been completely resolved!")
    else:
        failed_count = overall_total - overall_success
        print(f"WARNING: {failed_count} functions still need attention")
        
        # List all failed functions
        all_failed = []
        for category, stats in categories.items():
            for f in stats["functions"]:
                if not f["success"]:
                    all_failed.append(f["name"])
        print(f"Still failing: {all_failed}")

if __name__ == "__main__":
    test_all_functions_comprehensive()