#!/usr/bin/env python
"""
Backend Validation Script for Data Science Workflow Canvas
This script validates that all required components are properly installed and configured.
"""
import sys
import importlib
import os
import subprocess
import time

# ANSI color codes for terminal output
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
RESET = "\033[0m"
BOLD = "\033[1m"

def print_status(message, status, color=GREEN):
    """Print a formatted status message"""
    print(f"{message.ljust(60)} [{color}{status}{RESET}]")

def check_python_version():
    """Check if Python version is 3.12 or higher"""
    version = sys.version_info
    if version.major == 3 and version.minor >= 12:
        print_status("Python version", f"{version.major}.{version.minor}.{version.micro}")
        return True
    else:
        print_status(
            f"Python version (need 3.12+, found {version.major}.{version.minor}.{version.micro})",
            "WARNING", YELLOW
        )
        return False

def check_dependencies():
    """Check if all required dependencies are installed"""
    required_packages = [
        "fastapi", "uvicorn", "pandas", "numpy", "matplotlib", 
        "python-multipart", "pydantic", "pydantic-settings", "pillow"
    ]
    
    all_installed = True
    for package in required_packages:
        try:
            importlib.import_module(package)
            print_status(f"Package: {package}", "INSTALLED")
        except ImportError:
            print_status(f"Package: {package}", "MISSING", RED)
            all_installed = False
    
    return all_installed

def check_file_structure():
    """Check if all required files and directories exist"""
    required_paths = [
        "app/__init__.py",
        "app/main.py",
        "app/api/__init__.py",
        "app/api/api.py",
        "app/api/endpoints/__init__.py",
        "app/api/endpoints/execute.py",
        "app/api/endpoints/data.py",
        "app/core/__init__.py",
        "app/core/config.py",
        "app/core/executor.py",
        "app/models/__init__.py",
        "app/models/requests.py",
        "app/models/responses.py",
        "app/data/__init__.py",
        "app/data/sample_data.py",
        "tests/test_api.py",
        "requirements.txt",
        "run_server.py"
    ]
    
    all_exist = True
    for path in required_paths:
        if os.path.exists(path):
            print_status(f"File: {path}", "EXISTS")
        else:
            print_status(f"File: {path}", "MISSING", RED)
            all_exist = False
    
    return all_exist

def check_server_startup():
    """Check if the server can start up without errors"""
    try:
        # Start server in a subprocess
        process = subprocess.Popen(
            [sys.executable, "run_server.py"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Wait a bit for server to start
        time.sleep(2)
        
        # Check if process is still running
        if process.poll() is None:
            print_status("Server startup", "SUCCESS")
            # Kill the server process
            process.terminate()
            return True
        else:
            stdout, stderr = process.communicate()
            print_status("Server startup", "FAILED", RED)
            print(f"\n{RED}Server Error:{RESET}\n{stderr}")
            return False
    except Exception as e:
        print_status("Server startup", "ERROR", RED)
        print(f"\n{RED}Exception:{RESET} {str(e)}")
        return False

def main():
    """Run all validation checks"""
    print(f"\n{BOLD}🔍 VALIDATING BACKEND SETUP{RESET}\n")
    
    python_ok = check_python_version()
    print("\n")
    
    deps_ok = check_dependencies()
    print("\n")
    
    files_ok = check_file_structure()
    print("\n")
    
    server_ok = check_server_startup()
    print("\n")
    
    # Final summary
    if python_ok and deps_ok and files_ok and server_ok:
        print(f"{GREEN}{BOLD}🎉 ALL VALIDATION TESTS PASSED!{RESET}")
        print("You can now run the server with: python run_server.py")
        return 0
    else:
        print(f"{YELLOW}{BOLD}⚠️ SOME VALIDATION TESTS FAILED{RESET}")
        print("Please fix the issues above before running the server.")
        return 1

if __name__ == "__main__":
    sys.exit(main())