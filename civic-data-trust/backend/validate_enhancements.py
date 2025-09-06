#!/usr/bin/env python3
"""
Validation script for matplotlib enhancements and research-grade functionality
"""

import sys
import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import io
import base64
from pathlib import Path

# Add the app directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

from app.core.executor import DataScienceExecutor
from app.core.data_validator import DataValidator, validate_dataframe_for_research


def test_matplotlib_configuration():
    """Test matplotlib research-grade configuration"""
    print("\n=== Testing Matplotlib Configuration ===")
    
    # Check DPI settings
    print(f"Figure DPI: {plt.rcParams['figure.dpi']}")
    print(f"Save DPI: {plt.rcParams['savefig.dpi']}")
    print(f"Font size: {plt.rcParams['font.size']}")
    print(f"Grid enabled: {plt.rcParams['axes.grid']}")
    
    # Verify research-grade settings
    assert plt.rcParams['figure.dpi'] == 300, "DPI should be 300 for research quality"
    assert plt.rcParams['savefig.dpi'] == 300, "Save DPI should be 300"
    assert plt.rcParams['axes.grid'] == True, "Grid should be enabled"
    
    print("✅ Matplotlib configuration meets research standards")
    return True


def test_data_validator():
    """Test data validation functionality"""
    print("\n=== Testing Data Validator ===")
    
    # Create test data similar to matplotlib_test_data.csv
    test_data = pd.DataFrame({
        'month': ['January', 'February', 'March', 'April'],
        'sales_revenue': [125000, 138000, 142000, 156000],
        'marketing_spend': [15000, 18000, 16500, 20000],
        'customer_count': [450, 520, 485, 580],
        'conversion_rate': [3.2, 3.8, 3.5, 4.1],
        'avg_order_value': [278.50, 265.38, 292.78, 268.97],
        'website_visits': [14062, 13684, 13857, 14146]
    })
    
    # Test validation
    validation_result = validate_dataframe_for_research(test_data)
    
    print(f"Validation passed: {validation_result['validation_passed']}")
    print(f"Total checks: {validation_result['total_checks']}")
    print(f"Warnings: {validation_result['warnings']}")
    print(f"Errors: {validation_result['errors']}")
    
    # Should pass validation for well-formed data
    assert validation_result['validation_passed'] == True, "Well-formed data should pass validation"
    
    print("✅ Data validator working correctly")
    return True


def test_enhanced_plotting_functions():
    """Test enhanced matplotlib plotting functions"""
    print("\n=== Testing Enhanced Plotting Functions ===")
    
    executor = DataScienceExecutor()
    
    # Create test data
    test_data = [
        {'month': 'Jan', 'sales': 1000, 'marketing': 200, 'customers': 50},
        {'month': 'Feb', 'sales': 1200, 'marketing': 250, 'customers': 60},
        {'month': 'Mar', 'sales': 1100, 'marketing': 220, 'customers': 55},
        {'month': 'Apr', 'sales': 1300, 'marketing': 280, 'customers': 65}
    ]
    
    # Test line plot with customization
    print("Testing enhanced line plot...")
    result, output_type, returns_data = executor.execute_matplotlib_function(
        test_data, 'line_plot', {
            'x_column': 'month',
            'y_column': 'sales',
            'title': 'Sales Trend Analysis',
            'color': 'red',
            'linewidth': 3,
            'marker': 'o'
        }
    )
    
    assert output_type == 'plot', "Should return plot type"
    assert result is not None, "Should return plot result"
    assert 'image_base64' in result, "Should contain base64 image"
    print("✅ Enhanced line plot working")
    
    # Test scatter plot with customization
    print("Testing enhanced scatter plot...")
    result, output_type, returns_data = executor.execute_matplotlib_function(
        test_data, 'scatter_plot', {
            'x_column': 'marketing',
            'y_column': 'sales',
            'title': 'Marketing ROI Analysis',
            'color': 'green',
            'size': 100,
            'alpha': 0.8
        }
    )
    
    assert output_type == 'plot', "Should return plot type"
    assert result is not None, "Should return plot result"
    print("✅ Enhanced scatter plot working")
    
    # Test new plot types
    print("Testing bar plot...")
    result, output_type, returns_data = executor.execute_matplotlib_function(
        test_data, 'bar_plot', {
            'x_column': 'month',
            'y_column': 'customers',
            'title': 'Customer Growth',
            'color': 'purple'
        }
    )
    
    assert output_type == 'plot', "Should return plot type"
    assert result is not None, "Should return plot result"
    print("✅ Bar plot working")
    
    # Test box plot
    print("Testing box plot...")
    result, output_type, returns_data = executor.execute_matplotlib_function(
        test_data, 'box_plot', {
            'columns': 'sales,marketing',
            'title': 'Revenue Distribution Analysis'
        }
    )
    
    assert output_type == 'plot', "Should return plot type"
    assert result is not None, "Should return plot result"
    print("✅ Box plot working")
    
    # Test heatmap
    print("Testing correlation heatmap...")
    result, output_type, returns_data = executor.execute_matplotlib_function(
        test_data, 'heatmap', {
            'title': 'Business Metrics Correlation',
            'colormap': 'viridis'
        }
    )
    
    assert output_type == 'plot', "Should return plot type"
    assert result is not None, "Should return plot result"
    print("✅ Heatmap working")
    
    return True


def test_data_compatibility():
    """Test compatibility with matplotlib_test_data.csv format"""
    print("\n=== Testing Data Compatibility ===")
    
    # Check if the test data file exists
    test_file_path = Path('../public/matplotlib_test_data.csv')
    if test_file_path.exists():
        print(f"Found test data file: {test_file_path}")
        
        # Load and validate the actual test data
        df = pd.read_csv(test_file_path)
        print(f"Loaded {len(df)} rows, {len(df.columns)} columns")
        print(f"Columns: {list(df.columns)}")
        
        # Validate the data
        validation_result = validate_dataframe_for_research(df)
        print(f"Validation result: {validation_result['validation_passed']}")
        
        if validation_result['warnings'] > 0:
            print(f"⚠️ {validation_result['warnings']} warnings found")
        
        if validation_result['errors'] > 0:
            print(f"❌ {validation_result['errors']} errors found")
        
        # Test plotting with actual data
        executor = DataScienceExecutor()
        data_dict = df.to_dict('records')
        
        # Test a simple plot
        result, output_type, returns_data = executor.execute_matplotlib_function(
            data_dict, 'line_plot', {
                'x_column': 'month',
                'y_column': 'sales_revenue',
                'title': 'Monthly Sales Revenue'
            }
        )
        
        assert output_type == 'plot', "Should successfully create plot from test data"
        print("✅ Successfully created plot from test data")
        
    else:
        print(f"⚠️ Test data file not found at {test_file_path}")
        print("Creating synthetic test data for validation...")
        
        # Create synthetic data matching the expected format
        months = ['January', 'February', 'March', 'April', 'May', 'June',
                 'July', 'August', 'September', 'October', 'November', 'December']
        
        synthetic_data = pd.DataFrame({
            'month': months,
            'sales_revenue': np.random.randint(100000, 250000, 12),
            'marketing_spend': np.random.randint(10000, 30000, 12),
            'customer_count': np.random.randint(400, 900, 12),
            'conversion_rate': np.random.uniform(3.0, 5.5, 12),
            'avg_order_value': np.random.uniform(250, 300, 12),
            'website_visits': np.random.randint(13000, 17000, 12)
        })
        
        validation_result = validate_dataframe_for_research(synthetic_data)
        print(f"Synthetic data validation: {validation_result['validation_passed']}")
        
    print("✅ Data compatibility testing completed")
    return True


def test_research_quality_output():
    """Test research-quality output generation"""
    print("\n=== Testing Research Quality Output ===")
    
    executor = DataScienceExecutor()
    
    # Create test data
    test_data = [
        {'x': i, 'y': i**2 + np.random.normal(0, 10)} 
        for i in range(20)
    ]
    
    # Generate plot with research settings
    result, output_type, returns_data = executor.execute_matplotlib_function(
        test_data, 'scatter_plot', {
            'x_column': 'x',
            'y_column': 'y',
            'title': 'Research Quality Test Plot'
        }
    )
    
    assert result is not None, "Should generate plot result"
    
    # Check image quality
    image_data = base64.b64decode(result['image_base64'])
    image_size = len(image_data)
    
    print(f"Generated image size: {image_size} bytes")
    
    # Research-quality images should be substantial in size due to high DPI
    assert image_size > 30000, f"Image size ({image_size}) too small for research quality"
    
    # Check metadata
    assert 'python_version' in result, "Should include Python version info"
    assert 'optimizations_used' in result, "Should include optimization info"
    
    print("✅ Research quality output verified")
    return True


def main():
    """Run all validation tests"""
    print("🔬 Matplotlib Research Enhancement Validation")
    print("=" * 50)
    
    tests = [
        test_matplotlib_configuration,
        test_data_validator,
        test_enhanced_plotting_functions,
        test_data_compatibility,
        test_research_quality_output
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"❌ Test {test.__name__} failed: {str(e)}")
            failed += 1
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed} passed, {failed} failed")
    
    if failed == 0:
        print("🎉 All enhancements validated successfully!")
        print("\n✅ Platform ready for research-grade analytics")
        return True
    else:
        print(f"⚠️ {failed} tests failed - review implementation")
        return False


if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)