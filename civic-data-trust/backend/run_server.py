#!/usr/bin/env python3
"""
Simple startup script for the Data Science Workflow API
"""

import subprocess
import sys
import os

def check_dependencies():
    """Check if required packages are installed"""
    required_packages = [
        'fastapi', 'uvicorn', 'pandas', 'numpy', 'matplotlib', 'pydantic', 'pydantic_settings'
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            if package == 'pydantic_settings':
                __import__('pydantic_settings')
            else:
                __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print("[ERROR] Missing required packages:")
        for package in missing_packages:
            print(f"   - {package}")
        print("\nInstall them with: pip install -r requirements.txt")
        return False
    
    print("[OK] All dependencies are installed")
    return True

def start_server():
    """Start the FastAPI server"""
    print("[START] Starting Data Science Workflow API...")
    print("[INFO] Server will be available at: http://localhost:8000")
    print("[INFO] API docs will be available at: http://localhost:8000/docs")
    print("[INFO] API endpoints will be at: http://localhost:8000/api/v1")
    print("[INFO] Press Ctrl+C to stop the server")
    print("-" * 60)
    
    try:
        # Start the server using uvicorn
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "app.main:app", 
            "--host", "0.0.0.0", 
            "--port", "8000", 
            "--reload"
        ])
    except KeyboardInterrupt:
        print("\n[STOP] Server stopped by user")
    except Exception as e:
        print(f"[ERROR] Error starting server: {e}")

def main():
    """Main function"""
    print("Data Science Workflow API - Startup Script")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists('app') or not os.path.exists('app/main.py'):
        print("[ERROR] app/main.py not found in current directory")
        print("Make sure you're running this script from the backend directory")
        print("Expected structure:")
        print("  backend/")
        print("    app/")
        print("      main.py")
        print("    run_server.py  <- you are here")
        return
    
    # Check dependencies
    if not check_dependencies():
        return
    
    # Start server
    start_server()

if __name__ == "__main__":
    main()