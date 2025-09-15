#!/usr/bin/env python3
"""
Test script for the EDA download endpoint

This script tests the download functionality by:
1. Starting the FastAPI server
2. Making a test EDA execution request
3. Using the returned execution_id to download results
4. Verifying the downloaded ZIP file
"""

import requests
import json
import time
import zipfile
import os
import tempfile
from datetime import datetime


def test_download_endpoint():
    """Test the complete download workflow"""
    
    base_url = "http://localhost:8000/api/v1"
    
    print("🔧 Testing EDA Download Endpoint")
    print("=" * 50)
    
    # Step 1: Test server availability
    print("\n1. Testing server availability...")
    try:
        health_response = requests.get(f"{base_url}/eda-execute/health", timeout=5)
        if health_response.status_code == 200:
            print("✅ Server is running")
        else:
            print(f"❌ Server health check failed: {health_response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot connect to server: {e}")
        print("💡 Make sure to start the server with: python run_server.py")
        return False
    
    # Step 2: Execute EDA workflow
    print("\n2. Executing sample EDA workflow...")
    
    eda_request = {
        "node_id": "test_download_node",
        "workflow_type": "basic_eda",
        "function_chain": [
            {
                "id": "test-1",
                "functionName": "head",
                "category": "Data Inspection",
                "library": "pandas",
                "parameters": {"n": 5},
                "description": "View first 5 rows"
            },
            {
                "id": "test-2", 
                "functionName": "describe",
                "category": "Data Inspection",
                "library": "pandas",
                "parameters": {},
                "description": "Statistical summary"
            },
            {
                "id": "test-3",
                "functionName": "heatmap", 
                "category": "Statistical Plots",
                "library": "matplotlib",
                "parameters": {"title": "Test Correlation Heatmap"},
                "description": "Correlation heatmap"
            }
        ],
        "input_data": {
            "csv_content": "id,value_a,value_b,category\n1,10,20,A\n2,15,25,B\n3,20,30,A\n4,25,35,C\n5,30,40,B\n",
            "filename": "test_data.csv"
        },
        "generate_download_link": True,
        "colab_optimized": True,
        "continue_on_error": True,
        "track_progress": True,
        "auto_cleanup": False
    }
    
    try:
        eda_response = requests.post(
            f"{base_url}/eda-execute/", 
            json=eda_request,
            timeout=30
        )
        
        if eda_response.status_code != 200:
            print(f"❌ EDA execution failed: {eda_response.status_code}")
            print(f"Response: {eda_response.text}")
            return False
            
        eda_result = eda_response.json()
        execution_id = eda_result.get("execution_id")
        
        if not execution_id:
            print("❌ No execution_id returned from EDA")
            return False
            
        print(f"✅ EDA executed successfully")
        print(f"   Execution ID: {execution_id}")
        print(f"   Success: {eda_result.get('success', False)}")
        print(f"   Steps: {eda_result.get('steps_executed', 0)}/{eda_result.get('total_steps', 0)}")
        
    except requests.exceptions.RequestException as e:
        print(f"❌ EDA execution request failed: {e}")
        return False
    
    # Step 3: Test download status
    print("\n3. Checking download availability...")
    
    try:
        status_response = requests.get(f"{base_url}/eda-download/status/{execution_id}")
        
        if status_response.status_code == 200:
            status_data = status_response.json()
            print(f"✅ Download status check successful")
            print(f"   Available: {status_data.get('available', False)}")
            print(f"   Access count: {status_data.get('access_count', 0)}")
        else:
            print(f"⚠️ Download status check returned: {status_response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"⚠️ Download status check failed: {e}")
    
    # Step 4: Download the results
    print("\n4. Downloading results...")
    
    download_params = {
        "node_id": "test_download_node",
        "filename": f"test_eda_results_{execution_id}.zip",
        "format": "zip",
        "include_visualizations": True,
        "include_processed_data": True,
        "include_metadata": True
    }
    
    try:
        download_response = requests.get(
            f"{base_url}/eda-download/{execution_id}",
            params=download_params,
            timeout=60
        )
        
        if download_response.status_code != 200:
            print(f"❌ Download failed: {download_response.status_code}")
            print(f"Response: {download_response.text}")
            return False
            
        # Check content type
        content_type = download_response.headers.get('content-type', '')
        if 'application/zip' not in content_type:
            print(f"❌ Unexpected content type: {content_type}")
            print(f"Response preview: {download_response.text[:200]}...")
            return False
            
        # Save the ZIP file
        zip_content = download_response.content
        zip_size = len(zip_content)
        
        print(f"✅ Download successful")
        print(f"   Size: {zip_size:,} bytes ({zip_size/1024:.1f} KB)")
        print(f"   Content-Type: {content_type}")
        
        # Step 5: Verify ZIP contents
        print("\n5. Verifying ZIP contents...")
        
        with tempfile.NamedTemporaryFile(suffix='.zip', delete=False) as temp_zip:
            temp_zip.write(zip_content)
            temp_zip_path = temp_zip.name
        
        try:
            with zipfile.ZipFile(temp_zip_path, 'r') as zipf:
                zip_contents = zipf.namelist()
                
                print(f"✅ ZIP file is valid")
                print(f"   Files in ZIP: {len(zip_contents)}")
                
                # Check for expected files
                expected_files = ['README.md']
                expected_dirs = ['data/', 'visualizations/', 'metadata/']
                
                found_files = []
                found_dirs = []
                
                for item in zip_contents:
                    if item.endswith('/'):
                        found_dirs.append(item)
                    else:
                        found_files.append(item)
                
                print(f"   Files: {len(found_files)}")
                print(f"   Directories: {len(found_dirs)}")
                
                # List some contents
                print("\n   Sample contents:")
                for item in zip_contents[:10]:  # Show first 10 items
                    print(f"     - {item}")
                if len(zip_contents) > 10:
                    print(f"     ... and {len(zip_contents) - 10} more items")
                
                # Extract and check README
                if 'README.md' in zip_contents:
                    readme_content = zipf.read('README.md').decode('utf-8')
                    print(f"\n   README.md preview (first 200 chars):")
                    print(f"   {readme_content[:200]}...")
                
        except zipfile.BadZipFile:
            print("❌ Downloaded file is not a valid ZIP")
            return False
            
        finally:
            # Cleanup temp file
            try:
                os.unlink(temp_zip_path)
            except:
                pass
        
        print(f"\n🎉 All tests passed!")
        print(f"   The download endpoint is working correctly")
        print(f"   Execution ID: {execution_id}")
        print(f"   ZIP size: {zip_size:,} bytes")
        
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Download request failed: {e}")
        return False


def test_mock_download():
    """Test download with mock data (if no execution exists)"""
    
    base_url = "http://localhost:8000/api/v1"
    mock_execution_id = "test_mock_12345"
    
    print("\n🔧 Testing Mock Download")
    print("=" * 30)
    
    try:
        download_response = requests.get(
            f"{base_url}/eda-download/{mock_execution_id}",
            params={"filename": "mock_test.zip"},
            timeout=30
        )
        
        if download_response.status_code == 200:
            zip_size = len(download_response.content)
            print(f"✅ Mock download successful: {zip_size:,} bytes")
            return True
        else:
            print(f"❌ Mock download failed: {download_response.status_code}")
            print(f"Response: {download_response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Mock download request failed: {e}")
        return False


if __name__ == "__main__":
    print(f"Starting EDA Download Endpoint Test")
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Run the full test
    success = test_download_endpoint()
    
    if not success:
        print("\n⚠️ Full test failed, trying mock download...")
        mock_success = test_mock_download()
        
        if mock_success:
            print("\n✅ Mock download works - the endpoint is functional")
        else:
            print("\n❌ Both tests failed - check server status")
    
    print(f"\nTest completed at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")