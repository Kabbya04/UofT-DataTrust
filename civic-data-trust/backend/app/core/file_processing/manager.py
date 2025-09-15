"""File management utilities."""

import os
import shutil
import tempfile
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from app.utils.logging import get_logger
from app.utils.time_utils import get_timestamp
from app.core.common.constants import CLEANUP_INTERVALS, NOTEBOOK_PERMANENT_FILES
from app.exceptions.file import FileNotFoundError, FileProcessingError

logger = get_logger(__name__)


class FileManager:
    """Manages file operations and cleanup."""

    def __init__(self, base_directory: Optional[str] = None):
        self.base_directory = base_directory or os.getcwd()

    def create_temp_file(self, suffix: str = "", prefix: str = "temp_") -> str:
        """Create a temporary file and return its path."""
        try:
            temp_fd, temp_path = tempfile.mkstemp(suffix=suffix, prefix=prefix)
            os.close(temp_fd)  # Close the file descriptor
            return temp_path
        except Exception as e:
            logger.error(f"Failed to create temporary file: {e}")
            raise FileProcessingError(f"Could not create temporary file: {str(e)}")

    def create_temp_directory(self, prefix: str = "temp_dir_") -> str:
        """Create a temporary directory and return its path."""
        try:
            return tempfile.mkdtemp(prefix=prefix)
        except Exception as e:
            logger.error(f"Failed to create temporary directory: {e}")
            raise FileProcessingError(f"Could not create temporary directory: {str(e)}")

    def ensure_directory_exists(self, directory_path: str) -> None:
        """Ensure directory exists, create if it doesn't."""
        try:
            Path(directory_path).mkdir(parents=True, exist_ok=True)
        except Exception as e:
            logger.error(f"Failed to create directory {directory_path}: {e}")
            raise FileProcessingError(f"Could not create directory: {str(e)}")

    def copy_file(self, source_path: str, destination_path: str) -> None:
        """Copy file from source to destination."""
        try:
            if not os.path.exists(source_path):
                raise FileNotFoundError(source_path)

            # Ensure destination directory exists
            dest_dir = os.path.dirname(destination_path)
            self.ensure_directory_exists(dest_dir)

            shutil.copy2(source_path, destination_path)
            logger.info(f"File copied from {source_path} to {destination_path}")

        except Exception as e:
            logger.error(f"Failed to copy file: {e}")
            raise FileProcessingError(f"Could not copy file: {str(e)}")

    def move_file(self, source_path: str, destination_path: str) -> None:
        """Move file from source to destination."""
        try:
            if not os.path.exists(source_path):
                raise FileNotFoundError(source_path)

            # Ensure destination directory exists
            dest_dir = os.path.dirname(destination_path)
            self.ensure_directory_exists(dest_dir)

            shutil.move(source_path, destination_path)
            logger.info(f"File moved from {source_path} to {destination_path}")

        except Exception as e:
            logger.error(f"Failed to move file: {e}")
            raise FileProcessingError(f"Could not move file: {str(e)}")

    def delete_file(self, file_path: str, ignore_missing: bool = True) -> bool:
        """Delete a file."""
        try:
            if not os.path.exists(file_path):
                if ignore_missing:
                    return True
                raise FileNotFoundError(file_path)

            os.remove(file_path)
            logger.info(f"File deleted: {file_path}")
            return True

        except Exception as e:
            logger.error(f"Failed to delete file {file_path}: {e}")
            if not ignore_missing:
                raise FileProcessingError(f"Could not delete file: {str(e)}")
            return False

    def delete_directory(self, directory_path: str, ignore_missing: bool = True) -> bool:
        """Delete a directory and its contents."""
        try:
            if not os.path.exists(directory_path):
                if ignore_missing:
                    return True
                raise FileNotFoundError(directory_path)

            shutil.rmtree(directory_path)
            logger.info(f"Directory deleted: {directory_path}")
            return True

        except Exception as e:
            logger.error(f"Failed to delete directory {directory_path}: {e}")
            if not ignore_missing:
                raise FileProcessingError(f"Could not delete directory: {str(e)}")
            return False

    def list_files(self, directory_path: str, pattern: str = "*") -> List[str]:
        """List files in directory matching pattern."""
        try:
            directory = Path(directory_path)
            if not directory.exists():
                return []

            return [str(f) for f in directory.glob(pattern) if f.is_file()]

        except Exception as e:
            logger.error(f"Failed to list files in {directory_path}: {e}")
            return []

    def get_file_age(self, file_path: str) -> timedelta:
        """Get file age as timedelta."""
        if not os.path.exists(file_path):
            raise FileNotFoundError(file_path)

        file_mtime = datetime.fromtimestamp(os.path.getmtime(file_path))
        return get_timestamp() - file_mtime

    def cleanup_old_files(
        self,
        directory_path: str,
        max_age_seconds: int,
        file_pattern: str = "*",
        preserve_files: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Clean up old files in directory."""
        preserve_files = preserve_files or []
        files_removed = 0
        errors = []

        try:
            if not os.path.exists(directory_path):
                return {
                    'files_removed': 0,
                    'errors': [f'Directory does not exist: {directory_path}']
                }

            current_time = get_timestamp()
            max_age = timedelta(seconds=max_age_seconds)

            for file_path in self.list_files(directory_path, file_pattern):
                file_name = os.path.basename(file_path)

                # Skip preserved files
                if file_name in preserve_files:
                    continue

                try:
                    file_age = self.get_file_age(file_path)
                    if file_age > max_age:
                        if self.delete_file(file_path):
                            files_removed += 1

                except Exception as e:
                    error_msg = f"Failed to process {file_path}: {str(e)}"
                    errors.append(error_msg)
                    logger.warning(error_msg)

            if files_removed > 0:
                logger.info(f"Cleaned up {files_removed} old files from {directory_path}")

        except Exception as e:
            error_msg = f"Cleanup failed for {directory_path}: {str(e)}"
            errors.append(error_msg)
            logger.error(error_msg)

        return {
            'files_removed': files_removed,
            'errors': errors
        }

    def cleanup_notebook_files(self, notebooks_directory: str) -> Dict[str, Any]:
        """Clean up old notebook files (24-hour retention)."""
        return self.cleanup_old_files(
            directory_path=notebooks_directory,
            max_age_seconds=CLEANUP_INTERVALS['notebook_files'],
            preserve_files=NOTEBOOK_PERMANENT_FILES
        )

    def cleanup_temp_files(self, temp_directory: str) -> Dict[str, Any]:
        """Clean up temporary files (1-hour retention)."""
        return self.cleanup_old_files(
            directory_path=temp_directory,
            max_age_seconds=CLEANUP_INTERVALS['temp_files']
        )

    def get_directory_size(self, directory_path: str) -> int:
        """Get total size of directory in bytes."""
        total_size = 0
        try:
            for dirpath, dirnames, filenames in os.walk(directory_path):
                for filename in filenames:
                    file_path = os.path.join(dirpath, filename)
                    if os.path.exists(file_path):
                        total_size += os.path.getsize(file_path)
        except Exception as e:
            logger.error(f"Error calculating directory size for {directory_path}: {e}")
        return total_size