import pandas as pd
import json
import requests
import os

print('🔍 Testing Comprehensive EDA Processing for Housing.csv')
print('=' * 60)

# Load housing.csv
try:
    df = pd.read_csv('../public/Housing.csv')
    print('✅ Successfully loaded housing.csv')
    print(f'Dataset shape: {df.shape}')
    print(f'Columns: {list(df.columns)}')
except Exception as e:
    print(f'❌ Error loading housing.csv: {e}')
    exit(1)

# Test 1: Basic EDA workflow
print('\n🧪 Test 1: Basic EDA Workflow')
print('-' * 30)

basic_eda_request = {
    'workflow_type': 'basic_eda',
    'target_columns': ['price', 'area', 'bedrooms', 'bathrooms'],
    'eda_functions': {
        'pandas': ['describe', 'info', 'isnull'],
        'numpy': ['mean', 'std', 'min', 'max'],
        'matplotlib': ['hist', 'boxplot']
    },
    'execution_options': {
        'auto_execute': True,
        'generate_visualizations': True,
        'create_summary_report': True
    },
    'input_data': {
        'dataset_name': 'housing',
        'csv_content': df.to_csv(index=False),
        'filename': 'Housing.csv'
    }
}

try:
    response = requests.post('http://localhost:8000/api/v1/eda-execute/execute', 
                           json=basic_eda_request, timeout=30)
    
    if response.status_code == 200:
        result = response.json()
        print('✅ Basic EDA successful')
        print(f'Success count: {result.get("success_count", 0)}')
        print(f'Errors: {len(result.get("errors", []))}')
    else:
        print(f'❌ Basic EDA failed: {response.status_code}')
        print(response.text[:500])
except Exception as e:
    print(f'❌ Basic EDA request failed: {e}')

# Test 2: Data Cleaning workflow
print('\n🧹 Test 2: Data Cleaning Workflow')
print('-' * 35)

# Check data quality
print('Data Quality Check:')
print(f'Missing values: {df.isnull().sum().sum()}')
print(f'Duplicate rows: {df.duplicated().sum()}')
print(f'Data types: {dict(df.dtypes)}')

# Test 3: ML Readiness Check
print('\n🎯 Test 3: ML Readiness Assessment')
print('-' * 32)

target_col = 'price'
numeric_cols = df.select_dtypes(include=['int64', 'float64']).columns.tolist()
categorical_cols = df.select_dtypes(include=['object']).columns.tolist()

print(f'Target variable: {target_col}')
print(f'Numeric features: {len([c for c in numeric_cols if c != target_col])}')
print(f'Categorical features: {len(categorical_cols)}')

# Target variable analysis
target_stats = df[target_col].describe()
print('Target variable statistics:')
for stat, value in target_stats.items():
    print(f'  {stat}: {value:.2f}')

# Test 4: Frontend Integration Check
print('\n🔗 Test 4: Frontend Integration')
print('-' * 28)

# Check available workflows
try:
    response = requests.get('http://localhost:8000/api/v1/eda-execute/workflows', timeout=10)
    if response.status_code == 200:
        workflows = response.json()
        print(f'✅ Available workflows: {len(workflows.get("workflows", []))}')
        workflow_names = [wf.get('name', 'Unknown') for wf in workflows.get('workflows', [])]
        for name in workflow_names:
            print(f'  📋 {name}')
    else:
        print(f'❌ Failed to get workflows: {response.status_code}')
except Exception as e:
    print(f'❌ Workflows endpoint failed: {e}')

# Test 5: Check Backend Health
print('\n🏥 Test 5: Backend Health Check')
print('-' * 30)

try:
    response = requests.get('http://localhost:8000/', timeout=10)
    if response.status_code == 200:
        health = response.json()
        print('✅ Backend is healthy')
        print(f'API: {health.get("message", "Unknown")}')
        print(f'Version: {health.get("version", "Unknown")}')
    else:
        print(f'❌ Backend health check failed: {response.status_code}')
except Exception as e:
    print(f'❌ Backend health check failed: {e}')

# Test 6: Verify Data Types for ML
print('\n📊 Test 6: ML Data Type Verification')
print('-' * 35)

# Identify problematic columns for ML
problematic_cols = []
for col in df.columns:
    if df[col].dtype == 'object':
        unique_ratio = df[col].nunique() / len(df)
        if unique_ratio > 0.1:  # High cardinality
            problematic_cols.append((col, 'high_cardinality', unique_ratio))
    elif df[col].dtype in ['int64', 'float64']:
        if df[col].std() == 0:  # Zero variance
            problematic_cols.append((col, 'zero_variance', 0))

if problematic_cols:
    print('⚠️  Potential ML issues:')
    for col, issue, value in problematic_cols:
        print(f'  {col}: {issue} ({value:.3f})')
else:
    print('✅ No major ML preprocessing issues detected')

# Test 7: Correlation Analysis
print('\n📈 Test 7: Feature Correlation Analysis')
print('-' * 33)

numeric_df = df.select_dtypes(include=['int64', 'float64'])
correlation_matrix = numeric_df.corr()
target_correlations = correlation_matrix['price'].sort_values(ascending=False)

print('Top correlations with target (price):')
for feature, corr in target_correlations.head(5).items():
    if feature != 'price':
        print(f'  {feature}: {corr:.3f}')

print('\n🎉 Comprehensive EDA Testing Complete')
print('=' * 60)