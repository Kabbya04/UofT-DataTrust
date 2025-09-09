import pytest
import json
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from typing import Dict, Any, List

from app.main import app
from app.models.requests import EDAExecutionRequest, FunctionStep
from app.models.responses import EDAExecutionResponse


class TestEDAAPI:
    """Test suite for unified EDA API endpoint"""
    
    def setup_method(self):
        """Setup test environment"""
        self.client = TestClient(app)
        
        # Sample test data
        self.test_data = {
            'csv_content': 'id,name,age,salary\n1,Alice,25,50000\n2,Bob,30,60000\n3,Charlie,35,70000',
            'filename': 'test_data.csv'
        }
        
        # Sample multi-library function chain
        self.multi_library_chain = [
            # Pandas functions
            {
                'id': 'step-1',
                'functionName': 'head',
                'category': 'Data Inspection',
                'library': 'pandas',
                'parameters': {'n': 3},
                'description': 'Get first 3 rows'
            },
            {
                'id': 'step-2',
                'functionName': 'describe',
                'category': 'Data Inspection',
                'library': 'pandas',
                'parameters': {'include': 'number'},
                'description': 'Statistical summary'
            },
            # NumPy functions
            {
                'id': 'step-3',
                'functionName': 'mean',
                'category': 'Mathematical Operations',
                'library': 'numpy',
                'parameters': {'axis': 'None'},
                'description': 'Calculate mean'
            },
            # Matplotlib functions
            {
                'id': 'step-4',
                'functionName': 'histogram',
                'category': 'Basic Plots',
                'library': 'matplotlib',
                'parameters': {'column': 'age', 'bins': 5},
                'description': 'Age distribution'
            }
        ]
    
    def test_eda_execute_endpoint_exists(self):
        """Test that the EDA execute endpoint exists"""
        response = self.client.post('/api/v1/eda-execute/', json={})
        
        # Should not return 404 (endpoint exists)
        assert response.status_code != 404
    
    def test_multi_library_execution_success(self):
        """Test successful multi-library function chain execution"""
        request_data = {
            'node_id': 'eda-node-1',
            'function_chain': self.multi_library_chain,
            'input_data': self.test_data,
            'workflow_type': 'custom',
            'generate_download_link': True
        }
        
        with patch('app.core.eda_executor.EDAExecutor.execute_unified_eda_pipeline') as mock_execute:
            mock_execute.return_value = {
                'success': True,
                'execution_id': 'test_exec_123',
                'results': [
                    {
                        'step_id': 'step-1',
                        'function_name': 'head',
                        'library': 'pandas',
                        'success': True,
                        'result': [{'id': 1, 'name': 'Alice', 'age': 25}],
                        'execution_time_ms': 50,
                        'output_type': 'data'
                    },
                    {
                        'step_id': 'step-4',
                        'function_name': 'histogram',
                        'library': 'matplotlib',
                        'success': True,
                        'result': {'image_base64': 'mock_base64_image'},
                        'execution_time_ms': 200,
                        'output_type': 'plot'
                    }
                ],
                'pandas_results': {'processed_data': []},
                'numpy_results': {'calculations': []},
                'matplotlib_results': {'visualizations': []},
                'total_execution_time_ms': 1500,
                'download_url': 'https://eda-results.example.com/download/package.zip'
            }
            
            response = self.client.post('/api/v1/eda-execute/', json=request_data)
            
            assert response.status_code == 200
            result = response.json()
            
            assert result['success'] is True
            assert result['execution_id'] == 'test_exec_123'
            assert len(result['results']) == 2
            assert result['download_url'] is not None
            assert 'pandas_summary' in result
            assert 'numpy_summary' in result
            assert 'matplotlib_summary' in result
    
    def test_predefined_workflow_execution(self):
        """Test predefined workflow execution"""
        request_data = {
            'node_id': 'eda-node-2',
            'workflow_type': 'basic_eda',
            'input_data': self.test_data,
            'generate_download_link': True
        }
        
        with patch('app.core.eda_executor.EDAExecutor.execute_predefined_workflow') as mock_execute:
            mock_execute.return_value = {
                'success': True,
                'execution_id': 'predefined_exec_456',
                'workflow_type': 'basic_eda',
                'results': [
                    {'function_name': 'head', 'success': True},
                    {'function_name': 'info', 'success': True},
                    {'function_name': 'describe', 'success': True},
                    {'function_name': 'heatmap', 'success': True}
                ],
                'total_execution_time_ms': 2000
            }
            
            response = self.client.post('/api/v1/eda-execute/', json=request_data)
            
            assert response.status_code == 200
            result = response.json()
            
            assert result['success'] is True
            assert result['workflow_type'] == 'basic_eda'
            assert len(result['results']) == 4
    
    def test_file_type_detection_routing(self):
        """Test file type detection and routing"""
        # Test with tabular data
        tabular_request = {
            'node_id': 'eda-node-3',
            'input_data': self.test_data,
            'workflow_type': 'auto_detect'
        }
        
        with patch('app.core.file_detector.FileTypeDetector.detect_file_type') as mock_detect:
            mock_detect.return_value = 'TABULAR_CSV'
            
            response = self.client.post('/api/v1/eda-execute/', json=tabular_request)
            
            assert response.status_code == 200
            result = response.json()
            assert result['file_type'] == 'TABULAR_CSV'
            assert result['processing_route'] == 'eda_pipeline'
        
        # Test with media file
        media_request = {
            'node_id': 'eda-node-4',
            'input_data': {
                'file_content': 'mock_audio_data',
                'filename': 'test_audio.mp3'
            },
            'workflow_type': 'auto_detect'
        }
        
        with patch('app.core.file_detector.FileTypeDetector.detect_file_type') as mock_detect:
            mock_detect.return_value = 'MEDIA_AUDIO'
            
            response = self.client.post('/api/v1/eda-execute/', json=media_request)
            
            assert response.status_code == 200
            result = response.json()
            assert result['file_type'] == 'MEDIA_AUDIO'
            assert result['processing_route'] == 'skip_to_packaging'
    
    def test_error_handling_invalid_function(self):
        """Test error handling for invalid functions"""
        invalid_chain = [{
            'id': 'step-1',
            'functionName': 'invalid_function',
            'category': 'Invalid',
            'library': 'pandas',
            'parameters': {},
            'description': 'Invalid function'
        }]
        
        request_data = {
            'node_id': 'eda-node-error',
            'function_chain': invalid_chain,
            'input_data': self.test_data
        }
        
        response = self.client.post('/api/v1/eda-execute/', json=request_data)
        
        assert response.status_code == 200  # API should handle gracefully
        result = response.json()
        assert result['success'] is False
        assert len(result['results']) == 1
        assert result['results'][0]['success'] is False
        assert 'error' in result['results'][0]
    
    def test_parameter_validation(self):
        """Test parameter validation"""
        # Missing required fields
        invalid_request = {
            'node_id': 'test-node'
            # Missing function_chain and input_data
        }
        
        response = self.client.post('/api/v1/eda-execute/', json=invalid_request)
        
        assert response.status_code == 422  # Validation error
    
    def test_progress_tracking(self):
        """Test execution progress tracking"""
        request_data = {
            'node_id': 'eda-node-progress',
            'function_chain': self.multi_library_chain,
            'input_data': self.test_data,
            'track_progress': True
        }
        
        with patch('app.core.eda_executor.EDAExecutor.execute_unified_eda_pipeline') as mock_execute:
            mock_execute.return_value = {
                'success': True,
                'execution_id': 'progress_test_789',
                'results': [],
                'progress_tracking': {
                    'total_steps': 4,
                    'completed_steps': 4,
                    'current_library': 'matplotlib',
                    'progress_percentage': 100
                },
                'total_execution_time_ms': 3000
            }
            
            response = self.client.post('/api/v1/eda-execute/', json=request_data)
            
            assert response.status_code == 200
            result = response.json()
            
            assert 'progress_tracking' in result
            assert result['progress_tracking']['progress_percentage'] == 100
    
    def test_cloudflare_integration(self):
        """Test Cloudflare tunnel integration"""
        request_data = {
            'node_id': 'eda-node-cloudflare',
            'function_chain': self.multi_library_chain[:2],  # Shorter chain
            'input_data': self.test_data,
            'generate_download_link': True,
            'cloudflare_config': {
                'tunnel_name': 'test-eda-tunnel',
                'hostname': 'eda-test.example.com'
            }
        }
        
        with patch('app.services.cloudflare_service.CloudflareService.execute_complete_workflow') as mock_cf:
            mock_cf.return_value = {
                'success': True,
                'package_path': '/tmp/eda_package.zip',
                'download_url': 'https://eda-test.example.com/download/package.zip',
                'wget_command': 'wget https://eda-test.example.com/download/package.zip',
                'colab_instructions': 'Use the wget command in Google Colab'
            }
            
            response = self.client.post('/api/v1/eda-execute/', json=request_data)
            
            assert response.status_code == 200
            result = response.json()
            
            assert result['download_url'] is not None
            assert result['wget_command'] is not None
            assert result['colab_compatible'] is True
    
    def test_concurrent_requests(self):
        """Test handling of concurrent API requests"""
        import threading
        import time
        
        results = []
        
        def make_request(request_id):
            request_data = {
                'node_id': f'eda-node-concurrent-{request_id}',
                'function_chain': self.multi_library_chain[:1],  # Single function
                'input_data': self.test_data
            }
            
            response = self.client.post('/api/v1/eda-execute/', json=request_data)
            results.append((request_id, response.status_code))
        
        # Start multiple concurrent requests
        threads = []
        for i in range(3):
            thread = threading.Thread(target=make_request, args=(i,))
            threads.append(thread)
            thread.start()
        
        # Wait for all requests
        for thread in threads:
            thread.join()
        
        # All requests should be handled
        assert len(results) == 3
        assert all(status_code in [200, 422] for _, status_code in results)
    
    def test_large_dataset_handling(self):
        """Test handling of large datasets"""
        # Create large CSV content
        large_csv = 'id,value1,value2,category\n'
        for i in range(1000):
            large_csv += f'{i},{i*2},{i*3},cat_{i%10}\n'
        
        large_request = {
            'node_id': 'eda-node-large',
            'function_chain': [{
                'id': 'step-1',
                'functionName': 'head',
                'category': 'Data Inspection',
                'library': 'pandas',
                'parameters': {'n': 10},
                'description': 'Get first 10 rows'
            }],
            'input_data': {
                'csv_content': large_csv,
                'filename': 'large_dataset.csv'
            }
        }
        
        response = self.client.post('/api/v1/eda-execute/', json=large_request)
        
        # Should handle large datasets gracefully
        assert response.status_code in [200, 413]  # Success or payload too large
    
    def test_execution_timeout_handling(self):
        """Test execution timeout handling"""
        request_data = {
            'node_id': 'eda-node-timeout',
            'function_chain': self.multi_library_chain,
            'input_data': self.test_data,
            'timeout_seconds': 1  # Very short timeout
        }
        
        with patch('app.core.eda_executor.EDAExecutor.execute_unified_eda_pipeline') as mock_execute:
            # Simulate long execution
            import time
            def slow_execution(*args, **kwargs):
                time.sleep(2)  # Longer than timeout
                return {'success': False, 'error': 'Timeout'}
            
            mock_execute.side_effect = slow_execution
            
            response = self.client.post('/api/v1/eda-execute/', json=request_data)
            
            assert response.status_code == 200
            result = response.json()
            assert result['success'] is False
            assert 'timeout' in result.get('error', '').lower()
    
    def test_response_format_validation(self):
        """Test response format validation"""
        request_data = {
            'node_id': 'eda-node-format',
            'function_chain': self.multi_library_chain[:1],
            'input_data': self.test_data
        }
        
        response = self.client.post('/api/v1/eda-execute/', json=request_data)
        
        if response.status_code == 200:
            result = response.json()
            
            # Check required response fields
            required_fields = [
                'success', 'execution_id', 'node_id', 'results',
                'total_execution_time_ms', 'timestamp'
            ]
            
            for field in required_fields:
                assert field in result, f"Missing required field: {field}"
            
            # Check result structure
            if result['results']:
                step_result = result['results'][0]
                step_fields = ['step_id', 'function_name', 'success', 'execution_time_ms']
                for field in step_fields:
                    assert field in step_result, f"Missing step field: {field}"
    
    def test_health_check_endpoint(self):
        """Test health check endpoint"""
        response = self.client.get('/api/v1/health')
        
        assert response.status_code == 200
        result = response.json()
        assert result['status'] == 'healthy'
        assert 'timestamp' in result
    
    def test_api_documentation(self):
        """Test API documentation endpoints"""
        # Test OpenAPI schema
        response = self.client.get('/openapi.json')
        assert response.status_code == 200
        
        # Test docs endpoint
        response = self.client.get('/docs')
        assert response.status_code == 200