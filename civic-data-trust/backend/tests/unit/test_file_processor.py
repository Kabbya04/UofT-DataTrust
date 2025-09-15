"""Tests for file processor."""

import pytest
from app.core.file_processing.detector import FileProcessor, FileType


class TestFileProcessor:
    """Test file processor functionality."""

    def test_file_type_detection_csv(self, file_processor, sample_csv_file):
        """Test CSV file type detection."""
        file_type = file_processor.detector.detect_file_type(sample_csv_file)
        assert file_type == FileType.TABULAR_CSV

    def test_file_info_extraction(self, file_processor, sample_csv_file):
        """Test file info extraction."""
        file_info = file_processor.detector.extract_file_info(sample_csv_file)

        assert file_info.file_name == "sample.csv"
        assert file_info.file_type == FileType.TABULAR_CSV.value
        assert file_info.file_size > 0

    def test_processing_route_determination(self, file_processor, sample_csv_file):
        """Test processing route determination."""
        route = file_processor.determine_processing_route(sample_csv_file)

        assert route["should_process_eda"] is True
        assert route["file_type"] == FileType.TABULAR_CSV.value
        assert route["recommended_workflow"] == "basic_eda"

    def test_file_processing(self, file_processor, sample_csv_file):
        """Test complete file processing."""
        result = file_processor.process_file(sample_csv_file)

        assert result.success is True
        assert result.file_info is not None
        assert result.processed_data is not None