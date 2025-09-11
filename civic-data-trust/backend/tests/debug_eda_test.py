import requests
import json
import pandas as pd
import os
import traceback
from pathlib import Path

print("🔍 Debug EDA System Test - Corrected Format")
print("=" * 50)

# Configuration
BASE_URL = "http://localhost:8000"
HOUSING_CSV_PATH = "d:/The Data Island/UofT-DataTrust/UofT-DataTrust/civic-data-trust/public/Housing.csv"

def debug_test(test_name, test_func):
    """Run a test with detailed error reporting"""
    print(f"\n🧪 Testing: {test_name}")
    print("-" * 30)
    try:
        result = test_func()
        print(f"✅ {test_name}: SUCCESS")
        if isinstance(result, dict):
            print(f"   Response keys: {list(result.keys())}")
            if 'execution_summary' in result:
                summary = result['execution_summary']
                print(f"   Execution summary: {summary.get('total_functions_executed', 0)} functions executed")
        return result
    except Exception as e:
        print(f"❌ {test_name}: FAILED")
        print(f"   Error Type: {type(e).__name__}")
        print(f"   Error Message: {str(e)}")
        print(f"   Traceback:")
        traceback.print_exc()
        return None

def test_corrected_eda_request():
    """Test EDA request with correct format"""
    # Load sample data from housing CSV
    df = pd.read_csv(HOUSING_CSV_PATH)
    sample_data = df.head(5)
    csv_content = sample_data.to_csv(index=False)
    
    payload = {
        "node_id": "eda-test-node-1",
        "workflow_type": "basic_eda",
        "input_data": {
            "csv_content": csv_content,
            "filename": "housing_sample.csv"
        },
        "generate_download_link": False,
        "colab_optimized": False
    }
    
    print(f"   Sending corrected payload with node_id and input_data")
    print(f"   CSV content preview: {csv_content[:100]}...")
    
    response = requests.post(f"{BASE_URL}/api/v1/eda-execute/", json=payload)
    print(f"   Response status: {response.status_code}")
    
    if response.status_code != 200:
        print(f"   Response text: {response.text}")
        raise Exception(f"HTTP {response.status_code}: {response.text}")
    
    return response.json()

def test_custom_workflow():
    """Test custom workflow with function chain"""
    df = pd.read_csv(HOUSING_CSV_PATH)
    sample_data = df.head(10)
    csv_content = sample_data.to_csv(index=False)
    
    payload = {
        "node_id": "eda-custom-node-1",
        "workflow_type": "custom",
        "function_chain": [
            {
                "id": "step-1",
                "functionName": "head",
                "category": "Data Inspection",
                "library": "pandas",
                "parameters": {"n": 5},
                "description": "View first 5 rows"
            },
            {
                "id": "step-2",
                "functionName": "describe",
                "category": "Statistical Analysis",
                "library": "pandas",
                "parameters": {},
                "description": "Statistical summary"
            },
            {
                "id": "step-3",
                "functionName": "info",
                "category": "Data Inspection",
                "library": "pandas",
                "parameters": {},
                "description": "Data info"
            }
        ],
        "input_data": {
            "csv_content": csv_content,
            "filename": "housing_custom.csv"
        },
        "generate_download_link": False,
        "colab_optimized": False
    }
    
    print(f"   Testing custom workflow with 3 pandas functions")
    
    response = requests.post(f"{BASE_URL}/api/v1/eda-execute/", json=payload)
    print(f"   Response status: {response.status_code}")
    
    if response.status_code != 200:
        print(f"   Response text: {response.text}")
        raise Exception(f"HTTP {response.status_code}: {response.text}")
    
    return response.json()

def test_data_cleaning_workflow():
    """Test data cleaning workflow"""
    df = pd.read_csv(HOUSING_CSV_PATH)
    sample_data = df.head(20)  # Use more data for cleaning
    csv_content = sample_data.to_csv(index=False)
    
    payload = {
        "node_id": "eda-cleaning-node-1",
        "workflow_type": "data_cleaning",
        "input_data": {
            "csv_content": csv_content,
            "filename": "housing_cleaning.csv"
        },
        "generate_download_link": False,
        "colab_optimized": False
    }
    
    print(f"   Testing data cleaning workflow")
    
    response = requests.post(f"{BASE_URL}/api/v1/eda-execute/", json=payload)
    print(f"   Response status: {response.status_code}")
    
    if response.status_code != 200:
        print(f"   Response text: {response.text}")
        raise Exception(f"HTTP {response.status_code}: {response.text}")
    
    return response.json()

def test_visualization_workflow():
    """Test visualization workflow"""
    df = pd.read_csv(HOUSING_CSV_PATH)
    sample_data = df.head(50)  # Use more data for visualizations
    csv_content = sample_data.to_csv(index=False)
    
    payload = {
        "node_id": "eda-viz-node-1",
        "workflow_type": "visualization_suite",
        "input_data": {
            "csv_content": csv_content,
            "filename": "housing_viz.csv"
        },
        "generate_download_link": False,
        "colab_optimized": False
    }
    
    print(f"   Testing visualization suite workflow")
    
    response = requests.post(f"{BASE_URL}/api/v1/eda-execute/", json=payload)
    print(f"   Response status: {response.status_code}")
    
    if response.status_code != 200:
        print(f"   Response text: {response.text}")
        raise Exception(f"HTTP {response.status_code}: {response.text}")
    
    return response.json()

def test_file_processing_endpoint():
    """Test file processing endpoint"""
    df = pd.read_csv(HOUSING_CSV_PATH)
    sample_data = df.head(10)
    csv_content = sample_data.to_csv(index=False)
    
    payload = {
        "files": [
            {
                "file_content": csv_content,
                "filename": "housing_test.csv",
                "file_type": "text/csv"
            }
        ],
        "auto_detect_workflow": True,
        "batch_processing": False
    }
    
    print(f"   Testing file processing endpoint")
    
    response = requests.post(f"{BASE_URL}/api/v1/eda-execute/process-files", json=payload)
    print(f"   Response status: {response.status_code}")
    
    if response.status_code != 200:
        print(f"   Response text: {response.text}")
        raise Exception(f"HTTP {response.status_code}: {response.text}")
    
    return response.json()

def test_backend_health():
    """Test backend health"""
    response = requests.get(f"{BASE_URL}/api/v1/eda-execute/health")
    print(f"   Health status: {response.status_code}")
    
    if response.status_code == 200:
        health_data = response.json()
        print(f"   System status: {health_data.get('status')}")
        print(f"   Active executions: {health_data.get('active_executions', 0)}")
        return health_data
    else:
        raise Exception(f"Health check failed: {response.text}")

# Run comprehensive debug tests
print("\n🏥 Backend Health Check")
debug_test("Backend Health", test_backend_health)

print("\n📊 EDA Workflow Tests")
debug_test("Basic EDA Workflow (Corrected)", test_corrected_eda_request)
debug_test("Custom Workflow", test_custom_workflow)
debug_test("Data Cleaning Workflow", test_data_cleaning_workflow)
debug_test("Visualization Workflow", test_visualization_workflow)

print("\n📁 File Processing Test")
debug_test("File Processing Endpoint", test_file_processing_endpoint)

print("\n" + "=" * 50)
print("🎯 COMPREHENSIVE DEBUG RESULTS")
print("=" * 50)
print("✅ All tests completed with detailed error reporting")
print("📋 Check individual test results above for specific issues")
print("=" * 50)