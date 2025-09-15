#!/usr/bin/env python3
"""
Test script to debug line_plot function with matplotlib_test_data.csv
"""

import sys
import os
import pandas as pd

# Add the app directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

from app.core.executor import DataScienceExecutor

def test_line_plot_with_test_data():
    """Test line_plot function with actual test data"""
    print("Testing line_plot function with matplotlib_test_data.csv")
    print("=" * 60)
    
    # Load the test data
    try:
        df = pd.read_csv('../public/matplotlib_test_data.csv')
        print(f"✅ Loaded test data: {len(df)} rows, {len(df.columns)} columns")
        print(f"Columns: {list(df.columns)}")
        print(f"Data types:")
        for col in df.columns:
            print(f"  {col}: {df[col].dtype} (numeric: {pd.api.types.is_numeric_dtype(df[col])})")
        
        print(f"\nFirst few rows:")
        print(df.head(3))
        
    except Exception as e:
        print(f"❌ Failed to load test data: {e}")
        return False
    
    # Convert to dict format (as used by the API)
    data_dict = df.to_dict('records')
    print(f"\n✅ Converted to dict format: {len(data_dict)} records")
    print(f"Sample record: {data_dict[0]}")
    
    # Test line_plot function
    executor = DataScienceExecutor()
    
    # Test 1: User's exact parameters - sales_revenue vs marketing_spend
    print("\n--- Test 1: User's Parameters (sales_revenue vs marketing_spend) ---")
    try:
        result, output_type, returns_data = executor.execute_matplotlib_function(
            data_dict, 'line_plot', {
                'x_column': 'sales_revenue',
                'y_column': 'marketing_spend',
                'title': 'SvM'
            }
        )
        
        if output_type == 'plot':
            print("✅ Line plot created successfully!")
            print(f"   Plot type: {result['plot_type']}")
            print(f"   Image size: {len(result['image_base64'])} characters")
            print(f"   Parameters: {result['parameters']}")
        elif output_type == 'error':
            print(f"❌ Failed to create plot. Output type: {output_type}")
        else:
            print(f"⚠️ Unexpected output type: {output_type}")
            
    except Exception as e:
        print(f"❌ Error creating line plot: {e}")
        import traceback
        traceback.print_exc()
    
    # Test 2: Time series plot (month vs sales_revenue)
    print("\n--- Test 2: Time Series Plot (month vs sales_revenue) ---")
    try:
        result, output_type, returns_data = executor.execute_matplotlib_function(
            data_dict, 'line_plot', {
                'x_column': 'month',
                'y_column': 'sales_revenue',
                'title': 'Monthly Sales Revenue Trend'
            }
        )
        
        if output_type == 'plot':
            print("✅ Time series line plot created successfully!")
            print(f"   Plot type: {result['plot_type']}")
            print(f"   Image size: {len(result['image_base64'])} characters")
        elif output_type == 'error':
            print(f"❌ Failed to create time series plot. Output type: {output_type}")
        else:
            print(f"⚠️ Unexpected output type: {output_type}")
            
    except Exception as e:
        print(f"❌ Error creating time series plot: {e}")
        import traceback
        traceback.print_exc()
    
    # Test 3: Numeric vs Numeric (marketing_spend vs avg_order_value)
    print("\n--- Test 3: Numeric vs Numeric (marketing_spend vs avg_order_value) ---")
    try:
        result, output_type, returns_data = executor.execute_matplotlib_function(
            data_dict, 'line_plot', {
                'x_column': 'marketing_spend',
                'y_column': 'avg_order_value',
                'title': 'Marketing Spend vs Average Order Value'
            }
        )
        
        if output_type == 'plot':
            print("✅ Numeric line plot created successfully!")
            print(f"   Plot type: {result['plot_type']}")
            print(f"   Image size: {len(result['image_base64'])} characters")
        elif output_type == 'error':
            print(f"❌ Failed to create numeric plot. Output type: {output_type}")
        else:
            print(f"⚠️ Unexpected output type: {output_type}")
            
    except Exception as e:
        print(f"❌ Error creating numeric plot: {e}")
        import traceback
        traceback.print_exc()
    
    # Test 4: Invalid columns (should fail gracefully)
    print("\n--- Test 4: Invalid columns (should fail gracefully) ---")
    try:
        result, output_type, returns_data = executor.execute_matplotlib_function(
            data_dict, 'line_plot', {
                'x_column': 'invalid_x_column',
                'y_column': 'invalid_y_column',
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
    print("Line plot testing completed!")
    return True

if __name__ == '__main__':
    test_line_plot_with_test_data()