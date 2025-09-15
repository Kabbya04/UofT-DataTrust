"""Application constants."""

from typing import List

# File handling constants
DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_FILE_EXTENSIONS: List[str] = [".csv", ".xlsx", ".json", ".png", ".jpg", ".jpeg"]

# Cleanup intervals
CLEANUP_INTERVALS = {
    "notebook_files": 86400,  # 24 hours
    "temp_files": 3600,       # 1 hour
    "cache_files": 21600      # 6 hours
}

# Execution constants
MAX_EXECUTION_TIME = 300  # 5 minutes
MAX_CHAIN_LENGTH = 20

# Notebook constants
NOTEBOOK_PERMANENT_FILES = ['Welcome.ipynb', 'startup.py']