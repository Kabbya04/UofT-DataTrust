#!/usr/bin/env python3
"""
Test script to verify additional pandas function fixes
Tests: value_counts, unique, covariance, detect_outliers_iqr, detect_outliers_zscore
"""

import pandas as pd
import sys
import os

# Add the app directory to path
sys.path.append('app')

from app.core.executor import DataScienceExecutor

def test_additional_pandas_functions():
    """Test additional pandas functions that need fixing"""
    
    # Load Housing.csv data
    housing_data = pd.read_csv('../public/Housing.csv')
    
    print(f"Loaded Housing.csv with shape: {housing_data.shape}")
    print(f"Columns: {list(housing_data.columns)}")
    print()
    
    # Initialize executor
    executor = DataScienceExecutor()
    
    # Test functions that need fixing
    test_functions = [
        ('value_counts', {'column': 'bedrooms'}),
        ('value_counts', {'column': 'furnishingstatus'}),  # categorical column
        ('value_counts', {}),  # auto-select column
        ('unique', {'column': 'bedrooms'}),
        ('unique', {'column': 'furnishingstatus'}),
        ('covariance', {}),
        ('detect_outliers_iqr', {'column': 'price'}),
        ('detect_outliers_iqr', {}),  # auto-select column
        ('detect_outliers_zscore', {'column': 'price'}),
        ('detect_outliers_zscore', {}),  # auto-select column
    ]
    
    print("Testing additional pandas functions that need fixing:")
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
                if isinstance(result, dict):
                    # Show dict keys and a few values for large dicts
                    if len(result) <= 5:
                        print(f"   Result: {result}")
                    else:
                        print(f"   Result keys: {list(result.keys())}")
                        # Show first few items for large dicts
                        for k, v in list(result.items())[:3]:
                            if isinstance(v, dict) and len(v) > 5:
                                print(f"      {k}: dict with {len(v)} items")
                            else:
                                print(f"      {k}: {v}")
                elif isinstance(result, list) and len(result) > 5:
                    print(f"   Result length: {len(result)}, Sample: {result[:2] if result else 'Empty'}")
                else:
                    print(f"   Result type: {type(result)}, Value: {result}")
            else:
                print(f"[FAILED] {func_name}")
                print(f"   Error type: {output_type}")
        
        except Exception as e:
            print(f"[EXCEPTION] {func_name} - {str(e)}")
    
    print("\n" + "=" * 60)
    print("Test completed!")

if __name__ == "__main__":
    test_additional_pandas_functions()