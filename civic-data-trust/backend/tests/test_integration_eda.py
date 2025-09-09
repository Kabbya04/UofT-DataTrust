import pytest
import os
import tempfile
import json
import pandas as pd
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

from app.main import app
from app.core.eda_executor import EDAExecutor
from app.services.cloudflare_service import CloudflareService
from app.services.file_packaging_service import FilePackagingService


class TestEDAIntegration:
    """End-to-end integration tests for the complete EDA system"""
    
    def setup_method(self):
        """Setup test environment"""
        self.client = TestClient(app)
        self.temp_dir = tempfile.mkdtemp()
        
        # Create realistic test dataset
        self.test_dataset = {
            'employees': [
                {'id': 1, 'name': 'Alice Johnson', 'age': 28, 'department': 'Engineering', 'salary': 75000, 'years_experience': 5},
                {'id': 2, 'name': 'Bob Smith', 'age': 34, 'department': 'Marketing', 'salary': 65000, 'years_experience': 8},
                {'id': 3, 'name': 'Carol Davis', 'age': 29, 'department': 'Engineering', 'salary': 80000, 'years_experience': 6},
                {'id': 4, 'name': 'David Wilson', 'age': 42, 'department': 'Sales', 'salary': 70000, 'years_experience': 12},
                {'id': 5, 'name': 'Eva Brown', 'age': 31, 'department': 'Engineering', 'salary': 85000, 'years_experience': 7},
                {'id': 6, 'name': 'Frank Miller', 'age': 38, 'department': 'Marketing', 'salary': 68000, 'years_experience': 10},
                {'id': 7, 'name': 'Grace Lee', 'age': 26, 'department': 'Sales', 'salary': 60000, 'years_experience': 3},
                {'id': 8, 'name': 'Henry Taylor', 'age': 45, 'department': 'Engineering', 'salary': 95000, 'years_experience': 15}
            ]
        }
        
        # Convert to CSV format
        df = pd.DataFrame(self.test_dataset['employees'])
        self.csv_content = df.to_csv(index=False)
    
    def teardown_method(self):
        """Cleanup test environment"""
        import shutil
        shutil.rmtree(self.temp_dir, ignore_errors=True)
    
    def test_complete_eda_workflow_basic(self):
        """Test complete EDA workflow with basic analysis"""
        request_data = {
            'node_id': 'integration-test-1',
            'workflow_type': 'basic_eda',
            'input_data': {
                'csv_content': self.csv_content,
                'filename': 'employee_data.csv'
            },
            'generate_download_link': True
        }
        
        with patch('app.services.cloudflare_service.CloudflareService.execute_complete_workflow') as mock_cf:
            mock_cf.return_value = {
                'success': True,
                'package_path': os.path.join(self.temp_dir, 'eda_results.zip'),
                'download_url': 'https://eda-results.example.com/download/basic_eda.zip',
                'wget_command': 'wget https://eda-results.example.com/download/basic_eda.zip',
                'colab_instructions': 'Download and extract in Google Colab'
            }
            
            response = self.client.post('/api/v1/eda-execute/', json=request_data)
            
            assert response.status_code == 200
            result = response.json()
            
            # Verify successful execution
            assert result['success'] is True
            assert result['workflow_type'] == 'basic_eda'
            
            # Verify all basic EDA functions were executed
            function_names = [step['function_name'] for step in result['results']]
            expected_functions = ['head', 'info', 'describe']
            assert all(func in function_names for func in expected_functions)
            
            # Verify download link generation
            assert result['download_url'] is not None
            assert result['colab_compatible'] is True
    
    def test_complete_eda_workflow_custom_chain(self):
        """Test complete EDA workflow with custom function chain"""
        custom_chain = [
            # Pandas: Data exploration
            {
                'id': 'step-1',
                'functionName': 'head',
                'category': 'Data Inspection',
                'library': 'pandas',
                'parameters': {'n': 5},
                'description': 'View first 5 rows'
            },
            {
                'id': 'step-2',
                'functionName': 'filter_rows',
                'category': 'Data Selection',
                'library': 'pandas',
                'parameters': {'column': 'department', 'operator': '==', 'value': 'Engineering'},
                'description': 'Filter Engineering employees'
            },
            # NumPy: Statistical analysis
            {
                'id': 'step-3',
                'functionName': 'mean',
                'category': 'Mathematical Operations',
                'library': 'numpy',
                'parameters': {'axis': 'None'},
                'description': 'Calculate mean salary'
            },
            # Matplotlib: Visualization
            {
                'id': 'step-4',
                'functionName': 'scatter_plot',
                'category': 'Basic Plots',
                'library': 'matplotlib',
                'parameters': {'x_column': 'age', 'y_column': 'salary'},
                'description': 'Age vs Salary scatter plot'
            },
            {
                'id': 'step-5',
                'functionName': 'histogram',
                'category': 'Basic Plots',
                'library': 'matplotlib',
                'parameters': {'column': 'years_experience', 'bins': 5},
                'description': 'Experience distribution'
            }
        ]
        
        request_data = {
            'node_id': 'integration-test-2',
            'workflow_type': 'custom',
            'function_chain': custom_chain,
            'input_data': {
                'csv_content': self.csv_content,
                'filename': 'employee_analysis.csv'
            },
            'generate_download_link': True
        }
        
        with patch('app.services.cloudflare_service.CloudflareService.execute_complete_workflow') as mock_cf:
            mock_cf.return_value = {
                'success': True,
                'package_path': os.path.join(self.temp_dir, 'custom_eda_results.zip'),
                'download_url': 'https://eda-results.example.com/download/custom_analysis.zip',
                'wget_command': 'wget https://eda-results.example.com/download/custom_analysis.zip'
            }
            
            response = self.client.post('/api/v1/eda-execute/', json=request_data)
            
            assert response.status_code == 200
            result = response.json()
            
            # Verify successful execution
            assert result['success'] is True
            assert len(result['results']) == 5
            
            # Verify library-specific results
            assert 'pandas_summary' in result
            assert 'numpy_summary' in result
            assert 'matplotlib_summary' in result
            
            # Verify data flow between libraries
            pandas_steps = [r for r in result['results'] if r.get('library') == 'pandas']
            numpy_steps = [r for r in result['results'] if r.get('library') == 'numpy']
            matplotlib_steps = [r for r in result['results'] if r.get('library') == 'matplotlib']
            
            assert len(pandas_steps) == 2
            assert len(numpy_steps) == 1
            assert len(matplotlib_steps) == 2
    
    def test_media_file_processing_workflow(self):
        """Test workflow with media files (skip EDA, go to packaging)"""
        media_request = {
            'node_id': 'integration-test-media',
            'input_data': {
                'file_content': 'mock_audio_binary_data',
                'filename': 'sample_audio.mp3',
                'file_type': 'audio/mpeg'
            },
            'workflow_type': 'auto_detect',
            'generate_download_link': True
        }
        
        with patch('app.core.file_detector.FileTypeDetector.detect_file_type') as mock_detect:
            mock_detect.return_value = 'MEDIA_AUDIO'
            
            with patch('app.services.cloudflare_service.CloudflareService.execute_complete_workflow') as mock_cf:
                mock_cf.return_value = {
                    'success': True,
                    'package_path': os.path.join(self.temp_dir, 'media_package.zip'),
                    'download_url': 'https://eda-results.example.com/download/media_package.zip',
                    'processing_skipped': True
                }
                
                response = self.client.post('/api/v1/eda-execute/', json=media_request)
                
                assert response.status_code == 200
                result = response.json()
                
                # Verify EDA was skipped
                assert result['file_type'] == 'MEDIA_AUDIO'
                assert result['processing_route'] == 'skip_to_packaging'
                assert result['eda_skipped'] is True
                assert result['download_url'] is not None
    
    def test_error_recovery_workflow(self):
        """Test error recovery in multi-library workflow"""
        error_prone_chain = [
            {
                'id': 'step-1',
                'functionName': 'head',
                'category': 'Data Inspection',
                'library': 'pandas',
                'parameters': {'n': 3},
                'description': 'Valid function'
            },
            {
                'id': 'step-2',
                'functionName': 'invalid_function',
                'category': 'Invalid',
                'library': 'pandas',
                'parameters': {},
                'description': 'This will fail'
            },
            {
                'id': 'step-3',
                'functionName': 'describe',
                'category': 'Data Inspection',
                'library': 'pandas',
                'parameters': {},
                'description': 'Should still execute'
            }
        ]
        
        request_data = {
            'node_id': 'integration-test-error',
            'workflow_type': 'custom',
            'function_chain': error_prone_chain,
            'input_data': {
                'csv_content': self.csv_content,
                'filename': 'error_test.csv'
            },
            'continue_on_error': True,
            'generate_download_link': True
        }
        
        response = self.client.post('/api/v1/eda-execute/', json=request_data)
        
        assert response.status_code == 200
        result = response.json()
        
        # Overall workflow should report partial success
        assert result['success'] is False  # Due to error
        assert len(result['results']) == 3
        
        # Check individual step results
        assert result['results'][0]['success'] is True   # First step succeeded
        assert result['results'][1]['success'] is False  # Second step failed
        assert result['results'][2]['success'] is True   # Third step succeeded (error recovery)
        
        # Should still generate package with partial results
        assert 'download_url' in result or 'partial_results' in result
    
    def test_large_dataset_end_to_end(self):
        """Test end-to-end workflow with large dataset"""
        # Generate larger dataset
        large_data = []
        for i in range(1000):
            large_data.append({
                'id': i,
                'value1': i * 2.5,
                'value2': i ** 0.5,
                'category': f'cat_{i % 10}',
                'timestamp': f'2024-01-{(i % 30) + 1:02d}'
            })
        
        large_df = pd.DataFrame(large_data)
        large_csv = large_df.to_csv(index=False)
        
        request_data = {
            'node_id': 'integration-test-large',
            'workflow_type': 'basic_eda',
            'input_data': {
                'csv_content': large_csv,
                'filename': 'large_dataset.csv'
            },
            'generate_download_link': True
        }
        
        response = self.client.post('/api/v1/eda-execute/', json=request_data)
        
        # Should handle large datasets (may take longer)
        assert response.status_code in [200, 413]  # Success or payload too large
        
        if response.status_code == 200:
            result = response.json()
            assert 'execution_time_ms' in result
            assert result['execution_time_ms'] > 0
    
    def test_concurrent_workflow_execution(self):
        """Test concurrent execution of multiple workflows"""
        import threading
        import time
        
        results = []
        
        def execute_workflow(workflow_id):
            request_data = {
                'node_id': f'concurrent-test-{workflow_id}',
                'workflow_type': 'basic_eda',
                'input_data': {
                    'csv_content': self.csv_content,
                    'filename': f'concurrent_data_{workflow_id}.csv'
                }
            }
            
            response = self.client.post('/api/v1/eda-execute/', json=request_data)
            results.append((workflow_id, response.status_code, response.json() if response.status_code == 200 else None))
        
        # Start multiple concurrent workflows
        threads = []
        for i in range(3):
            thread = threading.Thread(target=execute_workflow, args=(i,))
            threads.append(thread)
            thread.start()
        
        # Wait for all workflows
        for thread in threads:
            thread.join()
        
        # All workflows should complete
        assert len(results) == 3
        successful_results = [r for r in results if r[1] == 200]
        assert len(successful_results) >= 2  # At least 2 should succeed
    
    def test_colab_integration_workflow(self):
        """Test complete workflow optimized for Google Colab"""
        colab_request = {
            'node_id': 'colab-integration-test',
            'workflow_type': 'visualization_suite',
            'input_data': {
                'csv_content': self.csv_content,
                'filename': 'colab_analysis.csv'
            },
            'generate_download_link': True,
            'colab_optimized': True,
            'include_colab_notebook': True
        }
        
        with patch('app.services.cloudflare_service.CloudflareService.execute_complete_workflow') as mock_cf:
            mock_cf.return_value = {
                'success': True,
                'package_path': os.path.join(self.temp_dir, 'colab_package.zip'),
                'download_url': 'https://eda-results.example.com/download/colab_analysis.zip',
                'wget_command': 'wget https://eda-results.example.com/download/colab_analysis.zip',
                'colab_notebook_included': True,
                'colab_instructions': 'Detailed Colab setup instructions'
            }
            
            response = self.client.post('/api/v1/eda-execute/', json=colab_request)
            
            assert response.status_code == 200
            result = response.json()
            
            # Verify Colab-specific features
            assert result['colab_compatible'] is True
            assert result['wget_command'] is not None
            assert 'colab_instructions' in result
            assert result.get('colab_notebook_included') is True
    
    def test_performance_monitoring_integration(self):
        """Test performance monitoring throughout the workflow"""
        request_data = {
            'node_id': 'performance-test',
            'workflow_type': 'custom',
            'function_chain': [
                {
                    'id': 'perf-1',
                    'functionName': 'head',
                    'category': 'Data Inspection',
                    'library': 'pandas',
                    'parameters': {'n': 10},
                    'description': 'Performance test function'
                }
            ],
            'input_data': {
                'csv_content': self.csv_content,
                'filename': 'performance_test.csv'
            },
            'enable_performance_monitoring': True
        }
        
        response = self.client.post('/api/v1/eda-execute/', json=request_data)
        
        assert response.status_code == 200
        result = response.json()
        
        # Verify performance metrics
        assert 'total_execution_time_ms' in result
        assert result['total_execution_time_ms'] > 0
        
        # Check step-level performance
        for step_result in result['results']:
            assert 'execution_time_ms' in step_result
            assert step_result['execution_time_ms'] >= 0
        
        # Check for performance summary
        if 'performance_summary' in result:
            perf_summary = result['performance_summary']
            assert 'total_time_ms' in perf_summary
            assert 'average_step_time_ms' in perf_summary
    
    def test_security_validation_integration(self):
        """Test security validation throughout the workflow"""
        # Test with potentially malicious input
        malicious_request = {
            'node_id': '../../../malicious-node',
            'workflow_type': 'basic_eda',
            'input_data': {
                'csv_content': 'id,script\n1,<script>alert("xss")</script>',
                'filename': '../../../malicious.csv'
            }
        }
        
        response = self.client.post('/api/v1/eda-execute/', json=malicious_request)
        
        # Should handle malicious input gracefully
        assert response.status_code in [200, 400, 422]
        
        if response.status_code == 200:
            result = response.json()
            # Should sanitize node_id
            assert '../' not in result.get('node_id', '')
    
    def test_cleanup_and_resource_management(self):
        """Test proper cleanup and resource management"""
        request_data = {
            'node_id': 'cleanup-test',
            'workflow_type': 'basic_eda',
            'input_data': {
                'csv_content': self.csv_content,
                'filename': 'cleanup_test.csv'
            },
            'auto_cleanup': True
        }
        
        response = self.client.post('/api/v1/eda-execute/', json=request_data)
        
        assert response.status_code == 200
        result = response.json()
        
        # Verify cleanup information
        if 'cleanup_info' in result:
            cleanup_info = result['cleanup_info']
            assert 'temporary_files_cleaned' in cleanup_info
            assert 'memory_released_mb' in cleanup_info