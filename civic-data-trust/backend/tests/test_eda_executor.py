import pytest
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import base64
import io
import json
from unittest.mock import patch, MagicMock
from typing import Dict, Any, List

from app.core.eda_executor import EDAExecutor
from app.models.requests import FunctionStep
from app.data.sample_data import SAMPLE_DATA


class TestEDAExecutor:
    """Comprehensive test suite for EDA (Exploratory Data Analysis) executor"""
    
    def setup_method(self):
        """Setup test environment before each test"""
        self.executor = EDAExecutor()
        
        # Sample test data for multi-library operations
        self.test_data = [
            {'id': 1, 'name': 'Alice', 'age': 25, 'salary': 50000, 'department': 'Engineering'},
            {'id': 2, 'name': 'Bob', 'age': 30, 'salary': 60000, 'department': 'Marketing'},
            {'id': 3, 'name': 'Charlie', 'age': 35, 'salary': 70000, 'department': 'Engineering'},
            {'id': 4, 'name': 'Diana', 'age': 28, 'salary': 55000, 'department': 'Sales'},
            {'id': 5, 'name': 'Eve', 'age': 32, 'salary': 65000, 'department': 'Engineering'}
        ]
        
        # Sample function chains for testing
        self.pandas_chain = [
            FunctionStep(
                id="step-1",
                functionName="head",
                category="Data Inspection",
                parameters={"n": 3},
                description="Get first 3 rows"
            ),
            FunctionStep(
                id="step-2",
                functionName="describe",
                category="Data Inspection",
                parameters={"include": "number"},
                description="Statistical summary"
            )
        ]
        
        self.numpy_chain = [
            FunctionStep(
                id="step-3",
                functionName="mean",
                category="Mathematical Operations",
                parameters={"axis": "None"},
                description="Calculate mean"
            )
        ]
        
        self.matplotlib_chain = [
            FunctionStep(
                id="step-4",
                functionName="histogram",
                category="Basic Plots",
                parameters={"column": "age", "bins": 5},
                description="Age distribution"
            )
        ]
    
    def test_sequential_multi_library_execution(self):
        """Test sequential execution: pandas → numpy → matplotlib"""
        # Execute pandas chain first
        pandas_result = self.executor.execute_function_chain(
            data=self.test_data,
            function_chain=self.pandas_chain
        )
        
        assert pandas_result['success'] is True
        assert len(pandas_result['results']) == 2
        assert pandas_result['final_output'] is not None
        
        # Use pandas result for numpy operations
        numpy_result = self.executor.execute_function_chain(
            data=pandas_result['final_output'],
            function_chain=self.numpy_chain
        )
        
        assert numpy_result['success'] is True
        assert len(numpy_result['results']) == 1
        
        # Use original data for matplotlib (visualization)
        matplotlib_result = self.executor.execute_function_chain(
            data=self.test_data,
            function_chain=self.matplotlib_chain
        )
        
        assert matplotlib_result['success'] is True
        assert matplotlib_result['results'][0]['output_type'] == 'plot'
        assert 'image_base64' in matplotlib_result['final_output']
    
    def test_unified_eda_pipeline_execution(self):
        """Test unified EDA pipeline with all three libraries"""
        unified_chain = self.pandas_chain + self.numpy_chain + self.matplotlib_chain
        
        result = self.executor.execute_unified_eda_pipeline(
            data=self.test_data,
            function_chain=unified_chain
        )
        
        assert result['success'] is True
        assert len(result['results']) == 4
        assert result['pandas_results'] is not None
        assert result['numpy_results'] is not None
        assert result['matplotlib_results'] is not None
        assert result['execution_summary']['total_libraries'] == 3
    
    def test_error_recovery_in_chain(self):
        """Test error recovery when one function fails"""
        # Create chain with invalid function
        error_chain = [
            FunctionStep(
                id="step-1",
                functionName="head",
                category="Data Inspection",
                parameters={"n": 3},
                description="Valid function"
            ),
            FunctionStep(
                id="step-2",
                functionName="invalid_function",
                category="Data Inspection",
                parameters={},
                description="Invalid function"
            ),
            FunctionStep(
                id="step-3",
                functionName="describe",
                category="Data Inspection",
                parameters={},
                description="Should still execute"
            )
        ]
        
        result = self.executor.execute_function_chain(
            data=self.test_data,
            function_chain=error_chain,
            continue_on_error=True
        )
        
        assert result['success'] is False  # Overall failure due to error
        assert len(result['results']) == 3
        assert result['results'][0]['success'] is True
        assert result['results'][1]['success'] is False
        assert result['results'][2]['success'] is True  # Continued execution
    
    def test_data_flow_validation(self):
        """Test data flow between functions in chain"""
        # Chain where second function needs data from first
        data_flow_chain = [
            FunctionStep(
                id="step-1",
                functionName="filter_rows",
                category="Data Selection",
                parameters={"column": "age", "operator": ">", "value": "30"},
                description="Filter adults"
            ),
            FunctionStep(
                id="step-2",
                functionName="select_columns",
                category="Data Selection",
                parameters={"columns": "name,salary"},
                description="Select specific columns"
            )
        ]
        
        result = self.executor.execute_function_chain(
            data=self.test_data,
            function_chain=data_flow_chain
        )
        
        assert result['success'] is True
        assert len(result['results']) == 2
        
        # Verify data flow: second function should receive filtered data
        final_data = result['final_output']
        assert len(final_data) < len(self.test_data)  # Should be filtered
        assert all('name' in row and 'salary' in row for row in final_data)
    
    def test_predefined_eda_workflows(self):
        """Test predefined EDA workflow execution"""
        # Test Basic EDA workflow
        basic_eda_result = self.executor.execute_predefined_workflow(
            data=self.test_data,
            workflow_type="basic_eda"
        )
        
        assert basic_eda_result['success'] is True
        assert 'head' in [step['function_name'] for step in basic_eda_result['results']]
        assert 'info' in [step['function_name'] for step in basic_eda_result['results']]
        assert 'describe' in [step['function_name'] for step in basic_eda_result['results']]
        
        # Test Data Cleaning workflow
        cleaning_result = self.executor.execute_predefined_workflow(
            data=self.test_data,
            workflow_type="data_cleaning"
        )
        
        assert cleaning_result['success'] is True
        expected_functions = ['dropna', 'drop_duplicates', 'describe']
        result_functions = [step['function_name'] for step in cleaning_result['results']]
        assert all(func in result_functions for func in expected_functions)
    
    def test_performance_monitoring(self):
        """Test performance monitoring and caching"""
        # Execute same chain twice to test caching
        result1 = self.executor.execute_function_chain(
            data=self.test_data,
            function_chain=self.pandas_chain
        )
        
        result2 = self.executor.execute_function_chain(
            data=self.test_data,
            function_chain=self.pandas_chain
        )
        
        assert result1['success'] is True
        assert result2['success'] is True
        
        # Check performance cache
        assert len(self.executor._performance_cache) > 0
        
        # Second execution should be faster (cached)
        assert result2['total_execution_time_ms'] <= result1['total_execution_time_ms']
    
    def test_memory_management(self):
        """Test memory management with large datasets"""
        # Create larger dataset
        large_data = []
        for i in range(1000):
            large_data.append({
                'id': i,
                'value1': np.random.rand(),
                'value2': np.random.rand(),
                'category': f'cat_{i % 10}'
            })
        
        result = self.executor.execute_function_chain(
            data=large_data,
            function_chain=self.pandas_chain
        )
        
        assert result['success'] is True
        assert result['memory_usage'] is not None
        assert result['memory_usage']['peak_mb'] > 0
    
    def test_concurrent_execution_safety(self):
        """Test thread safety for concurrent executions"""
        import threading
        import time
        
        results = []
        
        def execute_chain():
            result = self.executor.execute_function_chain(
                data=self.test_data,
                function_chain=self.pandas_chain
            )
            results.append(result)
        
        # Start multiple threads
        threads = []
        for _ in range(3):
            thread = threading.Thread(target=execute_chain)
            threads.append(thread)
            thread.start()
        
        # Wait for all threads to complete
        for thread in threads:
            thread.join()
        
        # All executions should succeed
        assert len(results) == 3
        assert all(result['success'] for result in results)
    
    def test_parameter_validation(self):
        """Test parameter validation for function chains"""
        # Invalid parameter type
        invalid_chain = [
            FunctionStep(
                id="step-1",
                functionName="head",
                category="Data Inspection",
                parameters={"n": "invalid"},  # Should be number
                description="Invalid parameter"
            )
        ]
        
        result = self.executor.execute_function_chain(
            data=self.test_data,
            function_chain=invalid_chain
        )
        
        assert result['success'] is False
        assert 'parameter validation' in result['results'][0]['error'].lower()
    
    def test_output_format_consistency(self):
        """Test consistent output format across all functions"""
        result = self.executor.execute_function_chain(
            data=self.test_data,
            function_chain=self.pandas_chain
        )
        
        # Check required fields in response
        required_fields = ['success', 'results', 'final_output', 'total_execution_time_ms']
        assert all(field in result for field in required_fields)
        
        # Check step result format
        for step_result in result['results']:
            step_fields = ['step_id', 'function_name', 'success', 'execution_time_ms', 'output_type']
            assert all(field in step_result for field in step_fields)