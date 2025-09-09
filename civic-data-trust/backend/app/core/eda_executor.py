import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import uuid
import time
import json
from datetime import datetime
from typing import Any, Dict, List, Tuple, Optional, Union
from contextlib import contextmanager
import threading
import traceback

from app.core.executor import DataScienceExecutor
from app.models.requests import FunctionStep
from app.models.responses import StepResult


class EDAExecutor(DataScienceExecutor):
    """Enhanced executor for unified EDA (Exploratory Data Analysis) workflows
    
    Extends DataScienceExecutor to support:
    - Sequential multi-library execution (pandas → numpy → matplotlib)
    - Predefined EDA workflows
    - Error recovery and continuation
    - Progress tracking
    - Performance monitoring
    - Thread-safe operations
    """
    
    def __init__(self):
        super().__init__()
        self.execution_lock = threading.Lock()
        self.progress_callbacks = []
        self.predefined_workflows = self._initialize_predefined_workflows()
        
        # Enhanced performance tracking
        self._library_performance = {
            'pandas': {'total_time': 0, 'function_count': 0},
            'numpy': {'total_time': 0, 'function_count': 0},
            'matplotlib': {'total_time': 0, 'function_count': 0}
        }
    
    def _initialize_predefined_workflows(self) -> Dict[str, List[FunctionStep]]:
        """Initialize predefined EDA workflows"""
        return {
            'basic_eda': [
                FunctionStep(
                    id="basic_eda_1",
                    functionName="head",
                    category="Data Inspection",
                    parameters={"n": 5},
                    description="Display first 5 rows"
                ),
                FunctionStep(
                    id="basic_eda_2",
                    functionName="info",
                    category="Data Inspection",
                    parameters={},
                    description="Dataset information"
                ),
                FunctionStep(
                    id="basic_eda_3",
                    functionName="describe",
                    category="Data Inspection",
                    parameters={"include": "all"},
                    description="Statistical summary"
                ),
                FunctionStep(
                    id="basic_eda_4",
                    functionName="heatmap",
                    category="Statistical Plots",
                    parameters={"correlation": True},
                    description="Correlation heatmap"
                )
            ],
            
            'data_cleaning': [
                FunctionStep(
                    id="cleaning_1",
                    functionName="dropna",
                    category="Data Cleaning",
                    parameters={"axis": 0},
                    description="Remove missing values"
                ),
                FunctionStep(
                    id="cleaning_2",
                    functionName="drop_duplicates",
                    category="Data Cleaning",
                    parameters={},
                    description="Remove duplicate rows"
                ),
                FunctionStep(
                    id="cleaning_3",
                    functionName="describe",
                    category="Data Inspection",
                    parameters={"include": "number"},
                    description="Statistical summary after cleaning"
                )
            ],
            
            'visualization_suite': [
                FunctionStep(
                    id="viz_1",
                    functionName="histogram",
                    category="Basic Plots",
                    parameters={"column": "auto", "bins": 10},
                    description="Distribution histograms"
                ),
                FunctionStep(
                    id="viz_2",
                    functionName="box_plot",
                    category="Statistical Plots",
                    parameters={"columns": "numeric"},
                    description="Box plots for outlier detection"
                ),
                FunctionStep(
                    id="viz_3",
                    functionName="scatter_plot",
                    category="Basic Plots",
                    parameters={"x_column": "auto", "y_column": "auto"},
                    description="Scatter plot relationships"
                ),
                FunctionStep(
                    id="viz_4",
                    functionName="heatmap",
                    category="Statistical Plots",
                    parameters={"correlation": True},
                    description="Correlation matrix"
                )
            ]
        }
    
    def execute_unified_eda_pipeline(self, data: Any, function_chain: List[FunctionStep], 
                                   continue_on_error: bool = True, 
                                   track_progress: bool = True) -> Dict[str, Any]:
        """Execute unified EDA pipeline with multi-library support
        
        Args:
            data: Input data for processing
            function_chain: List of functions to execute across libraries
            continue_on_error: Whether to continue execution after errors
            track_progress: Whether to track execution progress
            
        Returns:
            Dict containing execution results, library summaries, and metadata
        """
        execution_id = str(uuid.uuid4())
        start_time = datetime.now()
        
        with self.execution_lock:
            try:
                # Initialize execution context
                original_data = self.initialize_data(data)
                execution_context = {
                    'execution_id': execution_id,
                    'start_time': start_time,
                    'current_data': original_data,
                    'original_data': original_data,  # Keep reference to original DataFrame for visualizations
                    'results': [],
                    'library_results': {
                        'pandas': {'steps': [], 'data_transformations': []},
                        'numpy': {'steps': [], 'calculations': []},
                        'matplotlib': {'steps': [], 'visualizations': []}
                    },
                    'progress': {'total_steps': len(function_chain), 'completed_steps': 0}
                }
                
                # Group functions by library for sequential execution
                library_groups = self._group_functions_by_library(function_chain)
                
                # Execute each library group sequentially
                for library, steps in library_groups.items():
                    if not steps:
                        continue
                        
                    library_result = self._execute_library_group(
                        execution_context, library, steps, continue_on_error, track_progress
                    )
                    
                    # Update execution context with library results
                    execution_context['library_results'][library].update(library_result)
                    
                    # Update progress
                    if track_progress:
                        self._update_progress(execution_context, len(steps))
                
                # Generate execution summary
                end_time = datetime.now()
                execution_summary = self._generate_execution_summary(
                    execution_context, start_time, end_time
                )
                
                return execution_summary
                
            except Exception as e:
                return self._handle_execution_error(execution_id, str(e), traceback.format_exc())
    
    def _group_functions_by_library(self, function_chain: List[FunctionStep]) -> Dict[str, List[FunctionStep]]:
        """Group functions by library while maintaining execution order"""
        library_groups = {'pandas': [], 'numpy': [], 'matplotlib': []}
        
        # First pass: collect all pandas functions
        for step in function_chain:
            library = getattr(step, 'library', self._infer_library_from_function(step.functionName))
            if library == 'pandas':
                library_groups['pandas'].append(step)
        
        # Second pass: collect numpy functions
        for step in function_chain:
            library = getattr(step, 'library', self._infer_library_from_function(step.functionName))
            if library == 'numpy':
                library_groups['numpy'].append(step)
        
        # Third pass: collect matplotlib functions
        for step in function_chain:
            library = getattr(step, 'library', self._infer_library_from_function(step.functionName))
            if library == 'matplotlib':
                library_groups['matplotlib'].append(step)
        
        return library_groups
    
    def _infer_library_from_function(self, function_name: str) -> str:
        """Infer library from function name"""
        pandas_functions = ['head', 'tail', 'info', 'describe', 'dropna', 'fillna', 'drop_duplicates', 
                           'groupby', 'sort_values', 'merge', 'filter_rows', 'select_columns']
        numpy_functions = ['reshape', 'transpose', 'flatten', 'sum', 'mean', 'std', 'min', 'max']
        matplotlib_functions = ['line_plot', 'scatter_plot', 'histogram', 'bar_plot', 'box_plot', 
                               'violin_plot', 'heatmap', 'pair_plot']
        
        if function_name in pandas_functions:
            return 'pandas'
        elif function_name in numpy_functions:
            return 'numpy'
        elif function_name in matplotlib_functions:
            return 'matplotlib'
        else:
            return 'pandas'  # Default to pandas
    
    def _execute_library_group(self, execution_context: Dict[str, Any], library: str, 
                              steps: List[FunctionStep], continue_on_error: bool, 
                              track_progress: bool) -> Dict[str, Any]:
        """Execute a group of functions for a specific library"""
        library_start_time = time.perf_counter()
        library_results = {'steps': [], 'success_count': 0, 'error_count': 0}
        
        current_data = execution_context['current_data']
        
        for step in steps:
            step_start_time = time.perf_counter()
            
            try:
                # For matplotlib functions, always use original data for visualizations
                if library == 'matplotlib':
                    data_for_function = execution_context['original_data']
                else:
                    data_for_function = current_data
                
                # Execute function based on library
                result, output_type, returns_data = self.execute_function(
                    data_for_function, library, step.functionName, step.parameters
                )
                
                step_end_time = time.perf_counter()
                execution_time_ms = (step_end_time - step_start_time) * 1000
                
                if result is not None:
                    step_result = StepResult(
                        step_id=step.id,
                        function_name=step.functionName,
                        success=True,
                        result=result,
                        execution_time_ms=execution_time_ms,
                        output_type=output_type
                    )
                    
                    # Update current data for next step if this function returns data
                    if returns_data and output_type == "data":
                        current_data = self.update_current_data(result)
                        execution_context['current_data'] = current_data
                    
                    library_results['success_count'] += 1
                    
                    # Store library-specific results
                    if library == 'pandas' and output_type == 'data':
                        library_results.setdefault('data_transformations', []).append(result)
                    elif library == 'numpy':
                        library_results.setdefault('calculations', []).append(result)
                    elif library == 'matplotlib' and output_type == 'plot':
                        library_results.setdefault('visualizations', []).append(result)
                
                else:
                    step_result = StepResult(
                        step_id=step.id,
                        function_name=step.functionName,
                        success=False,
                        error=f"Function {step.functionName} returned no result",
                        execution_time_ms=execution_time_ms,
                        output_type="error"
                    )
                    library_results['error_count'] += 1
                
                library_results['steps'].append(step_result)
                execution_context['results'].append(step_result)
                
                # Update library performance tracking
                self._update_library_performance(library, execution_time_ms)
                
            except Exception as e:
                step_end_time = time.perf_counter()
                execution_time_ms = (step_end_time - step_start_time) * 1000
                
                error_message = self.format_user_friendly_error(str(e), step.functionName)
                
                step_result = StepResult(
                    step_id=step.id,
                    function_name=step.functionName,
                    success=False,
                    error=error_message,
                    execution_time_ms=execution_time_ms,
                    output_type="error"
                )
                
                library_results['steps'].append(step_result)
                execution_context['results'].append(step_result)
                library_results['error_count'] += 1
                
                if not continue_on_error:
                    break
        
        library_end_time = time.perf_counter()
        library_results['total_execution_time_ms'] = (library_end_time - library_start_time) * 1000
        
        return library_results
    
    def _update_library_performance(self, library: str, execution_time_ms: float):
        """Update performance tracking for library"""
        if library in self._library_performance:
            self._library_performance[library]['total_time'] += execution_time_ms
            self._library_performance[library]['function_count'] += 1
    
    def _update_progress(self, execution_context: Dict[str, Any], steps_completed: int):
        """Update execution progress"""
        execution_context['progress']['completed_steps'] += steps_completed
        progress_percentage = (execution_context['progress']['completed_steps'] / 
                             execution_context['progress']['total_steps']) * 100
        
        # Notify progress callbacks
        for callback in self.progress_callbacks:
            try:
                callback(execution_context['execution_id'], progress_percentage)
            except Exception:
                pass  # Don't let callback errors affect execution
    
    def _generate_execution_summary(self, execution_context: Dict[str, Any], 
                                  start_time: datetime, end_time: datetime) -> Dict[str, Any]:
        """Generate comprehensive execution summary"""
        total_execution_time = (end_time - start_time).total_seconds() * 1000
        
        # Calculate success metrics
        total_steps = len(execution_context['results'])
        successful_steps = len([r for r in execution_context['results'] if r.success])
        
        # Generate library summaries
        library_summaries = {}
        for library, results in execution_context['library_results'].items():
            if results['steps']:
                library_summaries[f'{library}_summary'] = {
                    'functions_executed': len(results['steps']),
                    'successful_functions': results.get('success_count', 0),
                    'failed_functions': results.get('error_count', 0),
                    'total_time_ms': results.get('total_execution_time_ms', 0),
                    'data_outputs': len(results.get('data_transformations', [])),
                    'calculations': len(results.get('calculations', [])),
                    'visualizations': len(results.get('visualizations', []))
                }
        
        return {
            'success': successful_steps == total_steps,
            'execution_id': execution_context['execution_id'],
            'results': execution_context['results'],
            'total_execution_time_ms': total_execution_time,
            'steps_executed': successful_steps,
            'total_steps': total_steps,
            'timestamp': end_time.isoformat(),
            
            # Library-specific results
            'pandas_results': execution_context['library_results']['pandas'],
            'numpy_results': execution_context['library_results']['numpy'],
            'matplotlib_results': execution_context['library_results']['matplotlib'],
            
            # Summaries
            **library_summaries,
            
            # Performance metrics
            'performance_summary': {
                'total_time_ms': total_execution_time,
                'average_step_time_ms': total_execution_time / total_steps if total_steps > 0 else 0,
                'library_performance': self._library_performance.copy()
            },
            
            # Progress tracking
            'progress_tracking': execution_context['progress'],
            
            # Final output (last successful data result)
            'final_output': self._get_final_output(execution_context['results'])
        }
    
    def _get_final_output(self, results: List[StepResult]) -> Any:
        """Get the final output from execution results"""
        # Find the last successful result that contains data or plot
        for result in reversed(results):
            if result.success and result.output_type in ['data', 'plot'] and result.result is not None:
                return result.result
        return None
    
    def _handle_execution_error(self, execution_id: str, error_message: str, 
                               traceback_str: str) -> Dict[str, Any]:
        """Handle execution errors gracefully"""
        return {
            'success': False,
            'execution_id': execution_id,
            'error': error_message,
            'traceback': traceback_str,
            'results': [],
            'total_execution_time_ms': 0,
            'timestamp': datetime.now().isoformat()
        }
    
    def execute_predefined_workflow(self, data: Any, workflow_type: str, 
                                  **kwargs) -> Dict[str, Any]:
        """Execute a predefined EDA workflow
        
        Args:
            data: Input data
            workflow_type: Type of predefined workflow
            **kwargs: Additional parameters for workflow customization
            
        Returns:
            Execution results
        """
        if workflow_type not in self.predefined_workflows:
            raise ValueError(f"Unknown workflow type: {workflow_type}. Available: {list(self.predefined_workflows.keys())}")
        
        function_chain = self.predefined_workflows[workflow_type].copy()
        
        # Customize workflow based on data characteristics
        function_chain = self._customize_workflow_for_data(function_chain, data, **kwargs)
        
        # Execute the workflow
        result = self.execute_unified_eda_pipeline(
            data=data,
            function_chain=function_chain,
            continue_on_error=kwargs.get('continue_on_error', True),
            track_progress=kwargs.get('track_progress', True)
        )
        
        # Add workflow-specific metadata
        result['workflow_type'] = workflow_type
        result['workflow_customized'] = True
        
        return result
    
    def _customize_workflow_for_data(self, function_chain: List[FunctionStep], 
                                   data: Any, **kwargs) -> List[FunctionStep]:
        """Customize workflow based on data characteristics"""
        # Convert data to DataFrame for analysis
        if isinstance(data, list) and len(data) > 0 and isinstance(data[0], dict):
            df = pd.DataFrame(data)
        elif isinstance(data, pd.DataFrame):
            df = data
        else:
            return function_chain  # Return unchanged if can't analyze
        
        customized_chain = []
        
        for step in function_chain:
            new_step = step.copy()
            
            # Customize based on function type
            if step.functionName == 'histogram' and 'column' in step.parameters:
                if step.parameters['column'] == 'auto':
                    # Find first numeric column
                    numeric_cols = df.select_dtypes(include=[np.number]).columns
                    if len(numeric_cols) > 0:
                        new_step.parameters['column'] = numeric_cols[0]
            
            elif step.functionName == 'scatter_plot':
                if step.parameters.get('x_column') == 'auto' or step.parameters.get('y_column') == 'auto':
                    numeric_cols = df.select_dtypes(include=[np.number]).columns
                    if len(numeric_cols) >= 2:
                        new_step.parameters['x_column'] = numeric_cols[0]
                        new_step.parameters['y_column'] = numeric_cols[1]
            
            elif step.functionName == 'box_plot' and step.parameters.get('columns') == 'numeric':
                numeric_cols = df.select_dtypes(include=[np.number]).columns
                if len(numeric_cols) > 0:
                    new_step.parameters['columns'] = ','.join(numeric_cols[:5])  # Limit to 5 columns
            
            customized_chain.append(new_step)
        
        return customized_chain
    
    def execute_function_chain(self, data: Any, function_chain: List[FunctionStep], 
                             **kwargs) -> Dict[str, Any]:
        """Execute function chain with enhanced error handling and progress tracking
        
        This method provides backward compatibility while adding enhanced features.
        """
        return self.execute_unified_eda_pipeline(
            data=data,
            function_chain=function_chain,
            continue_on_error=kwargs.get('continue_on_error', True),
            track_progress=kwargs.get('track_progress', True)
        )
    
    def add_progress_callback(self, callback):
        """Add a progress callback function"""
        self.progress_callbacks.append(callback)
    
    def remove_progress_callback(self, callback):
        """Remove a progress callback function"""
        if callback in self.progress_callbacks:
            self.progress_callbacks.remove(callback)
    
    def get_performance_metrics(self) -> Dict[str, Any]:
        """Get current performance metrics"""
        return {
            'library_performance': self._library_performance.copy(),
            'cache_size': len(self._performance_cache),
            'total_executions': sum(perf['function_count'] for perf in self._library_performance.values())
        }
    
    def reset_performance_metrics(self):
        """Reset performance tracking metrics"""
        for library in self._library_performance:
            self._library_performance[library] = {'total_time': 0, 'function_count': 0}
        self._performance_cache.clear()