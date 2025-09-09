import requests
import json

print('🔍 Checking API Endpoints')
print('=' * 40)

try:
    # Get the OpenAPI documentation
    response = requests.get('http://localhost:8000/openapi.json')
    data = response.json()
    
    print('✅ OpenAPI documentation loaded successfully')
    print()
    
    # List all paths
    print('📍 Available API Endpoints:')
    print('=' * 40)
    
    for path, methods in data.get('paths', {}).items():
        print(f'Path: {path}')
        for method, details in methods.items():
            print(f'  {method.upper()}: {details.get("summary", "No summary")}')
        print()
    
    # Look for EDA-related endpoints
    print('🔍 EDA-related endpoints:')
    print('=' * 30)
    eda_endpoints = []
    for path, methods in data.get('paths', {}).items():
        if 'eda' in path.lower():
            eda_endpoints.append(path)
            print(f'EDA Endpoint: {path}')
            for method, details in methods.items():
                print(f'  {method}: {details.get("summary", "No summary")}')
    
    if not eda_endpoints:
        print('❌ No EDA endpoints found')
    
    # Check health endpoints
    print('\n🏥 Health Check Endpoints:')
    print('=' * 30)
    
    health_response = requests.get('http://localhost:8000/')
    if health_response.status_code == 200:
        health = health_response.json()
        print(f'✅ Root endpoint: {health.get("message", "Unknown")}')
    
    # Check workflows endpoint
    workflows_response = requests.get('http://localhost:8000/api/v1/eda-execute/workflows')
    if workflows_response.status_code == 200:
        workflows = workflows_response.json()
        print(f'✅ Workflows endpoint: {len(workflows.get("workflows", {}))} workflows available')
    
    print('\n✅ API endpoint verification complete')
    
except Exception as e:
    print(f'❌ Error checking API endpoints: {e}')