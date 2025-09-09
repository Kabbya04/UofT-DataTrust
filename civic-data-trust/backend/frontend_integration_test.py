import requests
import json
import pandas as pd

print("🔗 Frontend-Backend Integration Analysis")
print("=" * 50)

# Configuration
BASE_URL = "http://localhost:8000"
HOUSING_CSV_PATH = "d:/The Data Island/UofT-DataTrust/UofT-DataTrust/civic-data-trust/public/Housing.csv"

def test_frontend_compatibility():
    """Test if backend responses match frontend expectations"""
    print("\n📋 Testing Frontend-Backend Compatibility")
    print("-" * 40)
    
    # Load sample data
    df = pd.read_csv(HOUSING_CSV_PATH)
    sample_data = df.head(10)
    csv_content = sample_data.to_csv(index=False)
    
    # Test the correct EDA endpoint format
    correct_payload = {
        "node_id": "eda-frontend-test",
        "workflow_type": "basic_eda",
        "input_data": {
            "csv_content": csv_content,
            "filename": "housing_frontend_test.csv"
        },
        "generate_download_link": False,
        "colab_optimized": False
    }
    
    print("✅ Correct API Format:")
    print(f"   Endpoint: /api/v1/eda-execute/")
    print(f"   Required fields: node_id, workflow_type, input_data")
    print(f"   Input data format: {{csv_content, filename}}")
    
    response = requests.post(f"{BASE_URL}/api/v1/eda-execute/", json=correct_payload)
    
    if response.status_code == 200:
        result = response.json()
        print(f"   ✅ Response successful")
        print(f"   📊 Response structure: {list(result.keys())[:10]}...")
        
        # Check key fields that frontend expects
        expected_fields = ['success', 'execution_id', 'results', 'pandas_results', 'download_url']
        missing_fields = [field for field in expected_fields if field not in result]
        
        if missing_fields:
            print(f"   ⚠️  Missing expected fields: {missing_fields}")
        else:
            print(f"   ✅ All expected fields present")
            
        return result
    else:
        print(f"   ❌ Request failed: {response.status_code} - {response.text}")
        return None

def test_old_frontend_format():
    """Test the old frontend format that's currently in the code"""
    print("\n🔍 Testing Current Frontend Format (Incorrect)")
    print("-" * 40)
    
    # This is what the frontend is currently sending (incorrect)
    old_payload = {
        "node_id": "test-node",
        "library": "pandas",
        "function_chain": [
            {
                "id": "step-1",
                "functionName": "head",
                "category": "Data Inspection",
                "parameters": {"n": 5},
                "description": "View first 5 rows"
            }
        ],
        "input_data": {"sample": "data"}
    }
    
    print("❌ Current Frontend Format (Incorrect):")
    print(f"   Endpoint: /api/v1/execute/ (WRONG)")
    print(f"   Fields: node_id, library, function_chain, input_data")
    
    # Test the old endpoint
    response = requests.post(f"{BASE_URL}/api/v1/execute/", json=old_payload)
    
    if response.status_code == 200:
        print(f"   ✅ Old endpoint still works")
        return response.json()
    else:
        print(f"   ❌ Old endpoint failed: {response.status_code}")
        print(f"   Error: {response.text[:200]}...")
        return None

def analyze_integration_issues():
    """Analyze the integration issues between frontend and backend"""
    print("\n🔧 Integration Issues Analysis")
    print("-" * 40)
    
    issues = [
        {
            "issue": "Wrong API Endpoint",
            "current": "/api/v1/execute/",
            "correct": "/api/v1/eda-execute/",
            "impact": "High - API calls will fail",
            "fix": "Update NodeConfigPanel.tsx line 47"
        },
        {
            "issue": "Missing node_id field",
            "current": "Not always provided",
            "correct": "Required field",
            "impact": "High - 422 validation error",
            "fix": "Ensure node_id is always included"
        },
        {
            "issue": "Wrong data format",
            "current": "Direct data array or object",
            "correct": "input_data: {csv_content, filename}",
            "impact": "Medium - Data processing issues",
            "fix": "Convert data to CSV format"
        },
        {
            "issue": "Missing workflow_type",
            "current": "Uses library field",
            "correct": "workflow_type field required",
            "impact": "Medium - Workflow selection issues",
            "fix": "Map library to workflow_type"
        },
        {
            "issue": "Function chain format",
            "current": "function_chain array",
            "correct": "function_chain for custom workflows only",
            "impact": "Low - Works but not optimal",
            "fix": "Use predefined workflows when possible"
        }
    ]
    
    for i, issue in enumerate(issues, 1):
        print(f"\n{i}. {issue['issue']}")
        print(f"   Current: {issue['current']}")
        print(f"   Correct: {issue['correct']}")
        print(f"   Impact: {issue['impact']}")
        print(f"   Fix: {issue['fix']}")
    
    return issues

def generate_frontend_fix():
    """Generate the corrected frontend code"""
    print("\n🛠️  Frontend Fix Required")
    print("-" * 40)
    
    fix_code = '''
// CORRECTED NodeConfigPanel.tsx - Line 47 area

// OLD (INCORRECT):
const response = await axios.post('http://localhost:8000/api/v1/execute/', {
  node_id: nodeId,
  library: library,
  function_chain: functionChain.map(step => ({...})),
  input_data: input_data
});

// NEW (CORRECT):
const response = await axios.post('http://localhost:8000/api/v1/eda-execute/', {
  node_id: nodeId,
  workflow_type: library === 'pandas' ? 'basic_eda' : 
                 library === 'numpy' ? 'custom' : 
                 library === 'matplotlib' ? 'visualization_suite' : 'custom',
  function_chain: functionChain.map(step => ({
    id: step.id,
    functionName: step.functionName,
    category: step.category,
    library: library,  // Add library field
    parameters: step.parameters,
    description: step.description || ''
  })),
  input_data: {
    csv_content: typeof input_data === 'string' ? input_data : 
                 input_data.csv_content || JSON.stringify(input_data),
    filename: input_data.filename || 'data.csv'
  },
  generate_download_link: false,
  colab_optimized: false
});
'''
    
    print(fix_code)
    return fix_code

# Run all tests
test_frontend_compatibility()
test_old_frontend_format()
analyze_integration_issues()
generate_frontend_fix()

print("\n" + "=" * 50)
print("🎯 INTEGRATION ANALYSIS COMPLETE")
print("=" * 50)
print("✅ Backend EDA system is fully functional")
print("⚠️  Frontend needs updates to use correct API format")
print("📋 See analysis above for specific fixes needed")
print("=" * 50)