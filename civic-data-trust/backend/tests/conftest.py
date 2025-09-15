"""Test configuration and fixtures."""

import pytest
import tempfile
import os
from typing import Generator
from fastapi.testclient import TestClient
from app.main import app
from app.core.eda.executor import EDAExecutor
from app.core.file_processing.detector import FileProcessor


@pytest.fixture
def client() -> TestClient:
    """Create test client."""
    return TestClient(app)


@pytest.fixture
def temp_directory() -> Generator[str, None, None]:
    """Create temporary directory for tests."""
    with tempfile.TemporaryDirectory() as temp_dir:
        yield temp_dir


@pytest.fixture
def sample_csv_file(temp_directory: str) -> str:
    """Create sample CSV file for testing."""
    csv_content = """name,age,city
Alice,25,New York
Bob,30,London
Charlie,35,Paris"""

    file_path = os.path.join(temp_directory, "sample.csv")
    with open(file_path, "w") as f:
        f.write(csv_content)

    return file_path


@pytest.fixture
def eda_executor() -> EDAExecutor:
    """Create EDA executor instance."""
    return EDAExecutor()


@pytest.fixture
def file_processor() -> FileProcessor:
    """Create file processor instance."""
    return FileProcessor()


@pytest.fixture
def sample_data():
    """Sample data for testing."""
    return {
        "name": ["Alice", "Bob", "Charlie"],
        "age": [25, 30, 35],
        "city": ["New York", "London", "Paris"]
    }