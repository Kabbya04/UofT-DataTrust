"""EDA execution engine."""

import uuid
import threading
from datetime import datetime
from typing import Any, Dict, List, Optional
from app.core.executor import DataScienceExecutor
from app.core.common.types import ExecutionStatus
from app.exceptions.eda import EDAExecutionError, EDAValidationError
from app.utils.logging import get_logger
from app.utils.performance import track_execution_time, memory_monitor
from .models import EDARequest, EDAResult
from .workflows import WorkflowManager
from .processors import DataProcessor, VisualizationProcessor

logger = get_logger(__name__)


class EDAExecutor(DataScienceExecutor):
    """Enhanced executor for unified EDA workflows."""

    def __init__(self):
        super().__init__()
        self.execution_lock = threading.Lock()
        self.workflow_manager = WorkflowManager()
        self.data_processor = DataProcessor()
        self.visualization_processor = VisualizationProcessor()
        self.active_executions: Dict[str, EDAResult] = {}

        # Performance tracking
        self._library_performance = {
            'pandas': {'total_time': 0, 'function_count': 0},
            'numpy': {'total_time': 0, 'function_count': 0},
            'matplotlib': {'total_time': 0, 'function_count': 0}
        }

    @track_execution_time
    def execute_eda_request(self, request: EDARequest) -> EDAResult:
        """Execute EDA request with proper error handling and tracking."""
        execution_id = str(uuid.uuid4())
        start_time = datetime.now()

        # Create result object
        result = EDAResult(
            execution_id=execution_id,
            node_id=request.node_id,
            status=ExecutionStatus.INITIALIZING,
            start_time=start_time
        )

        with self.execution_lock:
            self.active_executions[execution_id] = result

        try:
            # Validate request
            self._validate_request(request)

            # Update status
            result.status = ExecutionStatus.EXECUTING

            # Execute based on workflow type
            if request.workflow_type == "custom" and request.function_chain:
                execution_result = self._execute_custom_workflow(
                    request.input_data,
                    request.function_chain,
                    request.continue_on_error
                )
            else:
                execution_result = self._execute_predefined_workflow(
                    request.input_data,
                    request.workflow_type,
                    request.continue_on_error
                )

            # Update result
            result.status = ExecutionStatus.COMPLETED
            result.end_time = datetime.now()
            result.results = execution_result.get('results')
            result.visualizations = execution_result.get('visualizations', [])
            result.performance_metrics = {
                **execution_result.get('performance_metrics', {}),
                'memory_usage': memory_monitor(),
                'library_performance': self._library_performance.copy()
            }

            logger.info(f"EDA execution {execution_id} completed successfully")

        except Exception as e:
            result.status = ExecutionStatus.FAILED
            result.end_time = datetime.now()
            result.errors = [str(e)]
            logger.error(f"EDA execution {execution_id} failed: {e}")

        return result

    def _validate_request(self, request: EDARequest) -> None:
        """Validate EDA request."""
        if request.workflow_type == "custom" and not request.function_chain:
            raise EDAValidationError(
                "function_chain is required for custom workflow type"
            )

        if request.workflow_type not in ["custom"] + self.workflow_manager.list_available_workflows():
            raise EDAValidationError(
                f"Unknown workflow type: {request.workflow_type}"
            )

    def _execute_custom_workflow(
        self,
        data: Any,
        function_chain: List[Dict[str, Any]],
        continue_on_error: bool
    ) -> Dict[str, Any]:
        """Execute custom function chain."""
        results = {
            'results': {},
            'visualizations': [],
            'performance_metrics': {}
        }

        current_data = data
        for step in function_chain:
            try:
                step_result = self._execute_function_step(current_data, step)
                results['results'][step.get('id', f"step_{len(results['results'])}")] = step_result

                # Update current data if the step returns data
                if step_result is not None and hasattr(step_result, '__len__'):
                    current_data = step_result

            except Exception as e:
                if not continue_on_error:
                    raise EDAExecutionError(f"Step failed: {str(e)}")

                logger.warning(f"Step {step.get('id', 'unknown')} failed but continuing: {e}")
                results['results'][step.get('id', f"step_{len(results['results'])}")] = {
                    'error': str(e)
                }

        return results

    def _execute_predefined_workflow(
        self,
        data: Any,
        workflow_type: str,
        continue_on_error: bool
    ) -> Dict[str, Any]:
        """Execute predefined workflow."""
        workflow_steps = self.workflow_manager.get_workflow(workflow_type)

        # Convert to function chain format
        function_chain = [
            {
                'id': step.id,
                'function_name': step.function_name,
                'library': step.library,
                'parameters': step.parameters
            }
            for step in workflow_steps
        ]

        return self._execute_custom_workflow(data, function_chain, continue_on_error)

    def _execute_function_step(self, data: Any, step: Dict[str, Any]) -> Any:
        """Execute a single function step."""
        function_name = step.get('function_name')
        library = step.get('library', 'pandas')
        parameters = step.get('parameters', {})

        # Track performance
        start_time = datetime.now()

        try:
            if library == 'pandas':
                result = self.data_processor.process_dataframe(data, function_name, **parameters)
            elif library == 'matplotlib':
                result = self.visualization_processor.create_visualization(
                    data, function_name, **parameters
                )
            else:
                # Fallback to parent executor
                result = super().execute_function(data, function_name, parameters)

            # Update performance metrics
            execution_time = (datetime.now() - start_time).total_seconds()
            self._library_performance[library]['total_time'] += execution_time
            self._library_performance[library]['function_count'] += 1

            return result

        except Exception as e:
            raise EDAExecutionError(f"Function {function_name} failed: {str(e)}", function_name)

    def get_execution_status(self, execution_id: str) -> Optional[EDAResult]:
        """Get execution status by ID."""
        return self.active_executions.get(execution_id)

    def list_active_executions(self) -> List[str]:
        """List active execution IDs."""
        return list(self.active_executions.keys())

    def cleanup_completed_executions(self) -> int:
        """Remove completed executions from memory."""
        completed_ids = [
            exec_id for exec_id, result in self.active_executions.items()
            if result.status in [ExecutionStatus.COMPLETED, ExecutionStatus.FAILED]
        ]

        for exec_id in completed_ids:
            del self.active_executions[exec_id]

        return len(completed_ids)