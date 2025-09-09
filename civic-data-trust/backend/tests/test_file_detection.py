import pytest
import os
import tempfile
import pandas as pd
import numpy as np
from unittest.mock import patch, MagicMock
from typing import Dict, Any

from app.core.file_detector import FileTypeDetector, FileType
from app.core.eda_processor import EDAProcessor


class TestFileTypeDetection:
    """Test suite for file type detection and routing logic"""
    
    def setup_method(self):
        """Setup test environment"""
        self.detector = FileTypeDetector()
        self.processor = EDAProcessor()
        
        # Create temporary directory for test files
        self.temp_dir = tempfile.mkdtemp()
    
    def teardown_method(self):
        """Cleanup test environment"""
        import shutil
        shutil.rmtree(self.temp_dir, ignore_errors=True)
    
    def create_test_csv(self, filename: str) -> str:
        """Create a test CSV file"""
        data = {
            'id': [1, 2, 3, 4, 5],
            'name': ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
            'age': [25, 30, 35, 28, 32],
            'salary': [50000, 60000, 70000, 55000, 65000]
        }
        df = pd.DataFrame(data)
        filepath = os.path.join(self.temp_dir, filename)
        df.to_csv(filepath, index=False)
        return filepath
    
    def create_test_excel(self, filename: str) -> str:
        """Create a test Excel file"""
        data = {
            'product': ['A', 'B', 'C'],
            'sales': [100, 200, 150],
            'profit': [20, 40, 30]
        }
        df = pd.DataFrame(data)
        filepath = os.path.join(self.temp_dir, filename)
        df.to_excel(filepath, index=False)
        return filepath
    
    def create_test_audio_file(self, filename: str) -> str:
        """Create a mock audio file"""
        filepath = os.path.join(self.temp_dir, filename)
        # Create a small binary file to simulate audio
        with open(filepath, 'wb') as f:
            f.write(b'\x00\x01\x02\x03' * 1000)  # Mock audio data
        return filepath
    
    def create_test_video_file(self, filename: str) -> str:
        """Create a mock video file"""
        filepath = os.path.join(self.temp_dir, filename)
        # Create a small binary file to simulate video
        with open(filepath, 'wb') as f:
            f.write(b'\xFF\xFE\xFD\xFC' * 2000)  # Mock video data
        return filepath
    
    def test_csv_file_detection(self):
        """Test CSV file detection"""
        csv_path = self.create_test_csv('test_data.csv')
        
        file_type = self.detector.detect_file_type(csv_path)
        
        assert file_type == FileType.TABULAR_CSV
        assert self.detector.is_tabular_data(csv_path) is True
        assert self.detector.is_media_file(csv_path) is False
    
    def test_excel_file_detection(self):
        """Test Excel file detection"""
        excel_path = self.create_test_excel('test_data.xlsx')
        
        file_type = self.detector.detect_file_type(excel_path)
        
        assert file_type == FileType.TABULAR_EXCEL
        assert self.detector.is_tabular_data(excel_path) is True
        assert self.detector.is_media_file(excel_path) is False
    
    def test_audio_file_detection(self):
        """Test audio file detection"""
        audio_extensions = ['.mp3', '.wav', '.flac', '.aac']
        
        for ext in audio_extensions:
            audio_path = self.create_test_audio_file(f'test_audio{ext}')
            
            file_type = self.detector.detect_file_type(audio_path)
            
            assert file_type == FileType.MEDIA_AUDIO
            assert self.detector.is_tabular_data(audio_path) is False
            assert self.detector.is_media_file(audio_path) is True
    
    def test_video_file_detection(self):
        """Test video file detection"""
        video_extensions = ['.mp4', '.avi', '.mov', '.mkv']
        
        for ext in video_extensions:
            video_path = self.create_test_video_file(f'test_video{ext}')
            
            file_type = self.detector.detect_file_type(video_path)
            
            assert file_type == FileType.MEDIA_VIDEO
            assert self.detector.is_tabular_data(video_path) is False
            assert self.detector.is_media_file(video_path) is True
    
    def test_unsupported_file_detection(self):
        """Test unsupported file type detection"""
        # Create a text file
        text_path = os.path.join(self.temp_dir, 'test.txt')
        with open(text_path, 'w') as f:
            f.write('This is a text file')
        
        file_type = self.detector.detect_file_type(text_path)
        
        assert file_type == FileType.UNSUPPORTED
        assert self.detector.is_tabular_data(text_path) is False
        assert self.detector.is_media_file(text_path) is False
    
    def test_file_content_validation(self):
        """Test file content validation for tabular data"""
        csv_path = self.create_test_csv('valid_data.csv')
        
        validation_result = self.detector.validate_tabular_content(csv_path)
        
        assert validation_result['is_valid'] is True
        assert validation_result['row_count'] == 5
        assert validation_result['column_count'] == 4
        assert 'id' in validation_result['columns']
        assert 'name' in validation_result['columns']
        assert validation_result['has_numeric_data'] is True
    
    def test_corrupted_file_handling(self):
        """Test handling of corrupted files"""
        # Create a corrupted CSV file
        corrupted_path = os.path.join(self.temp_dir, 'corrupted.csv')
        with open(corrupted_path, 'w') as f:
            f.write('invalid,csv,content\n1,2\n3,4,5,6,7')  # Inconsistent columns
        
        file_type = self.detector.detect_file_type(corrupted_path)
        validation_result = self.detector.validate_tabular_content(corrupted_path)
        
        assert file_type == FileType.TABULAR_CSV  # Still detected as CSV
        assert validation_result['is_valid'] is False
        assert 'error' in validation_result
    
    def test_empty_file_handling(self):
        """Test handling of empty files"""
        empty_path = os.path.join(self.temp_dir, 'empty.csv')
        with open(empty_path, 'w') as f:
            pass  # Create empty file
        
        file_type = self.detector.detect_file_type(empty_path)
        
        assert file_type == FileType.UNSUPPORTED
    
    def test_large_file_handling(self):
        """Test handling of large files"""
        # Create a large CSV file
        large_data = {
            'id': list(range(10000)),
            'value1': np.random.rand(10000),
            'value2': np.random.rand(10000),
            'category': [f'cat_{i % 100}' for i in range(10000)]
        }
        df = pd.DataFrame(large_data)
        large_path = os.path.join(self.temp_dir, 'large_data.csv')
        df.to_csv(large_path, index=False)
        
        file_type = self.detector.detect_file_type(large_path)
        validation_result = self.detector.validate_tabular_content(large_path)
        
        assert file_type == FileType.TABULAR_CSV
        assert validation_result['is_valid'] is True
        assert validation_result['row_count'] == 10000
        assert validation_result['file_size_mb'] > 0
    
    def test_eda_routing_for_tabular_data(self):
        """Test EDA processing routing for tabular data"""
        csv_path = self.create_test_csv('routing_test.csv')
        
        routing_decision = self.processor.determine_processing_route(csv_path)
        
        assert routing_decision['should_process_eda'] is True
        assert routing_decision['file_type'] == FileType.TABULAR_CSV
        assert routing_decision['processing_steps'] == ['pandas', 'numpy', 'matplotlib']
        assert routing_decision['skip_to_packaging'] is False
    
    def test_media_routing_skip_eda(self):
        """Test routing for media files (skip EDA)"""
        audio_path = self.create_test_audio_file('skip_test.mp3')
        
        routing_decision = self.processor.determine_processing_route(audio_path)
        
        assert routing_decision['should_process_eda'] is False
        assert routing_decision['file_type'] == FileType.MEDIA_AUDIO
        assert routing_decision['processing_steps'] == []
        assert routing_decision['skip_to_packaging'] is True
    
    def test_batch_file_processing(self):
        """Test batch processing of multiple files"""
        # Create multiple test files
        csv_path1 = self.create_test_csv('batch1.csv')
        csv_path2 = self.create_test_csv('batch2.csv')
        audio_path = self.create_test_audio_file('batch_audio.mp3')
        
        file_paths = [csv_path1, csv_path2, audio_path]
        
        batch_results = self.processor.process_file_batch(file_paths)
        
        assert len(batch_results) == 3
        assert batch_results[0]['file_type'] == FileType.TABULAR_CSV
        assert batch_results[1]['file_type'] == FileType.TABULAR_CSV
        assert batch_results[2]['file_type'] == FileType.MEDIA_AUDIO
        
        # Check processing decisions
        tabular_results = [r for r in batch_results if r['should_process_eda']]
        media_results = [r for r in batch_results if r['skip_to_packaging']]
        
        assert len(tabular_results) == 2
        assert len(media_results) == 1
    
    def test_file_metadata_extraction(self):
        """Test metadata extraction from files"""
        csv_path = self.create_test_csv('metadata_test.csv')
        
        metadata = self.detector.extract_file_metadata(csv_path)
        
        assert 'filename' in metadata
        assert 'file_size_bytes' in metadata
        assert 'created_timestamp' in metadata
        assert 'file_extension' in metadata
        assert metadata['file_extension'] == '.csv'
        assert metadata['file_size_bytes'] > 0
    
    def test_mime_type_detection(self):
        """Test MIME type detection"""
        csv_path = self.create_test_csv('mime_test.csv')
        audio_path = self.create_test_audio_file('mime_test.mp3')
        
        csv_mime = self.detector.get_mime_type(csv_path)
        audio_mime = self.detector.get_mime_type(audio_path)
        
        assert 'text' in csv_mime or 'csv' in csv_mime
        assert 'audio' in audio_mime or 'mpeg' in audio_mime
    
    def test_security_validation(self):
        """Test security validation for uploaded files"""
        csv_path = self.create_test_csv('security_test.csv')
        
        # Test file size limits
        security_result = self.detector.validate_file_security(csv_path, max_size_mb=1)
        assert security_result['is_safe'] is True
        
        # Test with very small limit
        security_result = self.detector.validate_file_security(csv_path, max_size_mb=0.001)
        assert security_result['is_safe'] is False
        assert 'file size' in security_result['reason'].lower()
    
    def test_concurrent_file_detection(self):
        """Test concurrent file detection operations"""
        import threading
        import time
        
        # Create multiple test files
        file_paths = []
        for i in range(5):
            path = self.create_test_csv(f'concurrent_{i}.csv')
            file_paths.append(path)
        
        results = []
        
        def detect_file_type(path):
            file_type = self.detector.detect_file_type(path)
            results.append((path, file_type))
        
        # Start multiple threads
        threads = []
        for path in file_paths:
            thread = threading.Thread(target=detect_file_type, args=(path,))
            threads.append(thread)
            thread.start()
        
        # Wait for all threads
        for thread in threads:
            thread.join()
        
        # All detections should succeed
        assert len(results) == 5
        assert all(file_type == FileType.TABULAR_CSV for _, file_type in results)