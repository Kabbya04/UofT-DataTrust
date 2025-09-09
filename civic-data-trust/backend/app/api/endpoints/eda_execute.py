from fastapi import APIRouter, HTTPException, BackgroundTasks
from datetime import datetime
import uuid
import asyncio
import tempfile
import os
from typing import Dict, Any, Optional
import logging

from app.models.eda_requests import EDAExecutionRequest, FileProcessingRequest, WorkflowType
from app.models.eda_responses import (
    EDAExecutionResponse, FileProcessingResponse, WorkflowListResponse, 
    HealthCheckResponse, LibrarySummary, PerformanceSummary, ProgressTracking,
    DownloadInfo, FileProcessingInfo, CleanupInfo
)
from app.core.eda_executor import EDAExecutor
from app.core.file_detector import FileTypeDetector, EDAProcessor
from app.services.cloudflare_service import CloudflareService
from app.services.file_packaging_service import FilePackagingService

router = APIRouter()
logger = logging.getLogger(__name__)

# Global instances
eda_executor = EDAExecutor()
file_detector = FileTypeDetector()
eda_processor = EDAProcessor()
cloudflare_service = CloudflareService()
packaging_service = FilePackagingService()

# Active executions tracking
active_executions: Dict[str, Dict[str, Any]] = {}


@router.post("/", response_model=EDAExecutionResponse)
async def execute_eda_pipeline(request: EDAExecutionRequest, background_tasks: BackgroundTasks):
    """Execute unified EDA pipeline with multi-library support
    
    Supports:
    - Predefined workflows (basic_eda, data_cleaning, visualization_suite)
    - Custom function chains across pandas, numpy, matplotlib
    - File type detection and routing
    - Cloudflare tunnel integration for public links
    - Progress tracking and error recovery
    """
    execution_id = str(uuid.uuid4())
    start_time = datetime.now()
    
    try:
        # Validate request
        if request.workflow_type == WorkflowType.CUSTOM and not request.function_chain:
            raise HTTPException(
                status_code=400,
                detail="function_chain is required for CUSTOM workflow type"
            )
        
        # Register active execution
        active_executions[execution_id] = {
            'node_id': request.node_id,
            'start_time': start_time,
            'status': 'initializing'
        }
        
        # Process input data and detect file type
        file_processing_info = None
        if request.input_data:
            file_processing_info = await _process_input_data(request.input_data)
            
            # Auto-detect workflow if requested
            if request.workflow_type == WorkflowType.AUTO_DETECT:
                request.workflow_type = _determine_workflow_from_file_type(
                    file_processing_info.get('file_type', 'UNSUPPORTED')
                )
        
        # Handle media files (skip EDA processing)
        if file_processing_info and file_processing_info.get('eda_skipped', False):
            return await _handle_media_file_processing(
                execution_id, request, file_processing_info, background_tasks
            )
        
        # Execute EDA pipeline
        active_executions[execution_id]['status'] = 'executing'
        
        if request.workflow_type == WorkflowType.CUSTOM:
            execution_result = eda_executor.execute_unified_eda_pipeline(
                data=request.input_data,
                function_chain=request.function_chain,
                continue_on_error=request.continue_on_error,
                track_progress=request.track_progress
            )
        else:
            execution_result = eda_executor.execute_predefined_workflow(
                data=request.input_data,
                workflow_type=request.workflow_type.value,
                continue_on_error=request.continue_on_error,
                track_progress=request.track_progress
            )
        
        # Generate download link if requested
        download_info = None
        if request.generate_download_link and execution_result['success']:
            download_info = await _generate_download_link(
                execution_result, request, background_tasks
            )
        
        # Build response
        response = _build_eda_response(
            execution_id, request, execution_result, file_processing_info, download_info
        )
        
        # Schedule cleanup if requested
        if request.auto_cleanup:
            background_tasks.add_task(_cleanup_execution, execution_id)
        
        # Update execution status
        active_executions[execution_id]['status'] = 'completed'
        
        return response
        
    except Exception as e:
        logger.error(f"EDA execution failed for {execution_id}: {str(e)}")
        
        # Update execution status
        if execution_id in active_executions:
            active_executions[execution_id]['status'] = 'failed'
        
        # Return error response
        return EDAExecutionResponse(
            success=False,
            execution_id=execution_id,
            node_id=request.node_id,
            workflow_type=request.workflow_type,
            results=[],
            steps_executed=0,
            total_steps=0,
            total_execution_time_ms=0,
            timestamp=datetime.now().isoformat(),
            error=str(e)
        )


@router.post("/process-files", response_model=FileProcessingResponse)
async def process_files(request: FileProcessingRequest):
    """Process and analyze multiple files for EDA routing"""
    try:
        processing_results = []
        recommended_workflows = {}
        
        for file_info in request.files:
            # Create temporary file for processing
            with tempfile.NamedTemporaryFile(delete=False, suffix=f"_{file_info['filename']}") as temp_file:
                if isinstance(file_info['file_content'], str):
                    temp_file.write(file_info['file_content'].encode('utf-8'))
                else:
                    temp_file.write(file_info['file_content'])
                temp_file_path = temp_file.name
            
            try:
                # Detect file type and determine processing route
                file_type = file_detector.detect_file_type(temp_file_path)
                processing_route = eda_processor.determine_processing_route(temp_file_path)
                
                file_result = {
                    'filename': file_info['filename'],
                    'file_type': file_type.value,
                    'processing_route': processing_route,
                    'metadata': file_detector.extract_file_metadata(temp_file_path)
                }
                
                processing_results.append(file_result)
                recommended_workflows[file_info['filename']] = processing_route.get('recommended_workflow', 'unsupported')
                
            finally:
                # Cleanup temporary file
                os.unlink(temp_file_path)
        
        return FileProcessingResponse(
            success=True,
            files_processed=len(request.files),
            processing_results=processing_results,
            recommended_workflows=recommended_workflows,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"File processing failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"File processing failed: {str(e)}")


@router.get("/workflows", response_model=WorkflowListResponse)
async def get_available_workflows():
    """Get list of available EDA workflows"""
    workflows = {
        "basic_eda": {
            "name": "Basic EDA",
            "description": "Essential exploratory data analysis with head, info, describe, and correlation heatmap",
            "functions": ["head", "info", "describe", "heatmap"],
            "estimated_time_ms": 2000,
            "libraries": ["pandas", "matplotlib"]
        },
        "data_cleaning": {
            "name": "Data Cleaning",
            "description": "Clean and prepare data by removing missing values and duplicates",
            "functions": ["dropna", "drop_duplicates", "describe"],
            "estimated_time_ms": 1500,
            "libraries": ["pandas"]
        },
        "visualization_suite": {
            "name": "Visualization Suite",
            "description": "Comprehensive data visualization with multiple plot types",
            "functions": ["histogram", "box_plot", "scatter_plot", "heatmap"],
            "estimated_time_ms": 3000,
            "libraries": ["matplotlib"]
        }
    }
    
    return WorkflowListResponse(
        workflows=workflows,
        custom_workflow_supported=True
    )


@router.get("/health", response_model=HealthCheckResponse)
async def health_check():
    """Check health status of EDA system components"""
    try:
        # Check component status
        eda_status = "operational" if eda_executor else "unavailable"
        detector_status = "operational" if file_detector else "unavailable"
        
        # Get system metrics
        import psutil
        memory_usage = psutil.virtual_memory().used / 1024 / 1024  # MB
        system_load = psutil.cpu_percent()
        
        return HealthCheckResponse(
            status="healthy",
            eda_executor_status=eda_status,
            file_detector_status=detector_status,
            cloudflare_service_status="operational",
            active_executions=len(active_executions),
            system_load=system_load,
            memory_usage_mb=memory_usage,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return HealthCheckResponse(
            status="unhealthy",
            eda_executor_status="unknown",
            file_detector_status="unknown",
            active_executions=0,
            timestamp=datetime.now().isoformat()
        )


@router.get("/executions/{execution_id}/status")
async def get_execution_status(execution_id: str):
    """Get status of a specific execution"""
    if execution_id not in active_executions:
        raise HTTPException(status_code=404, detail="Execution not found")
    
    execution_info = active_executions[execution_id]
    current_time = datetime.now()
    elapsed_time = (current_time - execution_info['start_time']).total_seconds() * 1000
    
    return {
        "execution_id": execution_id,
        "status": execution_info['status'],
        "node_id": execution_info['node_id'],
        "elapsed_time_ms": elapsed_time,
        "timestamp": current_time.isoformat()
    }


# Helper functions

async def _process_input_data(input_data: Dict[str, Any]) -> Dict[str, Any]:
    """Process input data and detect file type"""
    if 'csv_content' in input_data:
        # Create temporary file for CSV content
        with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as temp_file:
            temp_file.write(input_data['csv_content'])
            temp_file_path = temp_file.name
        
        try:
            file_type = file_detector.detect_file_type(temp_file_path)
            processing_route = eda_processor.determine_processing_route(temp_file_path)
            
            return {
                'file_type': file_type.value,
                'processing_route': processing_route['recommended_workflow'],
                'should_process_eda': processing_route['should_process_eda'],
                'eda_skipped': not processing_route['should_process_eda']
            }
        finally:
            os.unlink(temp_file_path)
    
    elif 'file_content' in input_data:
        # Handle binary file content
        filename = input_data.get('filename', 'unknown')
        file_extension = os.path.splitext(filename)[1].lower()
        
        # Determine if it's a media file based on extension
        media_extensions = {'.mp3', '.wav', '.mp4', '.avi', '.jpg', '.png'}
        is_media = file_extension in media_extensions
        
        return {
            'file_type': 'MEDIA_AUDIO' if file_extension in {'.mp3', '.wav'} else 'MEDIA_VIDEO' if file_extension in {'.mp4', '.avi'} else 'MEDIA_IMAGE',
            'processing_route': 'media_packaging',
            'should_process_eda': False,
            'eda_skipped': True,
            'reason_skipped': 'Media file detected - EDA not applicable'
        }
    
    return {
        'file_type': 'UNKNOWN',
        'processing_route': 'eda_pipeline',
        'should_process_eda': True,
        'eda_skipped': False
    }


def _determine_workflow_from_file_type(file_type: str) -> WorkflowType:
    """Determine appropriate workflow based on file type"""
    if file_type.startswith('TABULAR'):
        return WorkflowType.BASIC_EDA
    elif file_type.startswith('MEDIA'):
        return WorkflowType.CUSTOM  # Will be handled as media processing
    else:
        return WorkflowType.BASIC_EDA  # Default fallback


async def _handle_media_file_processing(execution_id: str, request: EDAExecutionRequest, 
                                      file_info: Dict[str, Any], background_tasks: BackgroundTasks) -> EDAExecutionResponse:
    """Handle processing of media files (skip EDA, go to packaging)"""
    try:
        # Create package with media file
        if request.generate_download_link:
            # Mock packaging for media files
            download_info = DownloadInfo(
                download_url=f"https://eda-results.example.com/media/{execution_id}.zip",
                wget_command=f"wget https://eda-results.example.com/media/{execution_id}.zip",
                colab_compatible=True,
                package_size_mb=1.5,
                colab_instructions="Download and extract the media file in Google Colab"
            )
        else:
            download_info = None
        
        return EDAExecutionResponse(
            success=True,
            execution_id=execution_id,
            node_id=request.node_id,
            workflow_type=request.workflow_type,
            results=[],
            steps_executed=0,
            total_steps=0,
            total_execution_time_ms=100,  # Minimal processing time
            file_type=file_info['file_type'],
            processing_route=file_info['processing_route'],
            eda_skipped=True,
            download_info=download_info,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Media file processing failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Media file processing failed: {str(e)}")


async def _generate_download_link(execution_result: Dict[str, Any], 
                                request: EDAExecutionRequest, 
                                background_tasks: BackgroundTasks) -> DownloadInfo:
    """Generate Cloudflare download link for results"""
    try:
        # Mock Cloudflare integration for now
        # In production, this would use the actual CloudflareService
        
        execution_id = execution_result.get('execution_id', str(uuid.uuid4()))
        
        download_url = f"https://eda-results.example.com/download/{execution_id}.zip"
        wget_command = f"wget {download_url}"
        
        colab_instructions = f"""
# Google Colab Instructions

1. Download the EDA results package:
{wget_command}

2. Extract the package:
!unzip {execution_id}.zip

3. Load the processed data:
import pandas as pd
df = pd.read_csv('processed_data.csv')

4. View the generated visualizations:
from IPython.display import Image, display
display(Image('visualizations/plot_1.png'))
"""
        
        return DownloadInfo(
            download_url=download_url,
            wget_command=wget_command,
            colab_compatible=True,
            package_size_mb=2.5,
            colab_instructions=colab_instructions if request.colab_optimized else None
        )
        
    except Exception as e:
        logger.error(f"Failed to generate download link: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate download link: {str(e)}")


def _build_eda_response(execution_id: str, request: EDAExecutionRequest, 
                       execution_result: Dict[str, Any], file_info: Optional[Dict[str, Any]], 
                       download_info: Optional[DownloadInfo]) -> EDAExecutionResponse:
    """Build comprehensive EDA response"""
    # Extract library summaries
    pandas_summary = None
    numpy_summary = None
    matplotlib_summary = None
    
    if 'pandas_summary' in execution_result:
        pandas_data = execution_result['pandas_summary']
        pandas_summary = LibrarySummary(**pandas_data)
    
    if 'numpy_summary' in execution_result:
        numpy_data = execution_result['numpy_summary']
        numpy_summary = LibrarySummary(**numpy_data)
    
    if 'matplotlib_summary' in execution_result:
        matplotlib_data = execution_result['matplotlib_summary']
        matplotlib_summary = LibrarySummary(**matplotlib_data)
    
    # Build performance summary
    performance_summary = None
    if 'performance_summary' in execution_result:
        perf_data = execution_result['performance_summary']
        performance_summary = PerformanceSummary(**perf_data)
    
    # Build progress tracking
    progress_tracking = None
    if 'progress_tracking' in execution_result:
        progress_data = execution_result['progress_tracking']
        progress_tracking = ProgressTracking(
            total_steps=progress_data['total_steps'],
            completed_steps=progress_data['completed_steps'],
            progress_percentage=(progress_data['completed_steps'] / progress_data['total_steps']) * 100
        )
    
    return EDAExecutionResponse(
        success=execution_result.get('success', False),
        execution_id=execution_id,
        node_id=request.node_id,
        workflow_type=request.workflow_type,
        results=execution_result.get('results', []),
        steps_executed=execution_result.get('steps_executed', 0),
        total_steps=execution_result.get('total_steps', 0),
        pandas_summary=pandas_summary,
        numpy_summary=numpy_summary,
        matplotlib_summary=matplotlib_summary,
        total_execution_time_ms=execution_result.get('total_execution_time_ms', 0),
        performance_summary=performance_summary,
        progress_tracking=progress_tracking,
        final_output=execution_result.get('final_output'),
        pandas_results=execution_result.get('pandas_results'),
        numpy_results=execution_result.get('numpy_results'),
        matplotlib_results=execution_result.get('matplotlib_results'),
        file_type=file_info.get('file_type') if file_info else None,
        processing_route=file_info.get('processing_route') if file_info else None,
        eda_skipped=file_info.get('eda_skipped') if file_info else None,
        download_url=download_info.download_url if download_info else None,
        wget_command=download_info.wget_command if download_info else None,
        colab_compatible=download_info.colab_compatible if download_info else None,
        colab_instructions=download_info.colab_instructions if download_info else None,
        download_info=download_info,
        timestamp=execution_result.get('timestamp', datetime.now().isoformat()),
        error=execution_result.get('error')
    )


async def _cleanup_execution(execution_id: str):
    """Cleanup execution resources"""
    try:
        # Remove from active executions
        if execution_id in active_executions:
            del active_executions[execution_id]
        
        # Additional cleanup logic would go here
        logger.info(f"Cleaned up execution {execution_id}")
        
    except Exception as e:
        logger.error(f"Failed to cleanup execution {execution_id}: {str(e)}")