import os
import mimetypes
import pandas as pd
import numpy as np
from enum import Enum
from typing import Dict, Any, List, Optional, Union, Tuple
import io
import tempfile
from pathlib import Path
import logging
from datetime import datetime

# Optional import for python-magic - disabled due to hanging issues
# try:
#     import magic
#     HAS_MAGIC = True
# except ImportError:
#     HAS_MAGIC = False
HAS_MAGIC = False  # Temporarily disabled


class FileType(Enum):
    """Enumeration of supported file types"""
    TABULAR_CSV = "TABULAR_CSV"
    TABULAR_EXCEL = "TABULAR_EXCEL"
    TABULAR_JSON = "TABULAR_JSON"
    TABULAR_PARQUET = "TABULAR_PARQUET"
    MEDIA_AUDIO = "MEDIA_AUDIO"
    MEDIA_VIDEO = "MEDIA_VIDEO"
    MEDIA_IMAGE = "MEDIA_IMAGE"
    UNSUPPORTED = "UNSUPPORTED"


class FileTypeDetector:
    """Service for detecting file types and validating content
    
    Supports:
    - Tabular data formats (CSV, Excel, JSON, Parquet)
    - Media files (Audio, Video, Images)
    - Content validation and security checks
    - Metadata extraction
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        
        # File extension mappings
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
        
        # MIME type mappings
        self.tabular_mime_types = {
            'text/csv', 'application/csv', 'text/tab-separated-values',
            'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/json', 'application/parquet'
        }
        
        self.audio_mime_types = {
            'audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac', 'audio/ogg',
            'audio/x-ms-wma', 'audio/mp4', 'audio/opus'
        }
        
        self.video_mime_types = {
            'video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo',
            'video/x-matroska', 'video/x-ms-wmv', 'video/x-flv', 'video/webm'
        }
        
        self.image_mime_types = {
            'image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff',
            'image/svg+xml', 'image/webp'
        }
    
    def detect_file_type(self, file_path: str) -> FileType:
        """Detect file type based on extension, MIME type, and content analysis
        
        Args:
            file_path: Path to the file to analyze
            
        Returns:
            FileType enum value
        """
        try:
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"File not found: {file_path}")
            
            if os.path.getsize(file_path) == 0:
                return FileType.UNSUPPORTED
            
            # Get file extension
            file_extension = Path(file_path).suffix.lower()
            
            # Primary detection by extension
            if file_extension in self.tabular_extensions:
                # Validate tabular content
                if self._validate_tabular_file(file_path, file_extension):
                    return self.tabular_extensions[file_extension]
            
            elif file_extension in self.audio_extensions:
                return FileType.MEDIA_AUDIO
            
            elif file_extension in self.video_extensions:
                return FileType.MEDIA_VIDEO
            
            elif file_extension in self.image_extensions:
                return FileType.MEDIA_IMAGE
            
            # Secondary detection by MIME type
            mime_type = self.get_mime_type(file_path)
            
            if any(tabular_mime in mime_type for tabular_mime in self.tabular_mime_types):
                if self._validate_tabular_file(file_path, file_extension):
                    return self._mime_to_file_type(mime_type)
            
            elif any(audio_mime in mime_type for audio_mime in self.audio_mime_types):
                return FileType.MEDIA_AUDIO
            
            elif any(video_mime in mime_type for video_mime in self.video_mime_types):
                return FileType.MEDIA_VIDEO
            
            elif any(image_mime in mime_type for image_mime in self.image_mime_types):
                return FileType.MEDIA_IMAGE
            
            # Tertiary detection by content analysis
            content_type = self._analyze_file_content(file_path)
            if content_type != FileType.UNSUPPORTED:
                return content_type
            
            return FileType.UNSUPPORTED
            
        except Exception as e:
            self.logger.error(f"Error detecting file type for {file_path}: {str(e)}")
            return FileType.UNSUPPORTED
    
    def _validate_tabular_file(self, file_path: str, extension: str) -> bool:
        """Validate that a file contains valid tabular data"""
        try:
            if extension == '.csv' or extension == '.tsv':
                # Try to read first few rows
                separator = '\t' if extension == '.tsv' else ','
                df = pd.read_csv(file_path, sep=separator, nrows=5)
                return len(df.columns) > 0 and len(df) > 0
            
            elif extension in ['.xlsx', '.xls']:
                df = pd.read_excel(file_path, nrows=5)
                return len(df.columns) > 0 and len(df) > 0
            
            elif extension == '.json':
                df = pd.read_json(file_path, lines=True, nrows=5)
                return len(df.columns) > 0 and len(df) > 0
            
            elif extension in ['.parquet', '.pq']:
                df = pd.read_parquet(file_path)
                return len(df.columns) > 0 and len(df) > 0
            
            return False
            
        except Exception:
            return False
    
    def _mime_to_file_type(self, mime_type: str) -> FileType:
        """Convert MIME type to FileType enum"""
        if 'csv' in mime_type:
            return FileType.TABULAR_CSV
        elif 'excel' in mime_type or 'spreadsheet' in mime_type:
            return FileType.TABULAR_EXCEL
        elif 'json' in mime_type:
            return FileType.TABULAR_JSON
        elif 'parquet' in mime_type:
            return FileType.TABULAR_PARQUET
        else:
            return FileType.UNSUPPORTED
    
    def _analyze_file_content(self, file_path: str) -> FileType:
        """Analyze file content for type detection"""
        try:
            # Read first 1KB of file for analysis
            with open(file_path, 'rb') as f:
                header = f.read(1024)
            
            # Check for CSV-like content
            if self._looks_like_csv(header):
                return FileType.TABULAR_CSV
            
            # Check for JSON-like content
            if self._looks_like_json(header):
                return FileType.TABULAR_JSON
            
            # Check for binary media signatures
            if self._has_media_signature(header):
                return self._detect_media_type_from_signature(header)
            
            return FileType.UNSUPPORTED
            
        except Exception:
            return FileType.UNSUPPORTED
    
    def _looks_like_csv(self, content: bytes) -> bool:
        """Check if content looks like CSV"""
        try:
            text_content = content.decode('utf-8', errors='ignore')
            lines = text_content.split('\n')[:5]  # Check first 5 lines
            
            if len(lines) < 2:
                return False
            
            # Check for consistent comma/tab separation
            separators = [',', '\t', ';']
            for sep in separators:
                first_line_count = text_content.split('\n')[0].count(sep)
                if first_line_count > 0:
                    # Check if other lines have similar separator count
                    consistent = True
                    for line in lines[1:3]:  # Check next 2 lines
                        if abs(line.count(sep) - first_line_count) > 1:
                            consistent = False
                            break
                    if consistent:
                        return True
            
            return False
            
        except Exception:
            return False
    
    def _looks_like_json(self, content: bytes) -> bool:
        """Check if content looks like JSON"""
        try:
            text_content = content.decode('utf-8', errors='ignore').strip()
            return (text_content.startswith('{') or text_content.startswith('[')) and \
                   ('"' in text_content or "'" in text_content)
        except Exception:
            return False
    
    def _has_media_signature(self, content: bytes) -> bool:
        """Check if content has media file signatures"""
        # Common media file signatures
        signatures = {
            b'\xFF\xFB': 'mp3',  # MP3
            b'\xFF\xF3': 'mp3',  # MP3
            b'\xFF\xF2': 'mp3',  # MP3
            b'RIFF': 'wav',      # WAV
            b'fLaC': 'flac',     # FLAC
            b'\x00\x00\x00\x20ftypmp4': 'mp4',  # MP4
            b'\x1A\x45\xDF\xA3': 'mkv',  # MKV
            b'\x89PNG': 'png',   # PNG
            b'\xFF\xD8\xFF': 'jpg',  # JPEG
            b'GIF8': 'gif'       # GIF
        }
        
        for signature in signatures:
            if content.startswith(signature):
                return True
        
        return False
    
    def _detect_media_type_from_signature(self, content: bytes) -> FileType:
        """Detect specific media type from file signature"""
        if content.startswith((b'\xFF\xFB', b'\xFF\xF3', b'\xFF\xF2')) or b'RIFF' in content[:12] or content.startswith(b'fLaC'):
            return FileType.MEDIA_AUDIO
        elif content.startswith((b'\x00\x00\x00\x20ftypmp4', b'\x1A\x45\xDF\xA3')):
            return FileType.MEDIA_VIDEO
        elif content.startswith((b'\x89PNG', b'\xFF\xD8\xFF', b'GIF8')):
            return FileType.MEDIA_IMAGE
        else:
            return FileType.UNSUPPORTED
    
    def get_mime_type(self, file_path: str) -> str:
        """Get MIME type of file"""
        try:
            # Try python-magic first (more accurate) if available
            if HAS_MAGIC:
                try:
                    mime = magic.Magic(mime=True)
                    return mime.from_file(file_path)
                except Exception:
                    pass
            
            # Fallback to mimetypes module
            mime_type, _ = mimetypes.guess_type(file_path)
            return mime_type or 'application/octet-stream'
            
        except Exception:
            return 'application/octet-stream'
    
    def is_tabular_data(self, file_path: str) -> bool:
        """Check if file contains tabular data"""
        file_type = self.detect_file_type(file_path)
        return file_type in [FileType.TABULAR_CSV, FileType.TABULAR_EXCEL, 
                           FileType.TABULAR_JSON, FileType.TABULAR_PARQUET]
    
    def is_media_file(self, file_path: str) -> bool:
        """Check if file is a media file"""
        file_type = self.detect_file_type(file_path)
        return file_type in [FileType.MEDIA_AUDIO, FileType.MEDIA_VIDEO, FileType.MEDIA_IMAGE]
    
    def validate_tabular_content(self, file_path: str) -> Dict[str, Any]:
        """Validate and analyze tabular file content
        
        Returns:
            Dict with validation results and metadata
        """
        try:
            file_type = self.detect_file_type(file_path)
            
            if not self.is_tabular_data(file_path):
                return {
                    'is_valid': False,
                    'error': f'File is not tabular data. Detected type: {file_type.value}'
                }
            
            # Load data based on file type
            df = self._load_tabular_data(file_path, file_type)
            
            if df is None:
                return {
                    'is_valid': False,
                    'error': 'Could not load tabular data from file'
                }
            
            # Analyze data characteristics
            numeric_columns = df.select_dtypes(include=[np.number]).columns.tolist()
            categorical_columns = df.select_dtypes(include=['object', 'category']).columns.tolist()
            datetime_columns = df.select_dtypes(include=['datetime64']).columns.tolist()
            
            return {
                'is_valid': True,
                'row_count': len(df),
                'column_count': len(df.columns),
                'columns': df.columns.tolist(),
                'data_types': df.dtypes.to_dict(),
                'numeric_columns': numeric_columns,
                'categorical_columns': categorical_columns,
                'datetime_columns': datetime_columns,
                'has_numeric_data': len(numeric_columns) > 0,
                'has_missing_values': df.isnull().any().any(),
                'missing_value_count': df.isnull().sum().sum(),
                'duplicate_row_count': df.duplicated().sum(),
                'memory_usage_mb': df.memory_usage(deep=True).sum() / 1024 / 1024,
                'file_size_mb': os.path.getsize(file_path) / 1024 / 1024
            }
            
        except Exception as e:
            return {
                'is_valid': False,
                'error': f'Error validating tabular content: {str(e)}'
            }
    
    def _load_tabular_data(self, file_path: str, file_type: FileType) -> Optional[pd.DataFrame]:
        """Load tabular data based on file type"""
        try:
            if file_type == FileType.TABULAR_CSV:
                # Try different separators and encodings
                for sep in [',', '\t', ';']:
                    for encoding in ['utf-8', 'latin-1', 'cp1252']:
                        try:
                            return pd.read_csv(file_path, sep=sep, encoding=encoding)
                        except Exception:
                            continue
            
            elif file_type == FileType.TABULAR_EXCEL:
                return pd.read_excel(file_path)
            
            elif file_type == FileType.TABULAR_JSON:
                # Try different JSON formats
                try:
                    return pd.read_json(file_path)
                except Exception:
                    return pd.read_json(file_path, lines=True)
            
            elif file_type == FileType.TABULAR_PARQUET:
                return pd.read_parquet(file_path)
            
            return None
            
        except Exception:
            return None
    
    def extract_file_metadata(self, file_path: str) -> Dict[str, Any]:
        """Extract comprehensive file metadata"""
        try:
            stat = os.stat(file_path)
            path_obj = Path(file_path)
            
            metadata = {
                'filename': path_obj.name,
                'file_extension': path_obj.suffix.lower(),
                'file_size_bytes': stat.st_size,
                'file_size_mb': stat.st_size / 1024 / 1024,
                'created_timestamp': datetime.fromtimestamp(stat.st_ctime).isoformat(),
                'modified_timestamp': datetime.fromtimestamp(stat.st_mtime).isoformat(),
                'mime_type': self.get_mime_type(file_path),
                'detected_file_type': self.detect_file_type(file_path).value
            }
            
            # Add tabular-specific metadata
            if self.is_tabular_data(file_path):
                tabular_info = self.validate_tabular_content(file_path)
                if tabular_info['is_valid']:
                    metadata.update({
                        'row_count': tabular_info['row_count'],
                        'column_count': tabular_info['column_count'],
                        'columns': tabular_info['columns'],
                        'has_numeric_data': tabular_info['has_numeric_data'],
                        'has_missing_values': tabular_info['has_missing_values']
                    })
            
            return metadata
            
        except Exception as e:
            return {
                'filename': os.path.basename(file_path),
                'error': f'Could not extract metadata: {str(e)}'
            }
    
    def validate_file_security(self, file_path: str, max_size_mb: float = 100) -> Dict[str, Any]:
        """Validate file for security concerns
        
        Args:
            file_path: Path to file
            max_size_mb: Maximum allowed file size in MB
            
        Returns:
            Dict with security validation results
        """
        try:
            # Check file size
            file_size_mb = os.path.getsize(file_path) / 1024 / 1024
            if file_size_mb > max_size_mb:
                return {
                    'is_safe': False,
                    'reason': f'File size ({file_size_mb:.2f} MB) exceeds maximum allowed size ({max_size_mb} MB)'
                }
            
            # Check for path traversal
            normalized_path = os.path.normpath(file_path)
            if '..' in normalized_path or normalized_path.startswith('/'):
                return {
                    'is_safe': False,
                    'reason': 'Potential path traversal detected in file path'
                }
            
            # Check file extension against allowed types
            file_extension = Path(file_path).suffix.lower()
            allowed_extensions = (set(self.tabular_extensions.keys()) | 
                                self.audio_extensions | 
                                self.video_extensions | 
                                self.image_extensions)
            
            if file_extension not in allowed_extensions:
                return {
                    'is_safe': False,
                    'reason': f'File extension {file_extension} is not allowed'
                }
            
            return {
                'is_safe': True,
                'file_size_mb': file_size_mb,
                'file_type': self.detect_file_type(file_path).value
            }
            
        except Exception as e:
            return {
                'is_safe': False,
                'reason': f'Error during security validation: {str(e)}'
            }
    
    def process_file_batch(self, file_paths: List[str]) -> List[Dict[str, Any]]:
        """Process multiple files and return batch results"""
        results = []
        
        for file_path in file_paths:
            try:
                file_type = self.detect_file_type(file_path)
                metadata = self.extract_file_metadata(file_path)
                
                result = {
                    'file_path': file_path,
                    'file_type': file_type,
                    'metadata': metadata,
                    'should_process_eda': self.is_tabular_data(file_path),
                    'skip_to_packaging': self.is_media_file(file_path),
                    'processing_steps': self._get_processing_steps(file_type)
                }
                
                results.append(result)
                
            except Exception as e:
                results.append({
                    'file_path': file_path,
                    'file_type': FileType.UNSUPPORTED,
                    'error': str(e),
                    'should_process_eda': False,
                    'skip_to_packaging': False,
                    'processing_steps': []
                })
        
        return results
    
    def _get_processing_steps(self, file_type: FileType) -> List[str]:
        """Get recommended processing steps for file type"""
        if file_type in [FileType.TABULAR_CSV, FileType.TABULAR_EXCEL, 
                        FileType.TABULAR_JSON, FileType.TABULAR_PARQUET]:
            return ['pandas', 'numpy', 'matplotlib']
        elif file_type in [FileType.MEDIA_AUDIO, FileType.MEDIA_VIDEO, FileType.MEDIA_IMAGE]:
            return []  # Skip EDA processing
        else:
            return []


class EDAProcessor:
    """Processor for determining EDA workflow routing"""
    
    def __init__(self):
        self.detector = FileTypeDetector()
    
    def determine_processing_route(self, file_path: str) -> Dict[str, Any]:
        """Determine processing route for a file
        
        Returns:
            Dict with routing decision and processing steps
        """
        file_type = self.detector.detect_file_type(file_path)
        
        if self.detector.is_tabular_data(file_path):
            return {
                'should_process_eda': True,
                'file_type': file_type,
                'processing_steps': ['pandas', 'numpy', 'matplotlib'],
                'skip_to_packaging': False,
                'recommended_workflow': 'basic_eda'
            }
        elif self.detector.is_media_file(file_path):
            return {
                'should_process_eda': False,
                'file_type': file_type,
                'processing_steps': [],
                'skip_to_packaging': True,
                'recommended_workflow': 'media_packaging'
            }
        else:
            return {
                'should_process_eda': False,
                'file_type': file_type,
                'processing_steps': [],
                'skip_to_packaging': False,
                'recommended_workflow': 'unsupported'
            }