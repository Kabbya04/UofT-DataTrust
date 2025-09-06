import pytest
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import base64
import io
from unittest.mock import patch, MagicMock

from app.core.executor import DataScienceExecutor
from app.data.sample_data import SAMPLE_DATA


class TestMatplotlibResearchCapabilities:
    """Comprehensive test suite for matplotlib research-grade functionality"""
    
    def setup_method(self):
        """Setup test environment before each test"""
        self.executor = DataScienceExecutor()
        # Load the matplotlib test data
        self.test_data = pd.read_csv('public/matplotlib_test_data.csv')
        
    def test_matplotlib_configuration(self):
        """Test that matplotlib is configured for research-grade output"""
        # Check DPI settings
        assert plt.rcParams['figure.dpi'] == 300
        assert plt.rcParams['savefig.dpi'] == 300
        
        # Check font settings
        assert plt.rcParams['font.size'] == 12
        assert plt.rcParams['axes.titlesize'] == 16
        assert plt.rcParams['axes.labelsize'] == 14
        
        # Check grid and spine settings
        assert plt.rcParams['axes.grid'] == True
        assert plt.rcParams['grid.alpha'] == 0.3
        assert plt.rcParams['axes.spines.top'] == False
        assert plt.rcParams['axes.spines.right'] == False
        
    def test_line_plot_functionality(self):
        """Test line plot creation with research data"""
        data_dict = self.test_data.to_dict('records')
        
        result, output_type, returns_data = self.executor.execute_matplotlib_function(
            data_dict, 'line_plot', {
                'x_column': 'month',
                'y_column': 'sales_revenue',
                'title': 'Sales Revenue Trend'
            }
        )
        
        assert output_type == 'plot'
        assert returns_data == False
        assert result is not None
        assert 'image_base64' in result
        assert result['plot_type'] == 'line_plot'
        
        # Verify base64 image can be decoded
        image_data = base64.b64decode(result['image_base64'])
        assert len(image_data) > 0
        
    def test_scatter_plot_functionality(self):
        """Test scatter plot creation with correlation analysis"""
        data_dict = self.test_data.to_dict('records')
        
        result, output_type, returns_data = self.executor.execute_matplotlib_function(
            data_dict, 'scatter_plot', {
                'x_column': 'marketing_spend',
                'y_column': 'sales_revenue',
                'title': 'Marketing Spend vs Sales Revenue'
            }
        )
        
        assert output_type == 'plot'
        assert result is not None
        assert 'image_base64' in result
        assert result['plot_type'] == 'scatter_plot'
        
    def test_histogram_functionality(self):
        """Test histogram creation for distribution analysis"""
        data_dict = self.test_data.to_dict('records')
        
        result, output_type, returns_data = self.executor.execute_matplotlib_function(
            data_dict, 'histogram', {
                'column': 'conversion_rate',
                'bins': 20,
                'color': 'lightblue'
            }
        )
        
        assert output_type == 'plot'
        assert result is not None
        assert 'image_base64' in result
        assert result['parameters']['bins'] == 20
        assert result['parameters']['color'] == 'lightblue'
        
    def test_bar_plot_functionality(self):
        """Test bar plot creation for categorical analysis"""
        # Create a subset for better visualization
        subset_data = self.test_data.head(6).to_dict('records')
        
        result, output_type, returns_data = self.executor.execute_matplotlib_function(
            subset_data, 'bar_plot', {
                'x_column': 'month',
                'y_column': 'customer_count',
                'title': 'Customer Count by Month',
                'color': 'steelblue'
            }
        )
        
        assert output_type == 'plot'
        assert result is not None
        assert 'image_base64' in result
        assert result['plot_type'] == 'bar_plot'
        
    def test_box_plot_functionality(self):
        """Test box plot for statistical distribution analysis"""
        data_dict = self.test_data.to_dict('records')
        
        result, output_type, returns_data = self.executor.execute_matplotlib_function(
            data_dict, 'box_plot', {
                'columns': 'sales_revenue,marketing_spend,avg_order_value',
                'title': 'Revenue Metrics Distribution'
            }
        )
        
        assert output_type == 'plot'
        assert result is not None
        assert 'image_base64' in result
        assert result['plot_type'] == 'box_plot'
        
    def test_heatmap_functionality(self):
        """Test correlation heatmap for research analysis"""
        data_dict = self.test_data.to_dict('records')
        
        result, output_type, returns_data = self.executor.execute_matplotlib_function(
            data_dict, 'heatmap', {
                'title': 'Sales Metrics Correlation Matrix',
                'colormap': 'coolwarm'
            }
        )
        
        assert output_type == 'plot'
        assert result is not None
        assert 'image_base64' in result
        assert result['plot_type'] == 'heatmap'
        
    def test_violin_plot_functionality(self):
        """Test violin plot for advanced distribution visualization"""
        data_dict = self.test_data.to_dict('records')
        
        result, output_type, returns_data = self.executor.execute_matplotlib_function(
            data_dict, 'violin_plot', {
                'y_column': 'conversion_rate',
                'title': 'Conversion Rate Distribution'
            }
        )
        
        assert output_type == 'plot'
        assert result is not None
        assert 'image_base64' in result
        assert result['plot_type'] == 'violin_plot'
        
    def test_pair_plot_functionality(self):
        """Test pair plot for comprehensive relationship analysis"""
        data_dict = self.test_data.to_dict('records')
        
        result, output_type, returns_data = self.executor.execute_matplotlib_function(
            data_dict, 'pair_plot', {
                'title': 'Sales Metrics Relationships'
            }
        )
        
        assert output_type == 'plot'
        assert result is not None
        assert 'image_base64' in result
        assert result['plot_type'] == 'pair_plot'
        
    def test_error_handling_invalid_column(self):
        """Test error handling for invalid column names"""
        data_dict = self.test_data.to_dict('records')
        
        result, output_type, returns_data = self.executor.execute_matplotlib_function(
            data_dict, 'line_plot', {
                'x_column': 'invalid_column',
                'y_column': 'sales_revenue',
                'title': 'Test Plot'
            }
        )
        
        assert output_type == 'error'
        assert result is None
        assert returns_data == False
        
    def test_error_handling_empty_data(self):
        """Test error handling for empty datasets"""
        empty_data = []
        
        result, output_type, returns_data = self.executor.execute_matplotlib_function(
            empty_data, 'histogram', {
                'column': 'sales_revenue'
            }
        )
        
        assert output_type == 'error'
        assert result is None
        
    def test_performance_monitoring(self):
        """Test performance monitoring for research workloads"""
        data_dict = self.test_data.to_dict('records')
        
        # Clear performance cache
        self.executor._performance_cache = {}
        
        result, output_type, returns_data = self.executor.execute_matplotlib_function(
            data_dict, 'scatter_plot', {
                'x_column': 'marketing_spend',
                'y_column': 'sales_revenue',
                'title': 'Performance Test'
            }
        )
        
        assert output_type == 'plot'
        assert result is not None
        
        # Check if performance data includes optimization info
        assert 'python_version' in result
        assert 'optimizations_used' in result
        
    def test_data_compatibility_csv_format(self):
        """Test compatibility with matplotlib_test_data.csv format"""
        # Verify all expected columns are present
        expected_columns = [
            'month', 'sales_revenue', 'marketing_spend', 'customer_count',
            'conversion_rate', 'avg_order_value', 'website_visits'
        ]
        
        for col in expected_columns:
            assert col in self.test_data.columns, f"Missing column: {col}"
            
        # Verify data types are appropriate for analysis
        numeric_columns = [
            'sales_revenue', 'marketing_spend', 'customer_count',
            'conversion_rate', 'avg_order_value', 'website_visits'
        ]
        
        for col in numeric_columns:
            assert pd.api.types.is_numeric_dtype(self.test_data[col]), f"Column {col} should be numeric"
            
        # Verify no missing values in critical columns
        assert not self.test_data[numeric_columns].isnull().any().any(), "Missing values found in numeric columns"
        
    def test_research_quality_output(self):
        """Test that output meets research publication standards"""
        data_dict = self.test_data.to_dict('records')
        
        result, output_type, returns_data = self.executor.execute_matplotlib_function(
            data_dict, 'line_plot', {
                'x_column': 'month',
                'y_column': 'sales_revenue',
                'title': 'Research Quality Test'
            }
        )
        
        # Verify high-resolution output
        image_data = base64.b64decode(result['image_base64'])
        
        # Check image size (should be substantial for 300 DPI)
        assert len(image_data) > 50000, "Image file size too small for research quality"
        
        # Verify metadata includes quality indicators
        assert result['python_version'] is not None
        assert 'parameters' in result
        
    @pytest.mark.parametrize("plot_type,params", [
        ('line_plot', {'x_column': 'month', 'y_column': 'sales_revenue', 'title': 'Test'}),
        ('scatter_plot', {'x_column': 'marketing_spend', 'y_column': 'sales_revenue', 'title': 'Test'}),
        ('histogram', {'column': 'conversion_rate', 'bins': 25}),
        ('bar_plot', {'x_column': 'month', 'y_column': 'customer_count', 'title': 'Test'}),
        ('box_plot', {'columns': 'sales_revenue,marketing_spend', 'title': 'Test'}),
        ('heatmap', {'title': 'Test Heatmap'}),
        ('violin_plot', {'y_column': 'avg_order_value', 'title': 'Test'})
    ])
    def test_all_plot_types_with_test_data(self, plot_type, params):
        """Parametrized test for all plot types with test data"""
        data_dict = self.test_data.to_dict('records')
        
        result, output_type, returns_data = self.executor.execute_matplotlib_function(
            data_dict, plot_type, params
        )
        
        assert output_type == 'plot'
        assert result is not None
        assert 'image_base64' in result
        assert result['plot_type'] == plot_type
        
        # Verify image can be decoded
        image_data = base64.b64decode(result['image_base64'])
        assert len(image_data) > 0


class TestIntegrationWithTestData:
    """Integration tests using the actual matplotlib_test_data.csv"""
    
    def setup_method(self):
        """Setup integration test environment"""
        self.executor = DataScienceExecutor()
        
    def test_full_workflow_with_test_data(self):
        """Test complete workflow from CSV to visualization"""
        # Simulate CSV upload
        with open('public/matplotlib_test_data.csv', 'r') as f:
            csv_content = f.read()
            
        # Initialize data from CSV content
        input_data = {'csv_content': csv_content}
        data = self.executor.initialize_data(input_data)
        
        assert isinstance(data, pd.DataFrame)
        assert len(data) == 12  # 12 months of data
        
        # Test data processing chain
        data_dict = data.to_dict('records')
        
        # Create multiple visualizations
        plots = []
        
        # Revenue trend analysis
        result1, _, _ = self.executor.execute_matplotlib_function(
            data_dict, 'line_plot', {
                'x_column': 'month',
                'y_column': 'sales_revenue',
                'title': 'Monthly Sales Revenue Trend'
            }
        )
        plots.append(result1)
        
        # Marketing effectiveness analysis
        result2, _, _ = self.executor.execute_matplotlib_function(
            data_dict, 'scatter_plot', {
                'x_column': 'marketing_spend',
                'y_column': 'sales_revenue',
                'title': 'Marketing ROI Analysis'
            }
        )
        plots.append(result2)
        
        # Distribution analysis
        result3, _, _ = self.executor.execute_matplotlib_function(
            data_dict, 'box_plot', {
                'columns': 'sales_revenue,marketing_spend,avg_order_value',
                'title': 'Key Metrics Distribution'
            }
        )
        plots.append(result3)
        
        # Correlation analysis
        result4, _, _ = self.executor.execute_matplotlib_function(
            data_dict, 'heatmap', {
                'title': 'Business Metrics Correlation Matrix',
                'colormap': 'viridis'
            }
        )
        plots.append(result4)
        
        # Verify all plots were generated successfully
        for plot in plots:
            assert plot is not None
            assert 'image_base64' in plot
            assert len(base64.b64decode(plot['image_base64'])) > 0
            
        # Verify research-grade quality
        for plot in plots:
            image_size = len(base64.b64decode(plot['image_base64']))
            assert image_size > 30000, f"Plot quality insufficient: {image_size} bytes"
            
    def test_research_analytics_workflow(self):
        """Test advanced analytics workflow for research purposes"""
        # Load test data
        with open('public/matplotlib_test_data.csv', 'r') as f:
            csv_content = f.read()
            
        input_data = {'csv_content': csv_content}
        data = self.executor.initialize_data(input_data)
        data_dict = data.to_dict('records')
        
        # Advanced statistical analysis workflow
        
        # 1. Trend analysis with multiple metrics
        trend_result, _, _ = self.executor.execute_matplotlib_function(
            data_dict, 'line_plot', {
                'x_column': 'month',
                'y_column': 'conversion_rate',
                'title': 'Conversion Rate Optimization Trend'
            }
        )
        
        # 2. Distribution analysis for outlier detection
        dist_result, _, _ = self.executor.execute_matplotlib_function(
            data_dict, 'violin_plot', {
                'y_column': 'website_visits',
                'title': 'Website Traffic Distribution Analysis'
            }
        )
        
        # 3. Comprehensive relationship analysis
        pair_result, _, _ = self.executor.execute_matplotlib_function(
            data_dict, 'pair_plot', {
                'title': 'Comprehensive Business Metrics Analysis'
            }
        )
        
        # Verify research-quality outputs
        results = [trend_result, dist_result, pair_result]
        
        for result in results:
            assert result is not None
            assert 'python_version' in result
            assert 'optimizations_used' in result
            
            # Verify high-quality image output
            image_data = base64.b64decode(result['image_base64'])
            assert len(image_data) > 40000, "Research-grade image quality not met"


if __name__ == '__main__':
    pytest.main([__file__, '-v'])