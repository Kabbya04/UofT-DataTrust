#!/usr/bin/env python3
"""
Test script to simulate the exact API execution flow
"""

import sys
import os
import pandas as pd

# Add the app directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

from app.core.executor import DataScienceExecutor

def test_api_execution_flow():
    """Test the complete API execution flow"""
    print("Testing complete API execution flow")
    print("=" * 60)
    
    # Step 1: Load CSV data (simulating file upload)
    try:
        df = pd.read_csv('../public/matplotlib_test_data.csv')
        print(f"✅ Step 1: Loaded CSV data: {len(df)} rows, {len(df.columns)} columns")
    except Exception as e:
        print(f"❌ Step 1 failed: {e}")
        return False
    
    # Step 2: Simulate input_data structure (as it would come from frontend)
    csv_content = df.to_csv(index=False)
    input_data = {
        'csv_content': csv_content,
        'filename': 'matplotlib_test_data.csv'
    }
    print(f"✅ Step 2: Created input_data structure with CSV content ({len(csv_content)} chars)")
    
    # Step 3: Initialize executor and data
    executor = DataScienceExecutor()
    try:
        current_data = executor.initialize_data(input_data)
        print(f"✅ Step 3: Initialized data successfully")
        print(f"   Data type: {type(current_data)}")
        if hasattr(current_data, 'shape'):
            print(f"   Data shape: {current_data.shape}")
            print(f"   Data columns: {list(current_data.columns)}")
    except Exception as e:
        print(f"❌ Step 3 failed: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    # Step 4: Execute matplotlib function (user's exact parameters)
    print("\n--- Step 4: Execute line_plot function ---")
    function_name = 'line_plot'
    library = 'matplotlib'
    parameters = {
        'x_column': 'sales_revenue',
        'y_column': 'marketing_spend', 
        'title': 'SvM'
    }
    
    try:
        result, output_type, returns_data = executor.execute_function(
            current_data, library, function_name, parameters
        )
        
        print(f"✅ Step 4: Function executed")
        print(f"   Result: {result is not None}")
        print(f"   Output type: {output_type}")
        print(f"   Returns data: {returns_data}")
        
        if result is not None:
            print(f"   Result type: {type(result)}")
            if isinstance(result, dict):
                print(f"   Result keys: {list(result.keys())}")
                if 'image_base64' in result:
                    print(f"   Image size: {len(result['image_base64'])} characters")
        else:
            print("   ❌ Result is None - this is the problem!")
            
    except Exception as e:
        print(f"❌ Step 4 failed: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    # Step 5: Test with different data format (list of dicts)
    print("\n--- Step 5: Test with list of dicts format ---")
    try:
        data_as_list = df.to_dict('records')
        print(f"   Converted to list of {len(data_as_list)} dictionaries")
        
        result2, output_type2, returns_data2 = executor.execute_function(
            data_as_list, library, function_name, parameters
        )
        
        print(f"✅ Step 5: Function executed with list format")
        print(f"   Result: {result2 is not None}")
        print(f"   Output type: {output_type2}")
        
        if result2 is not None and isinstance(result2, dict) and 'image_base64' in result2:
            print(f"   Image size: {len(result2['image_base64'])} characters")
            
    except Exception as e:
        print(f"❌ Step 5 failed: {e}")
        import traceback
        traceback.print_exc()
    
    # Step 6: Test data validation
    print("\n--- Step 6: Test data validation ---")
    try:
        from app.core.data_validator import validate_dataframe_for_research
        validation_result = validate_dataframe_for_research(df)
        print(f"✅ Step 6: Data validation completed")
        print(f"   Validation passed: {validation_result['validation_passed']}")
        print(f"   Warnings: {validation_result['warnings']}")
        print(f"   Errors: {validation_result['errors']}")
    except Exception as e:
        print(f"❌ Step 6 failed: {e}")
    
    print("\n" + "=" * 60)
    print("API flow testing completed!")
    
    # Summary
    if result is not None:
        print("🎉 SUCCESS: The matplotlib function is working correctly!")
        print("   The issue might be in the frontend or API request format.")
        return True
    else:
        print("❌ ISSUE FOUND: The matplotlib function is returning None")
        print("   This explains why steps_executed = 0 and success = false")
        return False

if __name__ == '__main__':
    test_api_execution_flow()