#!/usr/bin/env python3
"""
Test script to verify the processed data fix
This tests that EDA workflow processes data correctly and the download contains the actual processed data
"""

import pandas as pd
import json
import tempfile
import os
from app.core.eda_executor import EDAExecutor
from app.models.requests import FunctionStep
from app.api.endpoints.eda_download import _create_sample_data_file

def test_processed_data_flow():
    """Test that processed data flows correctly from EDA to download"""
    
    print("=== Testing Processed Data Flow ===")
    
    # 1. Create sample employee data (similar to copy_of_sample_employees.csv)
    sample_data = [
        {"id": 1, "name": "John Doe", "age": 30, "salary": 50000, "department": "IT"},
        {"id": 2, "name": "Jane Smith", "age": 25, "salary": 45000, "department": "HR"},
        {"id": 3, "name": "Bob Johnson", "age": None, "salary": 55000, "department": "IT"},  # Missing age
        {"id": 4, "name": "Alice Brown", "age": 35, "salary": 60000, "department": "Finance"},
        {"id": 4, "name": "Alice Brown", "age": 35, "salary": 60000, "department": "Finance"},  # Duplicate
        {"id": 5, "name": "Charlie Wilson", "age": 40, "salary": None, "department": "IT"},  # Missing salary
    ]
    
    print(f"Original data: {len(sample_data)} rows")
    original_df = pd.DataFrame(sample_data)
    print(f"Original shape: {original_df.shape}")
    print(f"Missing values:\n{original_df.isnull().sum()}")
    print(f"Duplicates: {original_df.duplicated().sum()}")
    
    # 2. Create function chain for data cleaning (dropna and drop_duplicates)
    function_chain = [
        FunctionStep(
            id="clean_1",
            functionName="dropna",
            category="Data Cleaning",
            parameters={},
            description="Remove rows with missing values"
        ),
        FunctionStep(
            id="clean_2", 
            functionName="drop_duplicates",
            category="Data Cleaning",
            parameters={},
            description="Remove duplicate rows"
        )
    ]
    
    # 3. Execute EDA pipeline
    executor = EDAExecutor()
    result = executor.execute_unified_eda_pipeline(
        data=sample_data,
        function_chain=function_chain,
        continue_on_error=True,
        track_progress=True
    )
    
    print(f"\n=== EDA Execution Results ===")
    print(f"Success: {result['success']}")
    print(f"Steps executed: {result['steps_executed']}/{result['total_steps']}")
    
    # Check if processed_data is in the result
    if 'processed_data' in result:
        processed_data = result['processed_data']
        print(f"Processed data available: {len(processed_data)} rows")
        processed_df = pd.DataFrame(processed_data)
        print(f"Processed shape: {processed_df.shape}")
        print(f"Missing values after processing:\n{processed_df.isnull().sum()}")
        print(f"Duplicates after processing: {processed_df.duplicated().sum()}")
    else:
        print("ERROR: No processed_data found in result")
        return False
    
    # 4. Test download data extraction
    print(f"\n=== Testing Download Data Extraction ===")
    
    # Simulate execution_data as it would be stored for download
    execution_data = {
        "execution_id": "test_123",
        "success": result['success'],
        "processed_data": result.get('processed_data'),
        "input_data": {"csv_content": pd.DataFrame(sample_data).to_csv(index=False)}
    }
    
    # Test the download data creation
    with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as temp_file:
        temp_path = temp_file.name
    
    try:
        # This should now use the actual processed data instead of dummy data
        _create_sample_data_file(temp_path, execution_data)
        
        # Read the created file
        downloaded_df = pd.read_csv(temp_path)
        print(f"Downloaded CSV shape: {downloaded_df.shape}")
        
        # Compare with processed data
        if len(downloaded_df) == len(processed_data):
            print("SUCCESS: Downloaded data matches processed data length")
            
            # Check if the data cleaning worked
            if downloaded_df.isnull().sum().sum() == 0:
                print("SUCCESS: No missing values in downloaded data (dropna worked)")
            else:
                print("FAILED: Missing values still present in downloaded data")
                
            if downloaded_df.duplicated().sum() == 0:
                print("SUCCESS: No duplicates in downloaded data (drop_duplicates worked)")
            else:
                print("FAILED: Duplicates still present in downloaded data")
                
            print("\nDownloaded data preview:")
            print(downloaded_df.head())
            
            return True
        else:
            print(f"FAILED: Downloaded data has {len(downloaded_df)} rows, expected {len(processed_data)}")
            return False
            
    finally:
        # Cleanup
        if os.path.exists(temp_path):
            os.unlink(temp_path)

def test_edge_cases():
    """Test edge cases like no processing or empty data"""
    
    print(f"\n=== Testing Edge Cases ===")
    
    # Test with no processed_data
    execution_data_no_process = {
        "execution_id": "test_empty",
        "success": True,
        "input_data": {"csv_content": "id,value\n1,10\n2,20\n"}
    }
    
    with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as temp_file:
        temp_path = temp_file.name
    
    try:
        _create_sample_data_file(temp_path, execution_data_no_process)
        df = pd.read_csv(temp_path)
        print(f"Edge case - no processed data: {df.shape}")
        print("SUCCESS: Handled case with no processed data")
        
    finally:
        if os.path.exists(temp_path):
            os.unlink(temp_path)

if __name__ == "__main__":
    print("Testing processed data fix...")
    
    success = test_processed_data_flow()
    test_edge_cases()
    
    if success:
        print(f"\nOVERALL SUCCESS: The fix appears to be working correctly!")
        print("Your copy_of_sample_employees.csv should now be properly processed and downloadable.")
    else:
        print(f"\nOVERALL FAILED: There may still be issues with the fix.")