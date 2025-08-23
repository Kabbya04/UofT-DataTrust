import requests
import json
import base64
from PIL import Image
import io
import sys
import os

# Add the parent directory to the path so we can import from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# API base URL
BASE_URL = "http://localhost:8000"
API_BASE = f"{BASE_URL}/api/v1"

def test_health_check():
    """Test health check endpoint"""
    print("=== Testing Health Check ===")
    response = requests.get(f"{BASE_URL}/health")
    if response.status_code == 200:
        data = response.json()
        print(f"Health status: {data['status']}")
        return True
    else:
        print(f"Error: {response.status_code}")
        return False

def test_sample_data():
    """Test getting sample data"""
    print("\n=== Testing Sample Data Endpoint ===")
    response = requests.get(f"{API_BASE}/data/sample")
    if response.status_code == 200:
        data = response.json()
        print("Available datasets:")
        for name, info in data["datasets"].items():
            print(f"  - {name}: {info['shape']} shape, columns: {info['columns']}")
        return True
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return False

def test_specific_dataset():
    """Test getting a specific dataset"""
    print("\n=== Testing Specific Dataset Endpoint ===")
    response = requests.get(f"{API_BASE}/data/sample/users")
    if response.status_code == 200:
        data = response.json()
        print(f"Users dataset shape: {data['shape']}")
        print(f"Columns: {data['columns']}")
        print(f"First record: {data['data'][0] if data['data'] else 'No data'}")
        return True
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return False

def test_pandas_chain():
    """Test pandas function chain execution"""
    print("\n=== Testing Pandas Function Chain ===")
    
    # Create a function chain for pandas operations
    function_chain = [
        {
            "id": "step-1",
            "functionName": "filter_rows",
            "category": "Data Selection",
            "parameters": {
                "column": "age",
                "operator": ">",
                "value": "30"
            },
            "description": "Filter users over 30"
        },
        {
            "id": "step-2", 
            "functionName": "select_columns",
            "category": "Data Selection",
            "parameters": {
                "columns": "name,age,salary,department"
            },
            "description": "Select specific columns"
        },
        {
            "id": "step-3",
            "functionName": "sort_values",
            "category": "Data Manipulation", 
            "parameters": {
                "by": "salary",
                "ascending": False
            },
            "description": "Sort by salary descending"
        }
    ]
    
    request_data = {
        "node_id": "test-pandas-node",
        "library": "pandas",
        "function_chain": function_chain,
        "input_data": {"dataset_name": "users"}
    }
    
    response = requests.post(f"{API_BASE}/execute/", json=request_data)
    
    if response.status_code == 200:
        result = response.json()
        print(f"Execution successful: {result['success']}")
        print(f"Steps executed: {result['steps_executed']}/{result['total_steps']}")
        print(f"Total execution time: {result['total_execution_time_ms']:.2f}ms")
        
        for i, step_result in enumerate(result['results']):
            print(f"\nStep {i+1}: {step_result['function_name']}")
            print(f"  Success: {step_result['success']}")
            print(f"  Execution time: {step_result['execution_time_ms']:.2f}ms")
            if step_result['success'] and step_result['result']:
                if isinstance(step_result['result'], list):
                    print(f"  Result: {len(step_result['result'])} records")
                    if len(step_result['result']) > 0:
                        print(f"  Sample: {step_result['result'][0]}")
                else:
                    print(f"  Result: {step_result['result']}")
            elif not step_result['success']:
                print(f"  Error: {step_result['error']}")
        
        if result['final_output']:
            print(f"\nFinal output: {len(result['final_output'])} records")
            print("Sample records:")
            for record in result['final_output'][:3]:
                print(f"  {record}")
        
        return True
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return False

def test_numpy_operations():
    """Test numpy function chain"""
    print("\n=== Testing NumPy Function Chain ===")
    
    function_chain = [
        {
            "id": "step-1",
            "functionName": "mean",
            "category": "Mathematical Operations",
            "parameters": {
                "axis": "None"
            },
            "description": "Calculate mean of all values"
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
    ]
    
    # Test with the users salary data
    request_data = {
        "node_id": "test-numpy-node",
        "library": "numpy",
        "function_chain": function_chain,
        "input_data": {"dataset_name": "users"}
    }
    
    response = requests.post(f"{API_BASE}/execute/", json=request_data)
    
    if response.status_code == 200:
        result = response.json()
        print(f"Execution successful: {result['success']}")
        print(f"Steps executed: {result['steps_executed']}/{result['total_steps']}")
        
        for i, step_result in enumerate(result['results']):
            print(f"\nStep {i+1}: {step_result['function_name']}")
            print(f"  Success: {step_result['success']}")
            if step_result['success']:
                print(f"  Result: {step_result['result']}")
            elif not step_result['success']:
                print(f"  Error: {step_result['error']}")
        
        return True
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return False

def test_matplotlib_plotting():
    """Test matplotlib plotting functions"""
    print("\n=== Testing Matplotlib Plotting ===")
    
    function_chain = [
        {
            "id": "step-1",
            "functionName": "scatter_plot",
            "category": "Basic Plots",
            "parameters": {
                "x_column": "age",
                "y_column": "salary", 
                "title": "Age vs Salary Scatter Plot"
            },
            "description": "Create scatter plot of age vs salary"
        }
    ]
    
    request_data = {
        "node_id": "test-matplotlib-node",
        "library": "matplotlib",
        "function_chain": function_chain,
        "input_data": {"dataset_name": "users"}
    }
    
    response = requests.post(f"{API_BASE}/execute/", json=request_data)
    
    if response.status_code == 200:
        result = response.json()
        print(f"Execution successful: {result['success']}")
        print(f"Steps executed: {result['steps_executed']}/{result['total_steps']}")
        
        for i, step_result in enumerate(result['results']):
            print(f"\nStep {i+1}: {step_result['function_name']}")
            print(f"  Success: {step_result['success']}")
            if step_result['success'] and step_result['output_type'] == 'plot':
                plot_data = step_result['result']
                print(f"  Plot type: {plot_data['plot_type']}")
                print(f"  Parameters: {plot_data['parameters']}")
                
                # Save the plot image
                image_data = base64.b64decode(plot_data['image_base64'])
                with open(f"test_plot_{step_result['function_name']}.png", "wb") as f:
                    f.write(image_data)
                print(f"  Plot saved as: test_plot_{step_result['function_name']}.png")
            elif not step_result['success']:
                print(f"  Error: {step_result['error']}")
        
        return True
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return False

def test_error_handling():
    """Test error handling with invalid operations"""
    print("\n=== Testing Error Handling ===")
    
    function_chain = [
        {
            "id": "step-1",
            "functionName": "filter_rows",
            "category": "Data Selection",
            "parameters": {
                "column": "nonexistent_column",  # This column doesn't exist
                "operator": ">",
                "value": "30"
            },
            "description": "Filter with invalid column"
        },
        {
            "id": "step-2",
            "functionName": "head",
            "category": "Data Inspection", 
            "parameters": {
                "n": 5
            },
            "description": "Get first 5 rows"
        }
    ]
    
    request_data = {
        "node_id": "test-error-node",
        "library": "pandas",
        "function_chain": function_chain,
        "input_data": {"dataset_name": "users"}
    }
    
    response = requests.post(f"{API_BASE}/execute/", json=request_data)
    
    if response.status_code == 200:
        result = response.json()
        print(f"Overall execution successful: {result['success']}")
        print(f"Steps executed: {result['steps_executed']}/{result['total_steps']}")
        
        for i, step_result in enumerate(result['results']):
            print(f"\nStep {i+1}: {step_result['function_name']}")
            print(f"  Success: {step_result['success']}")
            if step_result['success']:
                print(f"  Result: Successfully executed")
            else:
                print(f"  Error: {step_result['error']}")
        
        return True
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return False

def main():
    """Run all tests"""
    print("Starting Backend API Tests...")
    print("Make sure the FastAPI server is running on http://localhost:8000")
    
    try:
        # Test if server is running
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code != 200:
            print("Server is not running! Please start the FastAPI server first.")
            return
    except requests.exceptions.ConnectionError:
        print("Cannot connect to server! Please start the FastAPI server first.")
        return
    
    # Run all tests
    tests = [
        test_health_check,
        test_sample_data,
        test_specific_dataset,
        test_pandas_chain,
        test_numpy_operations,
        test_matplotlib_plotting,
        test_error_handling
    ]
    
    passed = 0
    for test in tests:
        try:
            if test():
                passed += 1
                print("✅ Test passed")
            else:
                print("❌ Test failed")
        except Exception as e:
            print(f"❌ Test error: {e}")
        print("-" * 60)
    
    print(f"\nTest Results: {passed}/{len(tests)} tests passed")

if __name__ == "__main__":
    main()