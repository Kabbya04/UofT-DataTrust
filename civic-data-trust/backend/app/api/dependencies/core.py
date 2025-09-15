"""Core dependencies for FastAPI dependency injection."""

from functools import lru_cache
from app.core.config import Settings, settings
from app.core.eda.executor import EDAExecutor
from app.core.file_processing.detector import FileProcessor


@lru_cache()
def get_settings() -> Settings:
    """Get application settings (cached)."""
    return settings


def get_eda_executor() -> EDAExecutor:
    """Get EDA executor instance."""
    return EDAExecutor()


def get_file_processor() -> FileProcessor:
    """Get file processor instance."""
    return FileProcessor()