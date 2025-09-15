"""Tests for EDA executor."""

import pytest
from app.core.eda.executor import EDAExecutor
from app.core.eda.models import EDARequest
from app.core.common.types import ExecutionStatus


class TestEDAExecutor:
    """Test EDA executor functionality."""

    def test_executor_initialization(self, eda_executor):
        """Test EDA executor initialization."""
        assert isinstance(eda_executor, EDAExecutor)
        assert eda_executor.workflow_manager is not None
        assert eda_executor.data_processor is not None

    def test_execute_basic_workflow(self, eda_executor, sample_data):
        """Test basic workflow execution."""
        request = EDARequest(
            node_id="test_node",
            workflow_type="basic_eda",
            input_data=sample_data,
            continue_on_error=True
        )

        result = eda_executor.execute_eda_request(request)

        assert result.execution_id is not None
        assert result.node_id == "test_node"
        assert result.status in [ExecutionStatus.COMPLETED, ExecutionStatus.FAILED]

    def test_list_active_executions(self, eda_executor):
        """Test listing active executions."""
        active_executions = eda_executor.list_active_executions()
        assert isinstance(active_executions, list)