#!/usr/bin/env python3
"""
Verification script for backend refactoring.
Tests that all new modules can be imported and basic functionality works.
"""

import sys
import os
import traceback
from pathlib import Path

# Add the parent directory to Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

def test_imports():
    """Test that all new modules can be imported."""
    print("🧪 Testing module imports...")

    tests = [
        # Core modules
        ("app.core.eda.executor", "EDAExecutor"),
        ("app.core.eda.workflows", "WorkflowManager"),
        ("app.core.eda.processors", "DataProcessor"),
        ("app.core.file_processing.detector", "FileProcessor"),
        ("app.core.file_processing.manager", "FileManager"),
        ("app.core.notebook.manager", "NotebookManager"),

        # Utilities
        ("app.utils.logging", "get_logger"),
        ("app.utils.performance", "track_execution_time"),
        ("app.utils.validation", "validate_file_type"),

        # Exceptions
        ("app.exceptions.eda", "EDAExecutionError"),
        ("app.exceptions.file", "FileProcessingError"),
        ("app.exceptions.notebook", "NotebookError"),

        # Dependencies
        ("app.api.dependencies.core", "get_settings"),
        ("app.api.exception_handlers", "register_exception_handlers"),

        # Main application
        ("app.main_refactored", "app"),
    ]

    passed = 0
    failed = 0

    for module_name, class_name in tests:
        try:
            module = __import__(module_name, fromlist=[class_name])
            getattr(module, class_name)
            print(f"  ✅ {module_name}.{class_name}")
            passed += 1
        except Exception as e:
            print(f"  ❌ {module_name}.{class_name} - {e}")
            failed += 1

    print(f"\n📊 Import Results: {passed} passed, {failed} failed")
    return failed == 0

def test_basic_functionality():
    """Test basic functionality of key modules."""
    print("\n🔧 Testing basic functionality...")

    try:
        # Test EDA executor
        from app.core.eda.executor import EDAExecutor
        from app.core.eda.models import EDARequest

        executor = EDAExecutor()
        print("  ✅ EDA executor initialization")

        # Test file processor
        from app.core.file_processing.detector import FileProcessor

        processor = FileProcessor()
        print("  ✅ File processor initialization")

        # Test workflow manager
        from app.core.eda.workflows import WorkflowManager

        workflow_manager = WorkflowManager()
        workflows = workflow_manager.list_available_workflows()
        assert len(workflows) > 0
        print(f"  ✅ Workflow manager ({len(workflows)} workflows available)")

        # Test exception hierarchy
        from app.exceptions.eda import EDAExecutionError
        from app.exceptions.file import FileProcessingError

        print("  ✅ Exception hierarchy")

        # Test utilities
        from app.utils.logging import get_logger
        from app.utils.performance import memory_monitor

        logger = get_logger("test")
        memory_info = memory_monitor()
        assert "rss_mb" in memory_info
        print("  ✅ Utility functions")

        print("\n📊 Functionality tests: All passed ✅")
        return True

    except Exception as e:
        print(f"\n❌ Functionality test failed: {e}")
        traceback.print_exc()
        return False

def test_directory_structure():
    """Verify the new directory structure exists."""
    print("\n📁 Testing directory structure...")

    base_path = Path(__file__).parent.parent / "app"
    required_dirs = [
        "api/dependencies",
        "core/eda",
        "core/file_processing",
        "core/notebook",
        "core/common",
        "utils",
        "exceptions",
        "../tests/unit",
        "../tests/integration",
        "../scripts"
    ]

    missing = []
    for dir_path in required_dirs:
        full_path = base_path / dir_path
        if full_path.exists():
            print(f"  ✅ {dir_path}")
        else:
            print(f"  ❌ {dir_path}")
            missing.append(dir_path)

    if not missing:
        print("\n📊 Directory structure: All required directories exist ✅")
        return True
    else:
        print(f"\n❌ Missing directories: {missing}")
        return False

def main():
    """Run all verification tests."""
    print("🚀 Backend Refactoring Verification")
    print("=" * 50)

    # Change to backend directory
    backend_dir = Path(__file__).parent.parent
    os.chdir(backend_dir)

    all_passed = True

    # Test directory structure
    all_passed &= test_directory_structure()

    # Test imports
    all_passed &= test_imports()

    # Test basic functionality
    all_passed &= test_basic_functionality()

    print("\n" + "=" * 50)

    if all_passed:
        print("🎉 All verification tests passed!")
        print("✅ Backend refactoring is complete and functional")
        print("\nTo start the refactored application:")
        print("  python -m app.main_refactored")
        print("  # or")
        print("  uvicorn app.main_refactored:app --reload")
        return 0
    else:
        print("❌ Some verification tests failed")
        print("Please check the errors above and fix any issues")
        return 1

if __name__ == "__main__":
    sys.exit(main())