"""EDA data processors."""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from typing import Any, Dict, List, Optional, Tuple
from app.utils.logging import get_logger
from app.utils.performance import track_execution_time
from app.exceptions.eda import EDAExecutionError

logger = get_logger(__name__)


class DataProcessor:
    """Handles data processing operations for EDA."""

    @track_execution_time
    def process_dataframe(self, data: Any, operation: str, **kwargs) -> Any:
        """Process pandas DataFrame operations."""
        try:
            if not isinstance(data, pd.DataFrame):
                data = pd.DataFrame(data)

            method = getattr(data, operation, None)
            if method is None:
                raise EDAExecutionError(
                    f"Operation '{operation}' not available on DataFrame",
                    function_name=operation
                )

            if callable(method):
                return method(**kwargs)
            return method

        except Exception as e:
            logger.error(f"Data processing error in {operation}: {e}")
            raise EDAExecutionError(
                f"Failed to execute {operation}: {str(e)}",
                function_name=operation
            )

    def get_basic_stats(self, data: pd.DataFrame) -> Dict[str, Any]:
        """Get basic statistical information about the data."""
        try:
            return {
                "shape": data.shape,
                "columns": list(data.columns),
                "dtypes": data.dtypes.to_dict(),
                "null_counts": data.isnull().sum().to_dict(),
                "memory_usage": data.memory_usage(deep=True).sum(),
                "numeric_columns": list(data.select_dtypes(include=[np.number]).columns),
                "categorical_columns": list(data.select_dtypes(include=['object']).columns)
            }
        except Exception as e:
            logger.error(f"Error getting basic stats: {e}")
            raise EDAExecutionError(f"Failed to get basic statistics: {str(e)}")


class VisualizationProcessor:
    """Handles visualization operations for EDA."""

    def __init__(self):
        self.plot_counter = 0

    @track_execution_time
    def create_visualization(
        self,
        data: pd.DataFrame,
        plot_type: str,
        **kwargs
    ) -> Optional[str]:
        """Create visualization and return file path."""
        try:
            plt.figure(figsize=kwargs.get('figsize', (10, 6)))

            if plot_type == "histogram":
                self._create_histogram(data, **kwargs)
            elif plot_type == "boxplot":
                self._create_boxplot(data, **kwargs)
            elif plot_type == "scatter":
                self._create_scatter(data, **kwargs)
            elif plot_type == "correlation_heatmap":
                self._create_correlation_heatmap(data, **kwargs)
            else:
                raise EDAExecutionError(f"Unknown plot type: {plot_type}")

            # Save plot
            self.plot_counter += 1
            filename = f"eda_plot_{self.plot_counter}_{plot_type}.png"
            filepath = f"temp/{filename}"
            plt.savefig(filepath, dpi=300, bbox_inches='tight')
            plt.close()

            return filepath

        except Exception as e:
            logger.error(f"Visualization error for {plot_type}: {e}")
            plt.close()  # Ensure plot is closed even on error
            raise EDAExecutionError(
                f"Failed to create {plot_type} visualization: {str(e)}",
                function_name=plot_type
            )

    def _create_histogram(self, data: pd.DataFrame, **kwargs) -> None:
        """Create histogram plot."""
        numeric_cols = data.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) == 0:
            raise EDAExecutionError("No numeric columns found for histogram")

        col = kwargs.get('column', numeric_cols[0])
        bins = kwargs.get('bins', 20)
        plt.hist(data[col], bins=bins, alpha=0.7)
        plt.title(f'Histogram of {col}')
        plt.xlabel(col)
        plt.ylabel('Frequency')

    def _create_boxplot(self, data: pd.DataFrame, **kwargs) -> None:
        """Create boxplot."""
        numeric_cols = data.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) == 0:
            raise EDAExecutionError("No numeric columns found for boxplot")

        plt.boxplot([data[col].dropna() for col in numeric_cols[:5]])
        plt.xticks(range(1, len(numeric_cols[:5]) + 1), numeric_cols[:5], rotation=45)
        plt.title('Boxplot of Numeric Variables')
        plt.ylabel('Values')

    def _create_scatter(self, data: pd.DataFrame, **kwargs) -> None:
        """Create scatter plot."""
        numeric_cols = data.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) < 2:
            raise EDAExecutionError("Need at least 2 numeric columns for scatter plot")

        x_col = kwargs.get('x', numeric_cols[0])
        y_col = kwargs.get('y', numeric_cols[1])
        plt.scatter(data[x_col], data[y_col], alpha=0.6)
        plt.xlabel(x_col)
        plt.ylabel(y_col)
        plt.title(f'Scatter Plot: {x_col} vs {y_col}')

    def _create_correlation_heatmap(self, data: pd.DataFrame, **kwargs) -> None:
        """Create correlation heatmap."""
        numeric_data = data.select_dtypes(include=[np.number])
        if numeric_data.empty:
            raise EDAExecutionError("No numeric columns found for correlation heatmap")

        corr_matrix = numeric_data.corr()
        plt.imshow(corr_matrix, cmap='coolwarm', aspect='auto')
        plt.colorbar()
        plt.title('Correlation Heatmap')

        # Add column labels
        plt.xticks(range(len(corr_matrix.columns)), corr_matrix.columns, rotation=45)
        plt.yticks(range(len(corr_matrix.columns)), corr_matrix.columns)