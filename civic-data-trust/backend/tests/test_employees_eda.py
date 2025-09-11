import requests
import json
import pandas as pd

print("🧪 Testing EDA Workflow with Sample Employees Data")
print("=" * 55)

# Configuration
BASE_URL = "http://localhost:8000"
EMPLOYEES_CSV_PATH = "d:/The Data Island/UofT-DataTrust/UofT-DataTrust/civic-data-trust/public/copy_of_sample_employees.csv"

def test_employees_eda_workflow():
    """Test EDA workflow with employees data"""
    print("\n📊 Loading Sample Employees Data")
    print("-" * 40)
    
    # Load the employees data
    df = pd.read_csv(EMPLOYEES_CSV_PATH)
    csv_content = df.to_csv(index=False)
    
    print(f"✅ Data loaded: {df.shape[0]} rows, {df.shape[1]} columns")
    print(f"📋 Columns: {list(df.columns)}")
    print(f"📈 Data types: {df.dtypes.to_dict()}")
    
    # Test different EDA workflows
    workflows = [
        {
            "name": "Basic EDA",
            "workflow_type": "basic_eda",
            "description": "Essential data exploration"
        },
        {
            "name": "Data Cleaning", 
            "workflow_type": "data_cleaning",
            "description": "Clean and prepare data"
        },
        {
            "name": "Visualization Suite",
            "workflow_type": "visualization_suite", 
            "description": "Comprehensive charts"
        },
        {
            "name": "Custom Workflow",
            "workflow_type": "custom",
            "description": "Custom function chain",
            "function_chain": [
                {
                    "id": "step-1",
                    "functionName": "head",
                    "category": "Data Inspection",
                    "library": "pandas",
                    "parameters": {"n": 10},
                    "description": "View first 10 rows"
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
                    "functionName": "histogram",
                    "category": "Basic Plots",
                    "library": "matplotlib",
                    "parameters": {"column": "salary", "bins": 15, "title": "Salary Distribution"},
                    "description": "Salary histogram"
                }
            ]
        }
    ]
    
    results = []
    
    for workflow in workflows:
        print(f"\n🔄 Testing {workflow['name']} Workflow")
        print("-" * 40)
        
        # Create payload
        payload = {
            "node_id": f"employees-{workflow['workflow_type']}-test",
            "workflow_type": workflow["workflow_type"],
            "input_data": {
                "csv_content": csv_content,
                "filename": "copy_of_sample_employees.csv"
            },
            "generate_download_link": True,  # Enable download link
            "colab_optimized": True  # Enable Colab optimization
        }
        
        # Add function chain for custom workflow
        if "function_chain" in workflow:
            payload["function_chain"] = workflow["function_chain"]
        
        try:
            print(f"📤 Sending request to /api/v1/eda-execute/")
            response = requests.post(f"{BASE_URL}/api/v1/eda-execute/", json=payload)
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ {workflow['name']}: SUCCESS")
                
                # Extract key information
                execution_info = {
                    "workflow": workflow['name'],
                    "success": result.get('success', False),
                    "execution_id": result.get('execution_id', 'N/A'),
                    "steps_executed": result.get('steps_executed', 0),
                    "total_steps": result.get('total_steps', 0),
                    "execution_time_ms": result.get('total_execution_time_ms', 0),
                    "pandas_results": len(result.get('pandas_results', [])),
                    "numpy_results": len(result.get('numpy_results', [])),
                    "matplotlib_results": len(result.get('matplotlib_results', [])),
                    "download_url": result.get('download_url', 'N/A'),
                    "wget_command": result.get('wget_command', 'N/A'),
                    "colab_compatible": result.get('colab_compatible', False),
                    "errors": result.get('error', 'None'),
                    "warnings": len(result.get('warnings', []))
                }
                
                results.append(execution_info)
                
                # Display results
                print(f"   📊 Execution: {execution_info['steps_executed']}/{execution_info['total_steps']} steps")
                print(f"   ⏱️  Time: {execution_info['execution_time_ms']}ms")
                print(f"   🐼 Pandas: {execution_info['pandas_results']} operations")
                print(f"   🔢 NumPy: {execution_info['numpy_results']} operations")
                print(f"   📈 Matplotlib: {execution_info['matplotlib_results']} plots")
                print(f"   🔗 Download URL: {'Available' if execution_info['download_url'] != 'N/A' else 'Not available'}")
                print(f"   📱 Colab Ready: {execution_info['colab_compatible']}")
                
                if execution_info['warnings'] > 0:
                    print(f"   ⚠️  Warnings: {execution_info['warnings']}")
                    
                if execution_info['errors'] != 'None':
                    print(f"   ❌ Errors: {execution_info['errors']}")
                    
            else:
                print(f"❌ {workflow['name']}: FAILED")
                print(f"   Status Code: {response.status_code}")
                print(f"   Error: {response.text[:300]}...")
                
                results.append({
                    "workflow": workflow['name'],
                    "success": False,
                    "error": f"HTTP {response.status_code}: {response.text[:100]}"
                })
                
        except Exception as e:
            print(f"❌ {workflow['name']}: EXCEPTION")
            print(f"   Error: {str(e)}")
            
            results.append({
                "workflow": workflow['name'],
                "success": False,
                "error": str(e)
            })
    
    return results

def analyze_results(results):
    """Analyze the test results"""
    print("\n" + "=" * 55)
    print("📋 COMPREHENSIVE RESULTS ANALYSIS")
    print("=" * 55)
    
    successful = [r for r in results if r.get('success', False)]
    failed = [r for r in results if not r.get('success', False)]
    
    print(f"\n✅ Successful Workflows: {len(successful)}/{len(results)}")
    print(f"❌ Failed Workflows: {len(failed)}/{len(results)}")
    
    if successful:
        print("\n🎉 Working Workflows:")
        for result in successful:
            print(f"   ✅ {result['workflow']}")
            if 'execution_time_ms' in result:
                print(f"      ⏱️  {result['execution_time_ms']}ms, {result['steps_executed']} steps")
                print(f"      📊 Results: P:{result['pandas_results']} N:{result['numpy_results']} M:{result['matplotlib_results']}")
    
    if failed:
        print("\n❌ Failed Workflows:")
        for result in failed:
            print(f"   ❌ {result['workflow']}")
            print(f"      Error: {result.get('error', 'Unknown error')}")
    
    # Recommendations
    print("\n💡 Recommendations:")
    if len(successful) == len(results):
        print("   🎯 All workflows working! Ready to implement UI improvements.")
    elif len(successful) > 0:
        print("   ⚠️  Some workflows failing. Check error details above.")
        print("   🔧 Focus on fixing failed workflows before UI implementation.")
    else:
        print("   🚨 All workflows failing. Backend integration issue detected.")
        print("   🔍 Check server status and API endpoint configuration.")
    
    return successful, failed

# Run the comprehensive test
print("🚀 Starting comprehensive EDA workflow test...")
results = test_employees_eda_workflow()
successful, failed = analyze_results(results)

print("\n" + "=" * 55)
print("🏁 TEST COMPLETE - Ready for UI Enhancement")
print("=" * 55)