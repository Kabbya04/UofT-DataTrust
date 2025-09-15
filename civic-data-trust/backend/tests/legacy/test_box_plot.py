#!/usr/bin/env python3
"""
Test script to debug box_plot function with matplotlib_test_data.csv
"""

import sys
import os
import pandas as pd

# Add the app directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

from app.core.executor import DataScienceExecutor

def test_box_plot_with_test_data():
    """Test box_plot function with actual test data"""
    print("Testing box_plot function with matplotlib_test_data.csv")
    print("=" * 60)
    
    # Load the test data
    try:
        df = pd.read_csv('../public/matplotlib_test_data.csv')
        print(f"✅ Loaded test data: {len(df)} rows, {len(df.columns)} columns")
        print(f"Columns: {list(df.columns)}")
        print(f"Data types:")
        for col in df.columns:
            print(f"  {col}: {df[col].dtype} (numeric: {pd.api.types.is_numeric_dtype(df[col])})")
        
    except Exception as e:
        print(f"❌ Failed to load test data: {e}")
        return False
    
    # Convert to dict format (as used by the API)
    data_dict = df.to_dict('records')
    print(f"\n✅ Converted to dict format: {len(data_dict)} records")
    
    # Test box_plot function
    executor = DataScienceExecutor()
    
    # Test 1: All numeric columns
    print("\n--- Test 1: All numeric columns ---")
    numeric_columns = list(df.select_dtypes(include=['number']).columns)
    print(f"Available numeric columns: {numeric_columns}")
    
    test_columns = ','.join(numeric_columns[:3])  # Use first 3 numeric columns
    print(f"Testing with columns: {test_columns}")
    
    try:
        result, output_type, returns_data = executor.execute_matplotlib_function(
            data_dict, 'box_plot', {
                'columns': test_columns,
                'title': 'Test Box Plot - All Numeric'
            }
        )
        
        if output_type == 'plot':
            print("✅ Box plot created successfully!")
            print(f"   Plot type: {result['plot_type']}")
            print(f"   Image size: {len(result['image_base64'])} characters")
            print(f"   Parameters: {result['parameters']}")
        else:
            print(f"❌ Failed to create plot. Output type: {output_type}")
            
    except Exception as e:
        print(f"❌ Error creating box plot: {e}")
        import traceback
        traceback.print_exc()
    
    # Test 2: Specific columns from test data
    print("\n--- Test 2: Specific test data columns ---")
    test_columns_2 = 'sales_revenue,marketing_spend,avg_order_value'
    print(f"Testing with columns: {test_columns_2}")
    
    try:
        result, output_type, returns_data = executor.execute_matplotlib_function(
            data_dict, 'box_plot', {
                'columns': test_columns_2,
                'title': 'Sales Metrics Distribution'
            }
        )
        
        if output_type == 'plot':
            print("✅ Box plot created successfully!")
            print(f"   Plot type: {result['plot_type']}")
            print(f"   Image size: {len(result['image_base64'])} characters")
        else:
            print(f"❌ Failed to create plot. Output type: {output_type}")
            
    except Exception as e:
        print(f"❌ Error creating box plot: {e}")
        import traceback
        traceback.print_exc()
    
    # Test 3: Invalid columns (should fail gracefully)
    print("\n--- Test 3: Invalid columns (should fail gracefully) ---")
    try:
        result, output_type, returns_data = executor.execute_matplotlib_function(
            data_dict, 'box_plot', {
                'columns': 'invalid_column,another_invalid',
                'title': 'Invalid Test'
            }
        )
        
        if output_type == 'error':
            print("✅ Correctly handled invalid columns with error")
        else:
            print(f"⚠️ Unexpected result for invalid columns: {output_type}")
            
    except Exception as e:
        print(f"✅ Correctly caught exception for invalid columns: {e}")
    
    print("\n" + "=" * 60)
    print("Box plot testing completed!")
    return True

if __name__ == '__main__':
    test_box_plot_with_test_data()