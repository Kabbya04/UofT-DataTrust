#!/usr/bin/env python3
"""
Comprehensive test script for ALL pandas functions
Tests every pandas function mentioned in the original error list and more
"""

import pandas as pd
import sys

# Add the app directory to path
sys.path.append('app')

from app.core.executor import DataScienceExecutor

def test_all_pandas_functions():
    """Test ALL pandas functions comprehensively"""
    
    # Load Housing.csv data
    housing_data = pd.read_csv('../public/Housing.csv')
    
    print(f"Loaded Housing.csv with shape: {housing_data.shape}")
    print(f"Columns: {list(housing_data.columns)}")
    print()
    
    # Initialize executor
    executor = DataScienceExecutor()
    
    # ALL pandas functions test suite
    test_functions = [
        # Data Inspection
        ('head', {'n': 3}),
        ('tail', {'n': 3}),
        ('info', {}),
        ('describe', {}),
        ('shape', {}),
        ('dtypes', {}),
        ('memory_usage', {}),
        
        # Data Quality Analysis
        ('isnull', {}),
        ('value_counts', {'column': 'bedrooms'}),
        ('unique', {'column': 'furnishingstatus'}),
        ('nunique', {'column': 'bedrooms'}),
        ('nunique', {}),  # all columns
        
        # Data Cleaning
        ('dropna', {}),
        ('fillna', {'value': 0}),
        ('drop_duplicates', {}),
        
        # Data Manipulation
        ('groupby', {'by': 'bedrooms', 'agg_func': 'mean'}),
        ('sort_values', {'by': 'price', 'ascending': True}),
        ('filter_rows', {'column': 'bedrooms', 'operator': '>', 'value': '2'}),
        ('select_columns', {'columns': 'price,area,bedrooms'}),
        
        # Statistical Analysis
        ('correlation', {}),
        ('covariance', {}),
        
        # Outlier Detection
        ('detect_outliers_iqr', {'column': 'price'}),
        ('detect_outliers_zscore', {'column': 'price', 'threshold': 2}),
    ]
    
    print("COMPREHENSIVE TEST - ALL PANDAS FUNCTIONS:")
    print("=" * 70)
    
    success_count = 0
    total_count = len(test_functions)
    
    for func_name, params in test_functions:
        print(f"\nTesting {func_name} with params: {params}")
        try:
            result, output_type, returns_data = executor.execute_pandas_function(
                housing_data, func_name, params
            )
            
            if result is not None:
                print(f"[SUCCESS] {func_name}")
                success_count += 1
                
                # Show result summary based on type
                if isinstance(result, dict):
                    if len(result) <= 3:
                        print(f"   Result: {result}")
                    else:
                        print(f"   Result keys: {list(result.keys())[:5]}")
                elif isinstance(result, list):
                    print(f"   Result length: {len(result)}")
                else:
                    print(f"   Result type: {type(result)}")
                    
            else:
                print(f"[FAILED] {func_name} - {output_type}")
        
        except Exception as e:
            print(f"[EXCEPTION] {func_name} - {str(e)}")
    
    print("\n" + "=" * 70)
    print(f"RESULTS: {success_count}/{total_count} functions working correctly")
    print(f"Success rate: {success_count/total_count*100:.1f}%")
    
    if success_count == total_count:
        print("🎉 ALL PANDAS FUNCTIONS ARE WORKING PERFECTLY!")
    else:
        print(f"⚠️  {total_count - success_count} functions still need attention")

if __name__ == "__main__":
    test_all_pandas_functions()