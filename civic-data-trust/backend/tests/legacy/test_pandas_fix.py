#!/usr/bin/env python3
"""
Test script to verify pandas function fixes
Tests the specific functions that were failing: shape, dtypes, isnull, dropna, drop_duplicates, etc.
"""

import pandas as pd
import sys
import os

# Add the app directory to path
sys.path.append('app')

from app.core.executor import DataScienceExecutor

def test_pandas_functions():
    """Test pandas functions that were previously failing"""
    
    # Load Housing.csv data
    housing_data = pd.read_csv('../public/Housing.csv')
    
    print(f"Loaded Housing.csv with shape: {housing_data.shape}")
    print(f"Columns: {list(housing_data.columns)}")
    print()
    
    # Initialize executor
    executor = DataScienceExecutor()
    
    # Test functions that were failing
    test_functions = [
        ('shape', {}),
        ('dtypes', {}),
        ('isnull', {}),
        ('dropna', {}),
        ('drop_duplicates', {}),
        ('groupby', {'by': 'bedrooms', 'agg_func': 'mean'}),  # assuming bedrooms column exists
        ('sort_values', {'by': 'price'}),  # assuming price column exists
        ('filter_rows', {'column': 'bedrooms', 'operator': '>', 'value': '2'}),
        ('select_columns', {'columns': list(housing_data.columns)[:3]})  # first 3 columns
    ]
    
    print("Testing pandas functions that were previously failing:")
    print("=" * 60)
    
    for func_name, params in test_functions:
        print(f"\nTesting {func_name} with params: {params}")
        try:
            result, output_type, returns_data = executor.execute_pandas_function(
                housing_data, func_name, params
            )
            
            if result is not None:
                print(f"[SUCCESS] {func_name}")
                print(f"   Output type: {output_type}")
                print(f"   Returns data: {returns_data}")
                if isinstance(result, dict) and len(result) < 5:
                    print(f"   Result: {result}")
                elif isinstance(result, list) and len(result) < 5:
                    print(f"   Result length: {len(result)}, Sample: {result[:2] if result else 'Empty'}")
                else:
                    print(f"   Result type: {type(result)}, Length/Size: {len(result) if hasattr(result, '__len__') else 'N/A'}")
            else:
                print(f"[FAILED] {func_name}")
                print(f"   Error type: {output_type}")
        
        except Exception as e:
            print(f"[EXCEPTION] {func_name} - {str(e)}")
    
    print("\n" + "=" * 60)
    print("Test completed!")

if __name__ == "__main__":
    test_pandas_functions()