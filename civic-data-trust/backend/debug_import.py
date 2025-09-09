#!/usr/bin/env python3
"""
Debug script to identify EDA module import issues
"""

import sys
import traceback

def test_import(module_name, import_statement):
    """Test a specific import and report results"""
    print(f"\n--- Testing {module_name} ---")
    try:
        exec(import_statement)
        print(f"✅ {module_name}: SUCCESS")
        return True
    except Exception as e:
        print(f"❌ {module_name}: FAILED")
        print(f"Error: {e}")
        print("Traceback:")
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("EDA Module Import Debug Report")
    print("=" * 50)
    
    # Test individual components
    tests = [
        ("File Detector", "from app.core.file_detector import FileTypeDetector"),
        ("EDA Executor", "from app.core.eda_executor import EDAExecutor"),
        ("Cloudflare Service", "from app.services.cloudflare_service import CloudflareService"),
        ("File Packaging Service", "from app.services.file_packaging_service import FilePackagingService"),
        ("EDA Requests", "from app.models.eda_requests import EDAExecutionRequest"),
        ("EDA Responses", "from app.models.eda_responses import EDAExecutionResponse"),
        ("EDA Execute Endpoint", "from app.api.endpoints.eda_execute import router")
    ]
    
    results = []
    for name, import_stmt in tests:
        success = test_import(name, import_stmt)
        results.append((name, success))
    
    print("\n" + "=" * 50)
    print("SUMMARY:")
    for name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {name}")
    
    failed_count = sum(1 for _, success in results if not success)
    if failed_count == 0:
        print("\n🎉 All imports successful!")
    else:
        print(f"\n⚠️  {failed_count} imports failed")