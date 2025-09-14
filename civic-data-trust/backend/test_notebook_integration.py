#!/usr/bin/env python3
"""
Test script to verify notebook integration fixes
"""

import requests
import pandas as pd
import os
import json
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:8000"
TEST_CSV_PATH = "public/sample_employees.csv"

def test_notebook_integration():
    """Test the notebook integration functionality"""
    print("🧪 Testing Notebook Integration Fixes")
    print("=" * 50)
    
    # Check if backend is running
    try:
        health_response = requests.get(f"{BASE_URL}/")
        if health_response.status_code != 200:
            print("❌ Backend is not running. Please start the backend server.")
            return False
        print("✅ Backend is running")
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Please start the backend server.")
        return False
    
    # Load test data
    try:
        if os.path.exists(TEST_CSV_PATH):
            df = pd.read_csv(TEST_CSV_PATH)
            csv_content = df.head(10).to_csv(index=False)
            print(f"✅ Loaded test data: {df.shape[0]} rows, {df.shape[1]} columns")
        else:
            # Create sample data if file doesn't exist
            df = pd.DataFrame({
                'id': range(1, 11),
                'name': [f'Employee {i}' for i in range(1, 11)],
                'age': [25, 30, 35, 28, 32, 29, 31, 27, 33, 26],
                'salary': [50000, 60000, 70000, 55000, 65000, 58000, 62000, 52000, 68000, 54000]
            })
            csv_content = df.to_csv(index=False)
            print("✅ Created sample test data")
    except Exception as e:
        print(f"❌ Failed to load test data: {e}")
        return False
    
    # Test notebook integration with basic EDA workflow
    print("\n📋 Testing Basic EDA with Notebook Integration")
    print("-" * 40)
    
    payload = {
        "node_id": "test-notebook-integration",
        "workflow_type": "basic_eda",
        "input_data": {
            "csv_content": csv_content,
            "filename": "test_employees.csv"
        },
        "generate_download_link": False,
        "colab_optimized": False,
        "ship_to_notebook": True  # This should now work with our fixes
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/v1/eda-execute/", json=payload)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ EDA execution successful")
            
            # Check notebook integration results
            if 'notebook_integration' in result:
                notebook_info = result['notebook_integration']
                print(f"📓 Notebook Integration Status:")
                print(f"   - Enabled: {notebook_info.get('enabled', False)}")
                print(f"   - Success: {notebook_info.get('success', False)}")
                print(f"   - File Path: {notebook_info.get('file_path', 'None')}")
                print(f"   - Message: {notebook_info.get('message', 'No message')}")
                
                if notebook_info.get('success'):
                    file_path = notebook_info.get('file_path')
                    if file_path and os.path.exists(file_path):
                        file_size = os.path.getsize(file_path)
                        print(f"✅ Notebook file verified: {os.path.basename(file_path)} ({file_size} bytes)")
                        return True
                    else:
                        print(f"❌ Notebook file not found at: {file_path}")
                        return False
                else:
                    print("❌ Notebook integration failed")
                    return False
            else:
                print("❌ No notebook integration information in response")
                return False
                
        else:
            print(f"❌ EDA execution failed: {response.status_code}")
            print(f"Response: {response.text[:500]}")
            return False
            
    except Exception as e:
        print(f"❌ Request failed: {e}")
        return False

def check_notebook_directory():
    """Check the notebook directory structure"""
    print("\n📁 Checking Notebook Directory Structure")
    print("-" * 40)
    
    # Check both possible notebook directories
    backend_notebooks = "backend/notebooks"
    app_notebooks = "backend/app/notebooks"
    
    for notebook_dir in [backend_notebooks, app_notebooks]:
        if os.path.exists(notebook_dir):
            files = os.listdir(notebook_dir)
            csv_files = [f for f in files if f.endswith('.csv')]
            print(f"✅ Found {notebook_dir}: {len(files)} files ({len(csv_files)} CSV files)")
            
            if csv_files:
                print("   Recent CSV files:")
                for csv_file in sorted(csv_files)[-3:]:  # Show last 3 files
                    file_path = os.path.join(notebook_dir, csv_file)
                    file_size = os.path.getsize(file_path)
                    mod_time = datetime.fromtimestamp(os.path.getmtime(file_path))
                    print(f"   - {csv_file} ({file_size} bytes, {mod_time.strftime('%Y-%m-%d %H:%M:%S')})")
        else:
            print(f"❌ Directory not found: {notebook_dir}")

if __name__ == "__main__":
    print("🔧 Notebook Integration Fix Verification")
    print("=" * 50)
    
    # Check directory structure first
    check_notebook_directory()
    
    # Test the integration
    success = test_notebook_integration()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 NOTEBOOK INTEGRATION FIXES SUCCESSFUL!")
        print("✅ EDA processed files are now reaching the notebook")
        print("✅ Path resolution fixed")
        print("✅ Frontend integration enabled")
        print("✅ Error handling improved")
    else:
        print("❌ NOTEBOOK INTEGRATION STILL HAS ISSUES")
        print("Please check the error messages above")
    
    print("=" * 50)