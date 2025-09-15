"""File type detection and processing."""

import os
import mimetypes
from enum import Enum
from pathlib import Path
from datetime import datetime
from typing import Any, Dict, List, Optional, Union
from app.utils.logging import get_logger
from app.utils.performance import track_execution_time
from app.exceptions.file import FileNotFoundError, InvalidFileTypeError
from .models import FileInfo, ProcessingResult

logger = get_logger(__name__)


class FileType(Enum):
    """Enumeration of supported file types."""
    TABULAR_CSV = "TABULAR_CSV"
    TABULAR_EXCEL = "TABULAR_EXCEL"
    TABULAR_JSON = "TABULAR_JSON"
    TABULAR_PARQUET = "TABULAR_PARQUET"
    MEDIA_AUDIO = "MEDIA_AUDIO"
    MEDIA_VIDEO = "MEDIA_VIDEO"
    MEDIA_IMAGE = "MEDIA_IMAGE"
    UNSUPPORTED = "UNSUPPORTED"


class FileTypeDetector:
    """Detects file types and extracts metadata."""

    def __init__(self):
        self._setup_extension_mappings()

    def _setup_extension_mappings(self) -> None:
        """Setup file extension mappings."""
        self.tabular_extensions = {
            '.csv': FileType.TABULAR_CSV,
            '.tsv': FileType.TABULAR_CSV,
            '.xlsx': FileType.TABULAR_EXCEL,
            '.xls': FileType.TABULAR_EXCEL,
            '.json': FileType.TABULAR_JSON,
            '.parquet': FileType.TABULAR_PARQUET,
            '.pq': FileType.TABULAR_PARQUET
        }

        self.audio_extensions = {
            '.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma', '.m4a', '.opus'
        }

        self.video_extensions = {
            '.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv', '.webm', '.m4v', '.3gp'
        }

        self.image_extensions = {
            '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.svg', '.webp'
        }

    @track_execution_time
    def detect_file_type(self, file_path: str) -> FileType:
        """Detect file type based on extension."""
        try:
            file_ext = Path(file_path).suffix.lower()

            # Check tabular formats
            if file_ext in self.tabular_extensions:
                return self.tabular_extensions[file_ext]

            # Check media formats
            if file_ext in self.audio_extensions:
                return FileType.MEDIA_AUDIO
            elif file_ext in self.video_extensions:
                return FileType.MEDIA_VIDEO
            elif file_ext in self.image_extensions:
                return FileType.MEDIA_IMAGE

            return FileType.UNSUPPORTED

        except Exception as e:
            logger.error(f"Error detecting file type for {file_path}: {e}")
            return FileType.UNSUPPORTED

    def extract_file_info(self, file_path: str) -> FileInfo:
        """Extract comprehensive file information."""
        if not os.path.exists(file_path):
            raise FileNotFoundError(file_path)

        try:
            stat = os.stat(file_path)
            file_type = self.detect_file_type(file_path)

            return FileInfo(
                file_path=file_path,
                file_name=os.path.basename(file_path),
                file_size=stat.st_size,
                file_type=file_type.value,
                mime_type=mimetypes.guess_type(file_path)[0],
                created_at=datetime.fromtimestamp(stat.st_ctime),
                metadata={
                    'modified_time': datetime.fromtimestamp(stat.st_mtime).isoformat(),
                    'permissions': oct(stat.st_mode)[-3:],
                    'is_tabular': self.is_tabular_file(file_path),
                    'is_media': self.is_media_file(file_path)
                }
            )

        except Exception as e:
            logger.error(f"Error extracting file info for {file_path}: {e}")
            raise

    def is_tabular_file(self, file_path: str) -> bool:
        """Check if file is a tabular data format."""
        file_type = self.detect_file_type(file_path)
        return file_type in [
            FileType.TABULAR_CSV,
            FileType.TABULAR_EXCEL,
            FileType.TABULAR_JSON,
            FileType.TABULAR_PARQUET
        ]

    def is_media_file(self, file_path: str) -> bool:
        """Check if file is a media format."""
        file_type = self.detect_file_type(file_path)
        return file_type in [
            FileType.MEDIA_AUDIO,
            FileType.MEDIA_VIDEO,
            FileType.MEDIA_IMAGE
        ]

    def validate_file_security(self, file_path: str, max_size: int = 100 * 1024 * 1024) -> Dict[str, Any]:
        """Validate file for security concerns."""
        try:
            if not os.path.exists(file_path):
                return {
                    'is_safe': False,
                    'issues': ['File does not exist'],
                    'file_size': 0
                }

            file_size = os.path.getsize(file_path)

            issues = []
            if file_size > max_size:
                issues.append(f'File too large: {file_size} bytes (max: {max_size})')

            # Check for suspicious file types
            file_type = self.detect_file_type(file_path)
            if file_type == FileType.UNSUPPORTED:
                issues.append('Unsupported file type')

            return {
                'is_safe': len(issues) == 0,
                'issues': issues,
                'file_size': file_size,
                'file_type': file_type.value
            }

        except Exception as e:
            return {
                'is_safe': False,
                'issues': [f'Security validation error: {str(e)}'],
                'file_size': 0
            }


class FileProcessor:
    """Processes files and determines workflows."""

    def __init__(self):
        self.detector = FileTypeDetector()

    @track_execution_time
    def determine_processing_route(self, file_path: str) -> Dict[str, Any]:
        """Determine appropriate processing route for file."""
        try:
            file_info = self.detector.extract_file_info(file_path)

            if self.detector.is_tabular_file(file_path):
                return {
                    'should_process_eda': True,
                    'file_type': file_info.file_type,
                    'processing_steps': ['data_loading', 'eda_analysis', 'visualization'],
                    'skip_to_packaging': False,
                    'recommended_workflow': 'basic_eda',
                    'file_info': file_info.to_dict()
                }
            elif self.detector.is_media_file(file_path):
                return {
                    'should_process_eda': False,
                    'file_type': file_info.file_type,
                    'processing_steps': [],
                    'skip_to_packaging': True,
                    'recommended_workflow': 'media_packaging',
                    'file_info': file_info.to_dict()
                }
            else:
                return {
                    'should_process_eda': False,
                    'file_type': file_info.file_type,
                    'processing_steps': [],
                    'skip_to_packaging': False,
                    'recommended_workflow': 'unsupported',
                    'file_info': file_info.to_dict()
                }

        except Exception as e:
            logger.error(f"Error determining processing route for {file_path}: {e}")
            return {
                'should_process_eda': False,
                'file_type': FileType.UNSUPPORTED.value,
                'processing_steps': [],
                'skip_to_packaging': False,
                'recommended_workflow': 'error',
                'error': str(e)
            }

    def process_file(self, file_path: str) -> ProcessingResult:
        """Process file and return result."""
        start_time = datetime.now()

        try:
            file_info = self.detector.extract_file_info(file_path)

            # Validate file security
            security_check = self.detector.validate_file_security(file_path)
            if not security_check['is_safe']:
                return ProcessingResult(
                    file_info=file_info,
                    success=False,
                    error_message=f"Security validation failed: {', '.join(security_check['issues'])}"
                )

            # Determine processing route
            route_info = self.determine_processing_route(file_path)

            processing_time = (datetime.now() - start_time).total_seconds()

            return ProcessingResult(
                file_info=file_info,
                success=True,
                processed_data=route_info,
                processing_time_seconds=processing_time
            )

        except Exception as e:
            processing_time = (datetime.now() - start_time).total_seconds()
            logger.error(f"Error processing file {file_path}: {e}")

            # Create minimal file info for error case
            file_info = FileInfo(
                file_path=file_path,
                file_name=os.path.basename(file_path),
                file_size=0,
                file_type=FileType.UNSUPPORTED.value
            )

            return ProcessingResult(
                file_info=file_info,
                success=False,
                error_message=str(e),
                processing_time_seconds=processing_time
            )