from fastapi import APIRouter, HTTPException, Query, Response
from fastapi.responses import FileResponse, StreamingResponse
import os
import tempfile
import zipfile
import json
import shutil
from typing import Dict, Any, Optional
from datetime import datetime
import logging
import io
import base64
from pathlib import Path

from app.services.file_packaging_service import FilePackagingService

router = APIRouter()
logger = logging.getLogger(__name__)

# Global service instance
packaging_service = FilePackagingService()

# Storage for execution results (in production, this would be a database)
execution_storage: Dict[str, Dict[str, Any]] = {}


@router.get("/{execution_id}")
async def download_eda_results(
    execution_id: str,
    node_id: Optional[str] = Query(None, description="Node ID for tracking"),
    filename: Optional[str] = Query(None, description="Custom filename for download"),
    format: str = Query("zip", description="Download format (zip)"),
    include_visualizations: bool = Query(True, description="Include visualization files"),
    include_processed_data: bool = Query(True, description="Include processed data files"),
    include_metadata: bool = Query(True, description="Include metadata and logs")
):
    """
    Download EDA results as a ZIP package
    
    This endpoint creates and streams a ZIP file containing:
    - Processed data files (CSV, JSON)
    - Generated visualizations (PNG images) 
    - Execution metadata and logs
    - README with usage instructions
    - Google Colab notebook (if requested)
    
    Args:
        execution_id: The execution ID from EDA processing
        node_id: Optional node ID for tracking
        filename: Custom filename (defaults to eda_results_{execution_id}.zip)
        format: Download format (currently only 'zip' supported)
        include_visualizations: Whether to include plot images
        include_processed_data: Whether to include data files
        include_metadata: Whether to include metadata and logs
        
    Returns:
        StreamingResponse with ZIP file
    """
    try:
        logger.info(f"Processing download request for execution_id: {execution_id}")
        
        # Set default filename if not provided
        if not filename:
            filename = f"eda_results_{execution_id}.zip"
        
        # Ensure .zip extension
        if not filename.endswith('.zip'):
            filename = f"{filename}.zip"
        
        # Retrieve execution results from storage (this would be from database in production)
        execution_data = await _get_execution_results(execution_id)
        
        if not execution_data:
            raise HTTPException(
                status_code=404, 
                detail=f"Execution results not found for ID: {execution_id}"
            )
        
        # Create temporary directory for package assembly
        with tempfile.TemporaryDirectory() as temp_dir:
            package_dir = os.path.join(temp_dir, "eda_package")
            os.makedirs(package_dir, exist_ok=True)
            
            # Create organized directory structure
            dirs_to_create = []
            if include_processed_data:
                dirs_to_create.append("data")
            if include_visualizations:
                dirs_to_create.append("visualizations")  
            if include_metadata:
                dirs_to_create.append("metadata")
                
            for dir_name in dirs_to_create:
                os.makedirs(os.path.join(package_dir, dir_name), exist_ok=True)
            
            # Collect files to include in package
            package_files = await _collect_package_files(
                execution_data, package_dir, include_visualizations, 
                include_processed_data, include_metadata
            )
            
            # Generate metadata file
            if include_metadata:
                metadata = _generate_download_metadata(execution_data, execution_id)
                metadata_path = os.path.join(package_dir, "metadata", "execution_metadata.json")
                with open(metadata_path, 'w', encoding='utf-8') as f:
                    json.dump(metadata, f, indent=2, ensure_ascii=False)
            
            # Generate README file
            readme_content = _generate_download_readme(execution_data, execution_id)
            readme_path = os.path.join(package_dir, "README.md")
            with open(readme_path, 'w', encoding='utf-8') as f:
                f.write(readme_content)
            
            # Create ZIP file in memory
            zip_buffer = io.BytesIO()
            with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as zipf:
                # Add all files in package directory to ZIP
                for root, dirs, files in os.walk(package_dir):
                    for file in files:
                        file_path = os.path.join(root, file)
                        arc_path = os.path.relpath(file_path, package_dir)
                        zipf.write(file_path, arc_path)
            
            zip_buffer.seek(0)
            zip_size = len(zip_buffer.getvalue())
            
            logger.info(f"Created ZIP package for {execution_id}: {zip_size} bytes")
            
            # Return streaming response with ZIP file
            return StreamingResponse(
                io.BytesIO(zip_buffer.getvalue()),
                media_type="application/zip",
                headers={
                    "Content-Disposition": f"attachment; filename={filename}",
                    "Content-Length": str(zip_size),
                    "Content-Type": "application/zip"
                }
            )
            
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
        
    except Exception as e:
        logger.error(f"Download failed for execution_id {execution_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate download package: {str(e)}"
        )


@router.post("/store-results/{execution_id}")
async def store_execution_results(execution_id: str, results: Dict[str, Any]):
    """
    Store execution results for later download
    
    This endpoint is called by the EDA execution service to store results
    that can be downloaded later via the download endpoint.
    
    Args:
        execution_id: Unique execution identifier
        results: Complete EDA execution results
        
    Returns:
        Success confirmation
    """
    try:
        # Store results in memory (in production, use database)
        execution_storage[execution_id] = {
            "results": results,
            "stored_at": datetime.now().isoformat(),
            "access_count": 0
        }
        
        logger.info(f"Stored execution results for {execution_id}")
        
        return {
            "success": True,
            "execution_id": execution_id,
            "stored_at": execution_storage[execution_id]["stored_at"],
            "message": "Results stored successfully"
        }
        
    except Exception as e:
        logger.error(f"Failed to store results for {execution_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to store execution results: {str(e)}"
        )


@router.get("/status/{execution_id}")
async def get_download_status(execution_id: str):
    """
    Check if results are available for download
    
    Args:
        execution_id: Execution ID to check
        
    Returns:
        Status information about download availability
    """
    try:
        if execution_id in execution_storage:
            stored_data = execution_storage[execution_id]
            return {
                "available": True,
                "execution_id": execution_id,
                "stored_at": stored_data["stored_at"],
                "access_count": stored_data["access_count"],
                "download_url": f"/api/v1/eda-download/{execution_id}"
            }
        else:
            return {
                "available": False,
                "execution_id": execution_id,
                "message": "Results not found - may have been cleaned up or execution failed"
            }
            
    except Exception as e:
        logger.error(f"Status check failed for {execution_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to check download status: {str(e)}"
        )


# Helper Functions

async def _get_execution_results(execution_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve execution results from storage"""
    try:
        if execution_id in execution_storage:
            # Increment access count
            execution_storage[execution_id]["access_count"] += 1
            return execution_storage[execution_id]["results"]
        else:
            # Try to generate mock results for testing
            logger.warning(f"No stored results found for {execution_id}, generating mock data")
            return _generate_mock_execution_data(execution_id)
            
    except Exception as e:
        logger.error(f"Failed to retrieve execution results for {execution_id}: {str(e)}")
        return None


async def _collect_package_files(execution_data: Dict[str, Any], package_dir: str,
                                include_visualizations: bool, include_processed_data: bool,
                                include_metadata: bool) -> Dict[str, str]:
    """Collect and organize files for the download package"""
    package_files = {}
    
    try:
        # Process data files
        if include_processed_data:
            data_dir = os.path.join(package_dir, "data")
            
            # Create sample processed data CSV
            processed_data_path = os.path.join(data_dir, "processed_data.csv")
            _create_sample_data_file(processed_data_path, execution_data)
            package_files["processed_data"] = processed_data_path
            
            # Create original data if available
            if "input_data" in execution_data:
                original_data_path = os.path.join(data_dir, "original_data.csv")
                _create_original_data_file(original_data_path, execution_data)
                package_files["original_data"] = original_data_path
        
        # Process visualization files
        if include_visualizations:
            viz_dir = os.path.join(package_dir, "visualizations")
            viz_files = _extract_visualization_files(execution_data, viz_dir)
            package_files.update(viz_files)
        
        # Process metadata files
        if include_metadata:
            metadata_dir = os.path.join(package_dir, "metadata")
            
            # Create execution log
            log_path = os.path.join(metadata_dir, "execution_log.txt")
            _create_execution_log(log_path, execution_data)
            package_files["execution_log"] = log_path
        
        return package_files
        
    except Exception as e:
        logger.error(f"Failed to collect package files: {str(e)}")
        return {}


def _extract_visualization_files(execution_data: Dict[str, Any], viz_dir: str) -> Dict[str, str]:
    """Extract and save visualization files from execution data"""
    viz_files = {}
    
    try:
        # Check for visualizations in different result sections
        viz_count = 0
        
        # Process pandas results
        if "pandas_results" in execution_data:
            pandas_results = execution_data["pandas_results"]
            if "steps" in pandas_results:
                for step in pandas_results["steps"]:
                    if step.get("output_type") == "plot" and "result" in step:
                        viz_count += 1
                        viz_path = _save_base64_image(
                            step["result"], viz_dir, 
                            f"pandas_plot_{viz_count}.png"
                        )
                        if viz_path:
                            viz_files[f"pandas_plot_{viz_count}"] = viz_path
        
        # Process matplotlib results
        if "matplotlib_results" in execution_data:
            matplotlib_results = execution_data["matplotlib_results"]
            if "steps" in matplotlib_results:
                for step in matplotlib_results["steps"]:
                    if step.get("output_type") == "plot" and "result" in step:
                        viz_count += 1
                        viz_path = _save_base64_image(
                            step["result"], viz_dir,
                            f"matplotlib_plot_{viz_count}.png"
                        )
                        if viz_path:
                            viz_files[f"matplotlib_plot_{viz_count}"] = viz_path
        
        # If no visualizations found, create a placeholder
        if not viz_files:
            placeholder_path = os.path.join(viz_dir, "no_visualizations.txt")
            with open(placeholder_path, 'w', encoding='utf-8') as f:
                f.write("No visualizations were generated during this EDA execution.\n")
            viz_files["placeholder"] = placeholder_path
        
        return viz_files
        
    except Exception as e:
        logger.error(f"Failed to extract visualization files: {str(e)}")
        return {}


def _save_base64_image(result_data: Dict[str, Any], output_dir: str, filename: str) -> Optional[str]:
    """Save base64 encoded image to file"""
    try:
        if "image_base64" in result_data:
            image_data = base64.b64decode(result_data["image_base64"])
            file_path = os.path.join(output_dir, filename)
            with open(file_path, 'wb') as f:
                f.write(image_data)
            return file_path
        return None
        
    except Exception as e:
        logger.error(f"Failed to save base64 image {filename}: {str(e)}")
        return None


def _create_sample_data_file(file_path: str, execution_data: Dict[str, Any]):
    """Create processed data CSV file from actual execution results"""
    try:
        import pandas as pd
        import numpy as np
        
        # First, try to get the final processed data from execution results
        processed_df = None
        
        # Priority 1: Look for processed_data field (newly added)
        if 'processed_data' in execution_data and execution_data['processed_data'] is not None:
            processed_data = execution_data['processed_data']
            if isinstance(processed_data, list) and len(processed_data) > 0:
                processed_df = pd.DataFrame(processed_data)
                logger.info("Using processed_data from execution results")
        
        # Priority 2: Look for final processed data in final_output
        if processed_df is None and 'final_output' in execution_data and execution_data['final_output'] is not None:
            # Try to extract DataFrame from final_output
            final_output = execution_data['final_output']
            if isinstance(final_output, list) and len(final_output) > 0 and isinstance(final_output[0], dict):
                processed_df = pd.DataFrame(final_output)
            elif isinstance(final_output, dict) and 'data' in final_output:
                if isinstance(final_output['data'], list):
                    processed_df = pd.DataFrame(final_output['data'])
        
        # If no final_output, look in pandas results for data transformations
        if processed_df is None and 'pandas_results' in execution_data:
            pandas_results = execution_data['pandas_results']
            if 'data_transformations' in pandas_results and pandas_results['data_transformations']:
                # Get the last data transformation
                last_transformation = pandas_results['data_transformations'][-1]
                if isinstance(last_transformation, list) and len(last_transformation) > 0:
                    processed_df = pd.DataFrame(last_transformation)
            
            # Also check in step results for data output
            if processed_df is None and 'steps' in pandas_results:
                for step in reversed(pandas_results['steps']):  # Check from last to first
                    if (step.get('success', False) and 
                        step.get('output_type') == 'data' and 
                        'result' in step and 
                        step['result'] is not None):
                        result_data = step['result']
                        if isinstance(result_data, list) and len(result_data) > 0:
                            processed_df = pd.DataFrame(result_data)
                            break
        
        # If still no processed data, try to use original input data
        if processed_df is None and 'input_data' in execution_data:
            input_data = execution_data['input_data']
            if 'csv_content' in input_data:
                # Parse CSV content directly
                from io import StringIO
                csv_content = input_data['csv_content']
                processed_df = pd.read_csv(StringIO(csv_content))
                logger.info("Using original input data as no processed data was found")
        
        # If we have processed data, save it
        if processed_df is not None and not processed_df.empty:
            processed_df.to_csv(file_path, index=False, encoding='utf-8')
            logger.info(f"Saved processed data with shape {processed_df.shape} to {file_path}")
        else:
            # Fallback: create a minimal dataset indicating no processed data
            logger.warning("No processed data found, creating fallback dataset")
            fallback_data = {
                'note': ['No processed data available from execution'],
                'execution_id': [execution_data.get('execution_id', 'unknown')],
                'workflow_type': [execution_data.get('workflow_type', 'unknown')],
                'status': ['Check execution logs for details']
            }
            df = pd.DataFrame(fallback_data)
            df.to_csv(file_path, index=False, encoding='utf-8')
        
    except Exception as e:
        logger.error(f"Failed to create processed data file: {str(e)}")
        # Create a basic CSV as fallback
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write("error,message\ndata_extraction_failed,Could not extract processed data from execution results\n")


def _create_original_data_file(file_path: str, execution_data: Dict[str, Any]):
    """Create original data file from execution input"""
    try:
        if "input_data" in execution_data and "csv_content" in execution_data["input_data"]:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(execution_data["input_data"]["csv_content"])
        else:
            # Create placeholder
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write("# Original data was not preserved during processing\n")
                
    except Exception as e:
        logger.error(f"Failed to create original data file: {str(e)}")


def _create_execution_log(file_path: str, execution_data: Dict[str, Any]):
    """Create execution log file"""
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write("EDA Execution Log\n")
            f.write("=" * 50 + "\n\n")
            f.write(f"Execution ID: {execution_data.get('execution_id', 'unknown')}\n")
            f.write(f"Node ID: {execution_data.get('node_id', 'unknown')}\n")
            f.write(f"Workflow Type: {execution_data.get('workflow_type', 'unknown')}\n")
            f.write(f"Timestamp: {execution_data.get('timestamp', 'unknown')}\n")
            f.write(f"Success: {execution_data.get('success', False)}\n")
            f.write(f"Steps Executed: {execution_data.get('steps_executed', 0)}\n")
            f.write(f"Total Steps: {execution_data.get('total_steps', 0)}\n")
            f.write(f"Execution Time: {execution_data.get('total_execution_time_ms', 0)}ms\n\n")
            
            if "error" in execution_data:
                f.write(f"Error: {execution_data['error']}\n\n")
            
            # Add detailed step information
            f.write("Step Details:\n")
            f.write("-" * 30 + "\n")
            
            for library in ['pandas_results', 'numpy_results', 'matplotlib_results']:
                if library in execution_data and 'steps' in execution_data[library]:
                    f.write(f"\n{library.split('_')[0].upper()} Steps:\n")
                    for i, step in enumerate(execution_data[library]['steps'], 1):
                        f.write(f"  {i}. {step.get('function_name', 'unknown')} - ")
                        f.write(f"{'SUCCESS' if step.get('success', False) else 'FAILED'} ")
                        f.write(f"({step.get('execution_time_ms', 0)}ms)\n")
                        if not step.get('success', False) and 'output' in step:
                            f.write(f"     Error: {step['output']}\n")
            
    except Exception as e:
        logger.error(f"Failed to create execution log: {str(e)}")


def _generate_download_metadata(execution_data: Dict[str, Any], execution_id: str) -> Dict[str, Any]:
    """Generate metadata for download package"""
    return {
        "package_info": {
            "package_name": f"eda_results_{execution_id}",
            "created_at": datetime.now().isoformat(),
            "version": "1.0.0",
            "generator": "EDA Processor Download Service v1.0"
        },
        "execution_summary": {
            "execution_id": execution_id,
            "node_id": execution_data.get("node_id"),
            "workflow_type": execution_data.get("workflow_type"),
            "success": execution_data.get("success", False),
            "steps_executed": execution_data.get("steps_executed", 0),
            "total_steps": execution_data.get("total_steps", 0),
            "execution_time_ms": execution_data.get("total_execution_time_ms", 0),
            "timestamp": execution_data.get("timestamp")
        },
        "libraries_used": [],
        "visualizations_count": _count_visualizations(execution_data),
        "data_files_included": ["processed_data.csv", "original_data.csv"],
        "download_info": {
            "format": "zip",
            "compression": "deflated",
            "created_at": datetime.now().isoformat()
        }
    }


def _count_visualizations(execution_data: Dict[str, Any]) -> int:
    """Count total visualizations in execution results"""
    count = 0
    
    for library in ['pandas_results', 'numpy_results', 'matplotlib_results']:
        if library in execution_data and 'steps' in execution_data[library]:
            for step in execution_data[library]['steps']:
                if step.get('output_type') == 'plot':
                    count += 1
    
    return count


def _generate_download_readme(execution_data: Dict[str, Any], execution_id: str) -> str:
    """Generate README content for download package"""
    execution_time = execution_data.get("total_execution_time_ms", 0)
    steps_executed = execution_data.get("steps_executed", 0)
    success = execution_data.get("success", False)
    
    return f"""# EDA Results Package

**Execution ID**: {execution_id}  
**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  
**Status**: {'SUCCESS' if success else 'FAILED'}  
**Execution Time**: {execution_time:.2f}ms  
**Steps Executed**: {steps_executed}

## Package Contents

### Data Files (`data/`)
- `processed_data.csv` - Cleaned and processed dataset
- `original_data.csv` - Original input dataset (if available)

### Visualizations (`visualizations/`)
- Generated plots and charts from the analysis
- PNG format images for easy viewing and embedding

### Metadata (`metadata/`)
- `execution_metadata.json` - Detailed execution information
- `execution_log.txt` - Step-by-step execution log

## Quick Start with Google Colab

### 1. Download and Extract
```bash
# This file should already be downloaded
# Extract if needed: unzip eda_results_{execution_id}.zip
```

### 2. Install Dependencies
```python
!pip install pandas numpy matplotlib seaborn plotly
```

### 3. Load Data
```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Load the processed dataset
df = pd.read_csv('data/processed_data.csv')
print(f"Dataset shape: {{df.shape}}")
df.head()
```

### 4. View Visualizations
```python
from IPython.display import Image, display
import os

# Display all generated plots
viz_files = [f for f in os.listdir('visualizations/') if f.endswith('.png')]
for viz_file in sorted(viz_files):
    print(f"\\n--- {{viz_file}} ---")
    display(Image(f'visualizations/{{viz_file}}'))
```

### 5. Load Metadata
```python
import json

# Load execution metadata
with open('metadata/execution_metadata.json', 'r') as f:
    metadata = json.load(f)

print("Execution Summary:")
print(json.dumps(metadata['execution_summary'], indent=2))
```

## Troubleshooting

### File Not Found Errors
Make sure you're in the correct directory:
```python
import os
print("Current directory:", os.getcwd())
print("Available files:", os.listdir('.'))
```

### Missing Libraries
Install required dependencies:
```python
!pip install pandas numpy matplotlib seaborn plotly ipython
```

### Visualization Display Issues
Try different backends:
```python
import matplotlib
matplotlib.use('Agg')  # For headless environments
```

## Next Steps

1. **Explore the Data**: Use pandas operations for deeper analysis
2. **Create New Visualizations**: Build upon the existing analysis  
3. **Statistical Analysis**: Apply statistical tests and models
4. **Export Results**: Save your findings and create reports

## Support

- Check `metadata/execution_log.txt` for detailed execution steps
- Review `metadata/execution_metadata.json` for technical details
- Original data source information may be in the metadata

---

*Generated by EDA Processor Download Service v1.0*  
*Package created: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*
"""


def _generate_mock_execution_data(execution_id: str) -> Dict[str, Any]:
    """Generate mock execution data for testing"""
    return {
        "success": True,
        "execution_id": execution_id,
        "node_id": "test_node",
        "workflow_type": "basic_eda",
        "steps_executed": 4,
        "total_steps": 4,
        "total_execution_time_ms": 1500,
        "timestamp": datetime.now().isoformat(),
        "pandas_results": {
            "steps": [
                {
                    "function_name": "head",
                    "success": True,
                    "output_type": "data",
                    "execution_time_ms": 250,
                    "output": "Sample data preview"
                },
                {
                    "function_name": "describe",
                    "success": True,
                    "output_type": "data", 
                    "execution_time_ms": 300,
                    "output": "Statistical summary"
                }
            ]
        },
        "matplotlib_results": {
            "steps": [
                {
                    "function_name": "histogram",
                    "success": True,
                    "output_type": "plot",
                    "execution_time_ms": 500,
                    "result": {
                        "plot_type": "histogram",
                        "image_base64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                    }
                }
            ]
        },
        "input_data": {
            "csv_content": "id,value,category\n1,10,A\n2,20,B\n3,30,C\n",
            "filename": "test_data.csv"
        }
    }