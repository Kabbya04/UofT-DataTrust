#!/usr/bin/env python3
"""
Test script to verify CSV upload and numpy operations functionality
"""

import requests
import json

# Test CSV content with numeric data
test_csv_content = """id,temperature,humidity,pressure
1,23.5,65.2,1013.25
2,25.1,68.7,1012.80
3,22.8,62.4,1014.10
4,26.3,71.2,1011.95
5,24.7,66.8,1013.45"""

def test_csv_upload():
    """Test CSV upload endpoint"""
    print("\n=== Testing CSV Upload ===")
    
    url = "http://localhost:8000/api/v1/data/upload-csv"
    payload = {
        "csv_content": test_csv_content,
        "filename": "test_data.csv"
    }
    
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            data = response.json()
            print("✅ CSV upload successful!")
            print(f"   Shape: {data['shape']}")
            print(f"   Columns: {data['columns']}")
            print(f"   Numeric columns: {data['summary']['numeric_columns']}")
            return True
        else:
            print(f"❌ CSV upload failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error testing CSV upload: {e}")
        return False

def test_numpy_execution():
    """Test numpy operations with CSV data"""
    print("\n=== Testing NumPy Operations with CSV Data ===")
    
    url = "http://localhost:8000/api/v1/execute/"
    payload = {
        "node_id": "test-csv-numpy-node",
        "library": "numpy",
        "function_chain": [
            {
                "id": "step-1",
                "functionName": "mean",
                "category": "Mathematical Operations",
                "parameters": {
                    "axis": "None"
                },
                "description": "Calculate mean of all numeric values"
            },
            {
                "id": "step-2",
                "functionName": "std",
                "category": "Mathematical Operations",
                "parameters": {
                    "axis": "None"
                },
                "description": "Calculate standard deviation"
            }
        ],
        "input_data": {
            "csv_content": test_csv_content,
            "filename": "test_data.csv"
        }
    }
    
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            data = response.json()
            print("✅ NumPy execution successful!")
            print(f"   Success: {data['success']}")
            print(f"   Steps executed: {data['steps_executed']}/{data['total_steps']}")
            
            for i, result in enumerate(data['results']):
                print(f"   Step {i+1} ({result['function_name']}): {result['success']}")
                if result['success']:
                    print(f"      Result: {result['result']}")
                else:
                    print(f"      Error: {result.get('error', 'Unknown error')}")
            return True
        else:
            print(f"❌ NumPy execution failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error testing NumPy execution: {e}")
        return False

def test_pandas_execution():
    """Test pandas operations with CSV data"""
    print("\n=== Testing Pandas Operations with CSV Data ===")
    
    url = "http://localhost:8000/api/v1/execute/"
    payload = {
        "node_id": "test-csv-pandas-node",
        "library": "pandas",
        "function_chain": [
            {
                "id": "step-1",
                "functionName": "head",
                "category": "Data Inspection",
                "parameters": {
                    "n": 3
                },
                "description": "Show first 3 rows"
            },
            {
                "id": "step-2",
                "functionName": "describe",
                "category": "Data Inspection",
                "parameters": {
                    "include": "number"
                },
                "description": "Describe numeric columns"
            }
        ],
        "input_data": {
            "csv_content": test_csv_content,
            "filename": "test_data.csv"
        }
    }
    
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            data = response.json()
            print("✅ Pandas execution successful!")
            print(f"   Success: {data['success']}")
            print(f"   Steps executed: {data['steps_executed']}/{data['total_steps']}")
            
            for i, result in enumerate(data['results']):
                print(f"   Step {i+1} ({result['function_name']}): {result['success']}")
                if result['success'] and i == 0:  # Show head result
                    print(f"      First 3 rows: {len(result['result'])} records")
            return True
        else:
            print(f"❌ Pandas execution failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error testing Pandas execution: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing Custom CSV Upload with NumPy Operations")
    print("=" * 60)
    
    # Test CSV upload
    csv_success = test_csv_upload()
    
    # Test NumPy operations
    numpy_success = test_numpy_execution()
    
    # Test Pandas operations
    pandas_success = test_pandas_execution()
    
    print("\n" + "=" * 60)
    print("📊 Test Results Summary:")
    print(f"   CSV Upload: {'✅ PASS' if csv_success else '❌ FAIL'}")
    print(f"   NumPy Operations: {'✅ PASS' if numpy_success else '❌ FAIL'}")
    print(f"   Pandas Operations: {'✅ PASS' if pandas_success else '❌ FAIL'}")
    
    if csv_success and numpy_success and pandas_success:
        print("\n🎉 All tests passed! Custom CSV upload with NumPy operations is working correctly.")
        return True
    else:
        print("\n⚠️  Some tests failed. Please check the implementation.")
        return False

if __name__ == "__main__":
    main()