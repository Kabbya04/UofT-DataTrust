import pytest
import os
import tempfile
import zipfile
import json
import requests
from unittest.mock import patch, MagicMock, mock_open
from typing import Dict, Any, List

from app.services.cloudflare_service import CloudflareService
from app.services.file_packaging_service import FilePackagingService
from app.core.eda_executor import EDAExecutor


class TestCloudflareIntegration:
    """Test suite for Cloudflare tunnel integration and file packaging"""
    
    def setup_method(self):
        """Setup test environment"""
        self.cloudflare_service = CloudflareService()
        self.packaging_service = FilePackagingService()
        self.executor = EDAExecutor()
        
        # Create temporary directory for test files
        self.temp_dir = tempfile.mkdtemp()
        
        # Mock Cloudflare credentials
        self.mock_credentials = {
            'account_id': 'test_account_123',
            'tunnel_token': 'test_token_456',
            'zone_id': 'test_zone_789',
            'api_key': 'test_api_key_000'
        }
    
    def teardown_method(self):
        """Cleanup test environment"""
        import shutil
        shutil.rmtree(self.temp_dir, ignore_errors=True)
    
    def create_test_files(self) -> Dict[str, str]:
        """Create test files for packaging"""
        files = {}
        
        # Create processed data file
        data_path = os.path.join(self.temp_dir, 'processed_data.csv')
        with open(data_path, 'w') as f:
            f.write('id,name,age,salary\n1,Alice,25,50000\n2,Bob,30,60000\n')
        files['data'] = data_path
        
        # Create visualization file (mock base64 image)
        viz_path = os.path.join(self.temp_dir, 'visualization.png')
        with open(viz_path, 'wb') as f:
            f.write(b'\x89PNG\r\n\x1a\n' + b'\x00' * 100)  # Mock PNG header + data
        files['visualization'] = viz_path
        
        # Create metadata file
        metadata_path = os.path.join(self.temp_dir, 'metadata.json')
        metadata = {
            'execution_id': 'test_exec_123',
            'timestamp': '2024-01-15T10:30:00Z',
            'functions_executed': ['head', 'describe', 'histogram'],
            'total_execution_time_ms': 1500,
            'data_shape': [2, 4]
        }
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f)
        files['metadata'] = metadata_path
        
        return files
    
    @patch('requests.post')
    def test_cloudflare_tunnel_creation(self, mock_post):
        """Test Cloudflare tunnel creation"""
        # Mock successful tunnel creation response
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            'success': True,
            'result': {
                'id': 'tunnel_123',
                'name': 'eda-results-tunnel',
                'cname': 'tunnel_123.cfargotunnel.com'
            }
        }
        mock_post.return_value = mock_response
        
        tunnel_result = self.cloudflare_service.create_tunnel(
            name='eda-results-tunnel',
            credentials=self.mock_credentials
        )
        
        assert tunnel_result['success'] is True
        assert tunnel_result['tunnel_id'] == 'tunnel_123'
        assert tunnel_result['cname'] == 'tunnel_123.cfargotunnel.com'
        
        # Verify API call
        mock_post.assert_called_once()
        call_args = mock_post.call_args
        assert 'tunnels' in call_args[0][0]  # URL contains 'tunnels'
    
    @patch('requests.post')
    def test_public_hostname_creation(self, mock_post):
        """Test public hostname creation for tunnel"""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            'success': True,
            'result': {
                'hostname': 'eda-results.example.com',
                'service': 'http://localhost:8080'
            }
        }
        mock_post.return_value = mock_response
        
        hostname_result = self.cloudflare_service.create_public_hostname(
            tunnel_id='tunnel_123',
            hostname='eda-results.example.com',
            service_url='http://localhost:8080',
            credentials=self.mock_credentials
        )
        
        assert hostname_result['success'] is True
        assert hostname_result['public_url'] == 'https://eda-results.example.com'
        assert hostname_result['wget_compatible'] is True
    
    def test_file_packaging_basic(self):
        """Test basic file packaging into zip"""
        test_files = self.create_test_files()
        
        zip_path = self.packaging_service.create_eda_package(
            files=test_files,
            package_name='eda_results_test',
            output_dir=self.temp_dir
        )
        
        assert os.path.exists(zip_path)
        assert zip_path.endswith('.zip')
        
        # Verify zip contents
        with zipfile.ZipFile(zip_path, 'r') as zip_file:
            file_list = zip_file.namelist()
            assert 'processed_data.csv' in file_list
            assert 'visualization.png' in file_list
            assert 'metadata.json' in file_list
            assert 'README.md' in file_list  # Should auto-generate README
    
    def test_file_packaging_with_structure(self):
        """Test file packaging with organized directory structure"""
        test_files = self.create_test_files()
        
        zip_path = self.packaging_service.create_structured_package(
            files=test_files,
            package_name='structured_eda_results',
            output_dir=self.temp_dir,
            organize_by_type=True
        )
        
        # Verify structured organization
        with zipfile.ZipFile(zip_path, 'r') as zip_file:
            file_list = zip_file.namelist()
            assert 'data/processed_data.csv' in file_list
            assert 'visualizations/visualization.png' in file_list
            assert 'metadata/metadata.json' in file_list
            assert 'README.md' in file_list
    
    def test_colab_compatibility_validation(self):
        """Test Google Colab compatibility validation"""
        test_url = 'https://eda-results.example.com/download/package.zip'
        
        compatibility_result = self.cloudflare_service.validate_colab_compatibility(test_url)
        
        assert compatibility_result['is_compatible'] is True
        assert compatibility_result['wget_command'] is not None
        assert 'wget' in compatibility_result['wget_command']
        assert test_url in compatibility_result['wget_command']
        
        # Test with invalid URL
        invalid_compatibility = self.cloudflare_service.validate_colab_compatibility('invalid-url')
        assert invalid_compatibility['is_compatible'] is False
    
    @patch('requests.get')
    def test_download_link_accessibility(self, mock_get):
        """Test download link accessibility"""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.headers = {'content-length': '1024'}
        mock_get.return_value = mock_response
        
        test_url = 'https://eda-results.example.com/download/package.zip'
        
        accessibility_result = self.cloudflare_service.test_download_accessibility(test_url)
        
        assert accessibility_result['accessible'] is True
        assert accessibility_result['status_code'] == 200
        assert accessibility_result['file_size_bytes'] == 1024
    
    def test_package_metadata_generation(self):
        """Test automatic metadata generation for packages"""
        test_files = self.create_test_files()
        
        metadata = self.packaging_service.generate_package_metadata(
            files=test_files,
            execution_summary={
                'execution_id': 'test_123',
                'libraries_used': ['pandas', 'numpy', 'matplotlib'],
                'total_functions': 5,
                'execution_time_ms': 2500
            }
        )
        
        assert 'package_info' in metadata
        assert 'execution_summary' in metadata
        assert 'file_manifest' in metadata
        assert 'colab_instructions' in metadata
        
        # Verify file manifest
        assert len(metadata['file_manifest']) == len(test_files)
        assert all('filename' in item for item in metadata['file_manifest'])
        assert all('size_bytes' in item for item in metadata['file_manifest'])
    
    def test_readme_generation(self):
        """Test automatic README generation"""
        execution_summary = {
            'execution_id': 'test_456',
            'libraries_used': ['pandas', 'numpy', 'matplotlib'],
            'functions_executed': ['head', 'describe', 'mean', 'histogram'],
            'data_shape': [100, 5],
            'execution_time_ms': 3000
        }
        
        readme_content = self.packaging_service.generate_readme(
            execution_summary=execution_summary,
            download_url='https://eda-results.example.com/download/package.zip'
        )
        
        assert 'EDA Results Package' in readme_content
        assert 'Google Colab' in readme_content
        assert 'wget' in readme_content
        assert 'pandas' in readme_content
        assert 'numpy' in readme_content
        assert 'matplotlib' in readme_content
        assert execution_summary['execution_id'] in readme_content
    
    @patch('app.services.cloudflare_service.CloudflareService.create_tunnel')
    @patch('app.services.cloudflare_service.CloudflareService.create_public_hostname')
    def test_end_to_end_workflow(self, mock_hostname, mock_tunnel):
        """Test complete end-to-end workflow"""
        # Mock Cloudflare responses
        mock_tunnel.return_value = {
            'success': True,
            'tunnel_id': 'tunnel_789',
            'cname': 'tunnel_789.cfargotunnel.com'
        }
        
        mock_hostname.return_value = {
            'success': True,
            'public_url': 'https://eda-results-789.example.com',
            'wget_compatible': True
        }
        
        # Create test files
        test_files = self.create_test_files()
        
        # Execute complete workflow
        workflow_result = self.cloudflare_service.execute_complete_workflow(
            files=test_files,
            execution_summary={
                'execution_id': 'workflow_test_123',
                'libraries_used': ['pandas', 'numpy', 'matplotlib']
            },
            credentials=self.mock_credentials
        )
        
        assert workflow_result['success'] is True
        assert 'package_path' in workflow_result
        assert 'download_url' in workflow_result
        assert 'wget_command' in workflow_result
        assert 'colab_instructions' in workflow_result
        
        # Verify package exists
        assert os.path.exists(workflow_result['package_path'])
    
    def test_error_handling_tunnel_failure(self):
        """Test error handling when tunnel creation fails"""
        with patch('requests.post') as mock_post:
            mock_response = MagicMock()
            mock_response.status_code = 400
            mock_response.json.return_value = {
                'success': False,
                'errors': [{'message': 'Invalid credentials'}]
            }
            mock_post.return_value = mock_response
            
            tunnel_result = self.cloudflare_service.create_tunnel(
                name='test-tunnel',
                credentials=self.mock_credentials
            )
            
            assert tunnel_result['success'] is False
            assert 'error' in tunnel_result
            assert 'Invalid credentials' in tunnel_result['error']
    
    def test_large_file_packaging(self):
        """Test packaging of large files"""
        # Create a larger test file
        large_file_path = os.path.join(self.temp_dir, 'large_data.csv')
        with open(large_file_path, 'w') as f:
            f.write('id,value\n')
            for i in range(10000):
                f.write(f'{i},{i*2}\n')
        
        files = {'large_data': large_file_path}
        
        zip_path = self.packaging_service.create_eda_package(
            files=files,
            package_name='large_package_test',
            output_dir=self.temp_dir
        )
        
        assert os.path.exists(zip_path)
        
        # Verify compression efficiency
        original_size = os.path.getsize(large_file_path)
        compressed_size = os.path.getsize(zip_path)
        compression_ratio = compressed_size / original_size
        
        assert compression_ratio < 0.8  # Should achieve some compression
    
    def test_concurrent_packaging_operations(self):
        """Test concurrent file packaging operations"""
        import threading
        
        results = []
        
        def create_package(package_id):
            test_files = self.create_test_files()
            zip_path = self.packaging_service.create_eda_package(
                files=test_files,
                package_name=f'concurrent_test_{package_id}',
                output_dir=self.temp_dir
            )
            results.append((package_id, zip_path))
        
        # Start multiple packaging operations
        threads = []
        for i in range(3):
            thread = threading.Thread(target=create_package, args=(i,))
            threads.append(thread)
            thread.start()
        
        # Wait for all operations
        for thread in threads:
            thread.join()
        
        # All operations should succeed
        assert len(results) == 3
        assert all(os.path.exists(zip_path) for _, zip_path in results)
    
    def test_security_validation(self):
        """Test security validation for file operations"""
        # Test path traversal protection
        malicious_files = {
            'malicious': '../../../etc/passwd'
        }
        
        with pytest.raises(ValueError, match='path traversal'):
            self.packaging_service.create_eda_package(
                files=malicious_files,
                package_name='security_test',
                output_dir=self.temp_dir
            )
    
    def test_cleanup_operations(self):
        """Test cleanup of temporary files and tunnels"""
        test_files = self.create_test_files()
        
        # Create package
        zip_path = self.packaging_service.create_eda_package(
            files=test_files,
            package_name='cleanup_test',
            output_dir=self.temp_dir
        )
        
        # Test cleanup
        cleanup_result = self.packaging_service.cleanup_temporary_files(
            package_path=zip_path,
            source_files=list(test_files.values())
        )
        
        assert cleanup_result['success'] is True
        assert cleanup_result['files_cleaned'] > 0