"""EDA workflow management."""

from typing import Any, Dict, List
from app.models.requests import FunctionStep


class PredefinedWorkflows:
    """Container for predefined EDA workflows."""

    @staticmethod
    def get_basic_eda() -> List[FunctionStep]:
        """Get basic EDA workflow."""
        return [
            FunctionStep(
                id="basic_eda_1",
                function_name="describe",
                library="pandas",
                parameters={}
            ),
            FunctionStep(
                id="basic_eda_2",
                function_name="info",
                library="pandas",
                parameters={}
            ),
            FunctionStep(
                id="basic_eda_3",
                function_name="shape",
                library="pandas",
                parameters={}
            ),
            FunctionStep(
                id="basic_eda_4",
                function_name="isnull",
                library="pandas",
                parameters={}
            )
        ]

    @staticmethod
    def get_data_cleaning() -> List[FunctionStep]:
        """Get data cleaning workflow."""
        return [
            FunctionStep(
                id="clean_1",
                function_name="dropna",
                library="pandas",
                parameters={}
            ),
            FunctionStep(
                id="clean_2",
                function_name="drop_duplicates",
                library="pandas",
                parameters={}
            ),
            FunctionStep(
                id="clean_3",
                function_name="fillna",
                library="pandas",
                parameters={"method": "forward"}
            )
        ]

    @staticmethod
    def get_visualization_suite() -> List[FunctionStep]:
        """Get visualization workflow."""
        return [
            FunctionStep(
                id="viz_1",
                function_name="hist",
                library="matplotlib",
                parameters={"bins": 20}
            ),
            FunctionStep(
                id="viz_2",
                function_name="boxplot",
                library="matplotlib",
                parameters={}
            ),
            FunctionStep(
                id="viz_3",
                function_name="scatter",
                library="matplotlib",
                parameters={}
            )
        ]


class WorkflowManager:
    """Manages EDA workflows and execution."""

    def __init__(self):
        self.workflows = PredefinedWorkflows()
        self._workflow_registry = {
            "basic_eda": self.workflows.get_basic_eda,
            "data_cleaning": self.workflows.get_data_cleaning,
            "visualization_suite": self.workflows.get_visualization_suite
        }

    def get_workflow(self, workflow_name: str) -> List[FunctionStep]:
        """Get workflow by name."""
        if workflow_name not in self._workflow_registry:
            raise ValueError(f"Unknown workflow: {workflow_name}")
        return self._workflow_registry[workflow_name]()

    def list_available_workflows(self) -> List[str]:
        """Get list of available workflow names."""
        return list(self._workflow_registry.keys())

    def validate_workflow(self, workflow: List[FunctionStep]) -> bool:
        """Validate workflow steps."""
        if not workflow:
            return False

        for step in workflow:
            if not all(hasattr(step, attr) for attr in ['id', 'function_name', 'library']):
                return False

        return True