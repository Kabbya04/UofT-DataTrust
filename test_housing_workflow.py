#!/usr/bin/env python3
"""
Test script to verify pandas workflow with unclean_housing.csv
"""
import sys
import os
sys.path.append('civic-data-trust/backend')

from app.core.executor import DataScienceExecutor
import pandas as pd
import json

def load_housing_data():
    """Load the unclean housing data"""
    csv_path = 'civic-data-trust/public/unclean_housing.csv'
    try:
        df = pd.read_csv(csv_path)
        print(f"[OK] Loaded housing data: {df.shape[0]} rows, {df.shape[1]} columns")
        print(f"Columns: {list(df.columns)}")
        return df
    except Exception as e:
        print(f"[FAIL] Failed to load housing data: {e}")
        return None

def test_data_inspection(executor, housing_data):
    """Test data inspection functions"""
    print("\n=== Testing Data Inspection Functions ===")
    
    tests = [
        ('head', {}),
        ('info', {}),
        ('describe', {}),
        ('shape', {}),
        ('dtypes', {}),
        ('isnull', {}),
    ]
    
    results = {}
    for func_name, params in tests:
        try:
            result, result_type, data_changed = executor.execute_function(
                housing_data, 'pandas', func_name, params
            )
            results[func_name] = result
            print(f"[OK] {func_name}: {result_type} - Success")
        except Exception as e:
            print(f"[FAIL] {func_name}: Failed - {e}")
            results[func_name] = None
    
    return results

def test_data_cleaning(executor, housing_data):
    """Test data cleaning functions"""
    print("\n=== Testing Data Cleaning Functions ===")
    
    tests = [
        ('drop_duplicates', {}),
        ('fillna', {'value': 'unknown'}),
        ('dropna', {}),
    ]
    
    results = {}
    for func_name, params in tests:
        try:
            result, result_type, data_changed = executor.execute_function(
                housing_data, 'pandas', func_name, params
            )
            results[func_name] = result
            print(f"[OK] {func_name}: {result_type} - Success")
            if data_changed:
                print(f"  Data modified: {len(result) if isinstance(result, list) else 'N/A'} rows")
        except Exception as e:
            print(f"[FAIL] {func_name}: Failed - {e}")
            results[func_name] = None
    
    return results

def test_data_analysis(executor, housing_data):
    """Test data analysis functions"""
    print("\n=== Testing Data Analysis Functions ===")
    
    # Test with columns that exist in the housing data
    tests = [
        ('correlation', {}),
        ('value_counts', {'column': 'furnishingstatus'}),
        ('unique', {'column': 'mainroad'}),
        ('nunique', {}),
        ('detect_outliers_iqr', {'column': 'price'}),
        ('detect_outliers_zscore', {'column': 'area'}),
    ]
    
    results = {}
    for func_name, params in tests:
        try:
            result, result_type, data_changed = executor.execute_function(
                housing_data, 'pandas', func_name, params
            )
            results[func_name] = result
            print(f"[OK] {func_name}: {result_type} - Success")
        except Exception as e:
            print(f"[FAIL] {func_name}: Failed - {e}")
            results[func_name] = None
    
    return results

def test_data_visualization(executor, housing_data):
    """Test data visualization functions"""
    print("\n=== Testing Data Visualization Functions ===")
    
    tests = [
        ('scatter_plot', {'x_column': 'area', 'y_column': 'price', 'title': 'Price vs Area'}),
        ('histogram', {'column': 'price', 'bins': 20}),
        ('box_plot', {'columns': 'price,area'}),
        ('heatmap', {'title': 'Housing Data Correlation'}),
    ]
    
    results = {}
    for func_name, params in tests:
        try:
            result, result_type, data_changed = executor.execute_function(
                housing_data, 'matplotlib', func_name, params
            )
            results[func_name] = result
            print(f"[OK] {func_name}: {result_type} - Success")
            if result and 'image_base64' in result:
                print(f"  Generated plot with base64 data")
        except Exception as e:
            print(f"[FAIL] {func_name}: Failed - {e}")
            results[func_name] = None
    
    return results

def validate_data_issues(housing_data):
    """Identify and report data quality issues in the housing dataset"""
    print("\n=== Data Quality Assessment ===")
    
    issues_found = []
    
    # Check for missing values
    null_counts = housing_data.isnull().sum()
    null_columns = null_counts[null_counts > 0]
    if len(null_columns) > 0:
        print(f"[ISSUE] Missing values found in {len(null_columns)} columns:")
        for col, count in null_columns.items():
            print(f"  {col}: {count} missing values")
        issues_found.append("missing_values")
    
    # Check for duplicates
    duplicates = housing_data.duplicated().sum()
    if duplicates > 0:
        print(f"[ISSUE] Found {duplicates} duplicate rows")
        issues_found.append("duplicates")
    
    # Check for inconsistent values
    categorical_cols = ['mainroad', 'guestroom', 'basement', 'hotwaterheating', 
                       'airconditioning', 'prefarea', 'furnishingstatus']
    
    for col in categorical_cols:
        if col in housing_data.columns:
            unique_vals = housing_data[col].dropna().unique()
            print(f"• {col}: {list(unique_vals)}")
            
            # Check for inconsistent capitalization
            if col == 'furnishingstatus':
                vals_lower = [str(v).lower() for v in unique_vals if pd.notna(v)]
                if len(set(vals_lower)) < len(unique_vals):
                    print(f"  [ISSUE] Inconsistent capitalization in {col}")
                    issues_found.append(f"inconsistent_{col}")
            
            # Check for yes/no variations
            if col in ['mainroad', 'guestroom', 'basement', 'hotwaterheating', 
                      'airconditioning', 'prefarea']:
                yes_variations = [v for v in unique_vals if str(v).lower() in ['yes', 'YES', 'YeS']]
                if len(yes_variations) > 1:
                    print(f"  [ISSUE] Inconsistent yes values in {col}: {yes_variations}")
                    issues_found.append(f"inconsistent_{col}")
    
    return issues_found

def main():
    """Main test function"""
    print("Testing pandas workflow with unclean_housing.csv")
    print("=" * 50)
    
    # Load the housing data
    housing_data = load_housing_data()
    if housing_data is None:
        return False
    
    # Validate data quality issues
    issues = validate_data_issues(housing_data)
    
    # Initialize executor
    executor = DataScienceExecutor()
    
    # Test different categories of functions
    inspection_results = test_data_inspection(executor, housing_data)
    cleaning_results = test_data_cleaning(executor, housing_data)
    analysis_results = test_data_analysis(executor, housing_data)
    viz_results = test_data_visualization(executor, housing_data)
    
    # Summary
    print("\n=== Test Summary ===")
    all_results = {
        'inspection': inspection_results,
        'cleaning': cleaning_results,
        'analysis': analysis_results,
        'visualization': viz_results,
        'data_issues': issues
    }
    
    total_tests = sum(len(r) for r in [inspection_results, cleaning_results, 
                                      analysis_results, viz_results])
    successful_tests = sum(1 for r in [inspection_results, cleaning_results, 
                                     analysis_results, viz_results] 
                          for v in r.values() if v is not None)
    
    print(f"Total tests: {total_tests}")
    print(f"Successful: {successful_tests}")
    print(f"Failed: {total_tests - successful_tests}")
    print(f"Success rate: {successful_tests/total_tests*100:.1f}%")
    
    # Save detailed results
    with open('housing_workflow_test_results.json', 'w') as f:
        # Convert non-serializable objects to strings
        serializable_results = {}
        for category, results in all_results.items():
            if category == 'data_issues':
                serializable_results[category] = results
            else:
                serializable_results[category] = {}
                for test_name, result in results.items():
                    if result is None:
                        serializable_results[category][test_name] = None
                    elif isinstance(result, dict) and 'image_base64' in result:
                        # For plots, just save metadata
                        serializable_results[category][test_name] = {
                            'plot_type': result.get('plot_type'),
                            'parameters': result.get('parameters'),
                            'has_image': 'image_base64' in result
                        }
                    else:
                        try:
                            json.dumps(result)  # Test if serializable
                            serializable_results[category][test_name] = result
                        except:
                            serializable_results[category][test_name] = str(result)[:500]
        
        json.dump(serializable_results, f, indent=2)
    
    print(f"\nDetailed results saved to: housing_workflow_test_results.json")
    
    return successful_tests == total_tests

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)