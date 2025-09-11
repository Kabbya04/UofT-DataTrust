import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib
import matplotlib.style as mplstyle
import seaborn as sns
import io
import base64
import warnings
import sys
from typing import Any, Dict, Tuple, Optional, Union
from functools import lru_cache
from contextlib import contextmanager

from app.data.sample_data import SAMPLE_DATA
from app.core.data_validator import DataValidator, validate_dataframe_for_research

# Use non-interactive backend for matplotlib
matplotlib.use('Agg')

# Research-grade matplotlib configuration
plt.rcParams.update({
    'figure.figsize': (12, 8),
    'figure.dpi': 300,
    'savefig.dpi': 300,
    'savefig.bbox': 'tight',
    'savefig.pad_inches': 0.1,
    'font.size': 12,
    'axes.titlesize': 16,
    'axes.labelsize': 14,
    'xtick.labelsize': 12,
    'ytick.labelsize': 12,
    'legend.fontsize': 12,
    'axes.grid': True,
    'grid.alpha': 0.3,
    'axes.spines.top': False,
    'axes.spines.right': False,
    'axes.linewidth': 1.2,
    'lines.linewidth': 2.5,
    'patch.linewidth': 0.5,
    'text.usetex': False,
    'mathtext.fontset': 'stix',
    'font.family': ['DejaVu Sans', 'Arial', 'sans-serif']
})

# Set seaborn style for better aesthetics
sns.set_palette("husl")

# Python 3.12+ optimizations
if sys.version_info >= (3, 12):
    warnings.filterwarnings('ignore', category=pd.errors.PerformanceWarning)
    # ComplexWarning is not available in this NumPy version
    warnings.filterwarnings('ignore', category=Warning)


class DataScienceExecutor:
    """Executor class for running data science function chains - Python 3.12+ optimized"""
    
    def __init__(self):
        self.current_data = None
        self.plots_generated = []
        self._performance_cache = {}
    
    @contextmanager
    def _performance_timer(self, operation_name: str):
        """Context manager for performance timing"""
        import time
        start_time = time.perf_counter()
        try:
            yield
        finally:
            end_time = time.perf_counter()
            self._performance_cache[operation_name] = end_time - start_time
    
    @lru_cache(maxsize=128)
    def _get_column_info(self, columns_tuple: tuple) -> Dict[str, str]:
        """Cached column type information"""
        columns = list(columns_tuple)
        return {col: "cached_info" for col in columns}
    
    def initialize_data(self, input_data: Optional[Dict[str, Any]]) -> Any:
        """Initialize data from input or use sample data with validation"""
        if not input_data:
            # Default to first sample dataset if no input provided
            return SAMPLE_DATA['users'].copy()
        
        # If CSV content is provided directly (from uploaded file)
        if 'csv_content' in input_data:
            try:
                csv_buffer = io.StringIO(input_data['csv_content'])
                df = pd.read_csv(csv_buffer)
                
                # Validate data quality for research-grade analysis
                validation_result = validate_dataframe_for_research(df)
                if not validation_result['validation_passed']:
                    # Log validation issues but continue processing
                    print(f"Data validation warnings: {validation_result['warnings']} warnings, {validation_result['errors']} errors")
                
                return df
            except Exception as e:
                raise ValueError(f"Could not parse CSV content: {str(e)}")
        
        # If dataset_name is provided, use the corresponding sample dataset
        if 'dataset_name' in input_data and input_data['dataset_name'] in SAMPLE_DATA:
            return SAMPLE_DATA[input_data['dataset_name']].copy()
        
        # If dataframe is provided directly
        if 'dataframe' in input_data and isinstance(input_data['dataframe'], dict):
            try:
                df = pd.DataFrame(input_data['dataframe'])
                # Validate converted DataFrame
                validation_result = validate_dataframe_for_research(df)
                if not validation_result['validation_passed']:
                    print(f"Data validation warnings: {validation_result['warnings']} warnings, {validation_result['errors']} errors")
                return df
            except Exception as e:
                raise ValueError(f"Could not convert input data to DataFrame: {str(e)}")
        
        # If raw data is provided, try to convert to DataFrame
        if isinstance(input_data, dict) and 'dataset_name' not in input_data:
            try:
                df = pd.DataFrame(input_data)
                # Validate converted DataFrame
                validation_result = validate_dataframe_for_research(df)
                if not validation_result['validation_passed']:
                    print(f"Data validation warnings: {validation_result['warnings']} warnings, {validation_result['errors']} errors")
                return df
            except Exception as e:
                raise ValueError(f"Could not convert input data to DataFrame: {str(e)}")
        
        # Default fallback
        return SAMPLE_DATA['users'].copy()
    
    def update_current_data(self, result: Any) -> Any:
        """Update current data based on function result"""
        if isinstance(result, list) and result:
            return pd.DataFrame(result)
        else:
            return result
    
    def format_user_friendly_error(self, error_msg: str, function_name: str) -> str:
        """Convert technical errors to user-friendly messages"""
        error_msg_lower = error_msg.lower()
        
        if "not found" in error_msg_lower:
            return f"Column or data not found. {error_msg}"
        elif "unsupported" in error_msg_lower:
            return f"This operation isn't available. {error_msg}"
        elif "invalid" in error_msg_lower:
            return f"Invalid input provided. {error_msg}"
        elif "memory" in error_msg_lower:
            return f"Not enough memory to process this operation. Try with smaller data."
        else:
            return f"Something went wrong with {function_name}. {error_msg}"
    
    def execute_function(self, data: Any, library: str, function_name: str, 
                        parameters: Dict[str, Any]) -> Tuple[Any, str, bool]:
        """Execute a function based on the library with performance monitoring"""
        with self._performance_timer(f"{library}_{function_name}"):
            if library == 'pandas':
                return self.execute_pandas_function(data, function_name, parameters)
            elif library == 'numpy':
                return self.execute_numpy_function(data, function_name, parameters)
            elif library == 'matplotlib':
                return self.execute_matplotlib_function(data, function_name, parameters)
            else:
                raise ValueError(f"Unsupported library: {library}")
    
    def execute_pandas_function(self, data: pd.DataFrame, function_name: str, 
                               parameters: Dict[str, Any]) -> Tuple[Any, str, bool]:
        """Execute pandas function with error handling"""
        try:
            # Cache column information for better performance
            if hasattr(data, 'columns'):
                columns_tuple = tuple(data.columns)
                self._get_column_info(columns_tuple)
            
            # Data Inspection functions
            if function_name == 'head':
                n = parameters.get('n', 5)
                result = data.head(n)
                return result.to_dict('records'), "data", True
            
            elif function_name == 'tail':
                n = parameters.get('n', 5)
                result = data.tail(n)
                return result.to_dict('records'), "data", True
            
            elif function_name == 'info':
                buffer = io.StringIO()
                data.info(buf=buffer)
                info_str = buffer.getvalue()
                return {"info": info_str, "shape": data.shape, "columns": list(data.columns)}, "info", False
            
            elif function_name == 'describe':
                include = parameters.get('include', 'all')
                if include == 'all':
                    include = 'all'
                elif include == 'number':
                    include = [np.number]
                elif include == 'object':
                    include = [object]
                
                result = data.describe(include=include)
                return result.to_dict(), "data", True
            
            elif function_name == 'shape':
                return {"rows": data.shape[0], "columns": data.shape[1]}, "info", False
            
            elif function_name == 'dtypes':
                dtypes_info = data.dtypes.to_dict()
                # Convert numpy dtypes to string for JSON serialization
                dtypes_str = {col: str(dtype) for col, dtype in dtypes_info.items()}
                return {"column_types": dtypes_str}, "info", False
            
            elif function_name == 'isnull':
                null_counts = data.isnull().sum().to_dict()
                null_percentage = (data.isnull().sum() / len(data) * 100).to_dict()
                return {
                    "null_counts": null_counts,
                    "null_percentage": null_percentage,
                    "total_nulls": data.isnull().sum().sum()
                }, "data", True
            
            elif function_name == 'memory_usage':
                deep = parameters.get('deep', False)
                memory_info = data.memory_usage(deep=deep).to_dict()
                total_memory = sum(memory_info.values())
                return {
                    "memory_usage_bytes": memory_info,
                    "total_memory_bytes": total_memory,
                    "total_memory_mb": round(total_memory / (1024 * 1024), 2)
                }, "info", False
            
            # Data Cleaning functions
            elif function_name == 'dropna':
                axis = parameters.get('axis', 0)
                how = parameters.get('how', 'any')
                result = data.dropna(axis=axis, how=how)
                return result.to_dict('records'), "data", True
            
            elif function_name == 'fillna':
                value = parameters.get('value', '')
                method = parameters.get('method', 'none')
                
                if method == 'none':
                    result = data.fillna(value)
                else:
                    if method == 'ffill':
                        result = data.ffill()
                    elif method == 'bfill':
                        result = data.bfill()
                    else:
                        result = data.fillna(value)
                return result.to_dict('records'), "data", True
            
            elif function_name == 'drop_duplicates':
                keep = parameters.get('keep', 'first')
                if keep == 'false':
                    keep = False
                result = data.drop_duplicates(keep=keep)
                return result.to_dict('records'), "data", True
            
            # Data Manipulation functions
            elif function_name == 'groupby':
                by = parameters.get('by', '')
                agg_func = parameters.get('agg_func', 'sum')
                
                if not by or by not in data.columns:
                    raise ValueError(f"Column '{by}' not found. Available columns: {list(data.columns)}")
                
                grouped = data.groupby(by)
                
                if agg_func == 'sum':
                    result = grouped.sum(numeric_only=True)
                elif agg_func == 'mean':
                    result = grouped.mean(numeric_only=True)
                elif agg_func == 'count':
                    result = grouped.count()
                elif agg_func == 'min':
                    result = grouped.min(numeric_only=True)
                elif agg_func == 'max':
                    result = grouped.max(numeric_only=True)
                else:
                    result = grouped.sum(numeric_only=True)
                
                result = result.reset_index()
                return result.to_dict('records'), "data", True
            
            elif function_name == 'sort_values':
                by = parameters.get('by', '')
                ascending = parameters.get('ascending', True)
                
                if not by or by not in data.columns:
                    raise ValueError(f"Column '{by}' not found. Available columns: {list(data.columns)}")
                
                result = data.sort_values(by=by, ascending=ascending)
                return result.to_dict('records'), "data", True
            
            elif function_name == 'pivot_table':
                values = parameters.get('values', '')
                index = parameters.get('index', '')
                columns = parameters.get('columns', '')
                aggfunc = parameters.get('aggfunc', 'mean')
                
                if not all([values, index]) or values not in data.columns or index not in data.columns:
                    raise ValueError(f"Required columns not found. Available: {list(data.columns)}")
                
                pivot_params = {'values': values, 'index': index, 'aggfunc': aggfunc}
                if columns and columns in data.columns:
                    pivot_params['columns'] = columns
                
                result = data.pivot_table(**pivot_params)
                result = result.reset_index()
                return result.to_dict('records'), "data", True
            
            # Data Selection functions
            elif function_name == 'filter_rows':
                column = parameters.get('column', '')
                operator = parameters.get('operator', '>')
                value = parameters.get('value', '')
                
                if not column or column not in data.columns:
                    raise ValueError(f"Column '{column}' not found. Available columns: {list(data.columns)}")
                
                # Convert value to appropriate type
                try:
                    if data[column].dtype in ['int64', 'float64']:
                        value = float(value)
                except (ValueError, TypeError):
                    pass  # Keep as string
                
                # Handle different operators
                if operator == '>':
                    result = data[data[column] > value]
                elif operator == '<':
                    result = data[data[column] < value]
                elif operator == '>=':
                    result = data[data[column] >= value]
                elif operator == '<=':
                    result = data[data[column] <= value]
                elif operator == '==':
                    result = data[data[column] == value]
                elif operator == '!=':
                    result = data[data[column] != value]
                else:
                    raise ValueError(f"Unsupported operator: {operator}")
                
                return result.to_dict('records'), "data", True
            
            elif function_name == 'select_columns':
                columns = parameters.get('columns', '')
                if isinstance(columns, str):
                    columns = [col.strip() for col in columns.split(',')]
                
                missing_cols = [col for col in columns if col not in data.columns]
                if missing_cols:
                    raise ValueError(f"Columns not found: {missing_cols}. Available: {list(data.columns)}")
                
                result = data[columns]
                return result.to_dict('records'), "data", True
            
            # Statistical Analysis functions
            elif function_name == 'correlation':
                method = parameters.get('method', 'pearson')
                numeric_data = data.select_dtypes(include=[np.number])
                if numeric_data.empty:
                    raise ValueError("No numeric columns found for correlation analysis")
                
                correlation_matrix = numeric_data.corr(method=method)
                return correlation_matrix.to_dict(), "data", True
            
            elif function_name == 'value_counts':
                column = parameters.get('column', '')
                normalize = parameters.get('normalize', False)
                sort_values = parameters.get('sort', True)
                
                if not column or column not in data.columns:
                    # Auto-select first categorical or object column if not specified
                    categorical_cols = list(data.select_dtypes(include=['object', 'category']).columns)
                    if not categorical_cols:
                        raise ValueError("No categorical columns found for value_counts")
                    column = categorical_cols[0]
                    if parameters.get('column'):
                        print(f"Warning: Column '{parameters.get('column')}' not found. Using '{column}' instead.")
                
                counts = data[column].value_counts(normalize=normalize, sort=sort_values)
                return {
                    "column": column,
                    "counts": counts.to_dict(),
                    "total_unique": len(counts)
                }, "data", True
            
            elif function_name == 'unique':
                column = parameters.get('column', '')
                
                if not column or column not in data.columns:
                    raise ValueError(f"Column '{column}' not found. Available columns: {list(data.columns)}")
                
                unique_values = data[column].unique()
                # Convert numpy types to Python types for JSON serialization
                unique_list = [str(val) if pd.isna(val) else val for val in unique_values.tolist()]
                
                return {
                    "column": column,
                    "unique_values": unique_list,
                    "count": len(unique_values)
                }, "data", True
            
            elif function_name == 'nunique':
                column = parameters.get('column', '')
                
                if column and column in data.columns:
                    # Single column
                    unique_count = data[column].nunique()
                    return {
                        "column": column,
                        "unique_count": unique_count
                    }, "data", True
                else:
                    # All columns
                    unique_counts = data.nunique().to_dict()
                    return {
                        "unique_counts_per_column": unique_counts,
                        "total_columns": len(unique_counts)
                    }, "data", True
            
            elif function_name == 'covariance':
                numeric_data = data.select_dtypes(include=[np.number])
                if numeric_data.empty:
                    raise ValueError("No numeric columns found for covariance analysis")
                
                covariance_matrix = numeric_data.cov()
                return covariance_matrix.to_dict(), "data", True
            
            # Outlier Detection functions
            elif function_name == 'detect_outliers_iqr':
                column = parameters.get('column', '')
                multiplier = parameters.get('multiplier', 1.5)
                
                if not column or column not in data.columns:
                    # Auto-select first numeric column
                    numeric_cols = list(data.select_dtypes(include=[np.number]).columns)
                    if not numeric_cols:
                        raise ValueError("No numeric columns found for outlier detection")
                    column = numeric_cols[0]
                    if parameters.get('column'):
                        print(f"Warning: Column '{parameters.get('column')}' not found. Using '{column}' instead.")
                
                if not pd.api.types.is_numeric_dtype(data[column]):
                    raise ValueError(f"Column '{column}' is not numeric")
                
                Q1 = data[column].quantile(0.25)
                Q3 = data[column].quantile(0.75)
                IQR = Q3 - Q1
                
                lower_bound = Q1 - multiplier * IQR
                upper_bound = Q3 + multiplier * IQR
                
                outliers = data[(data[column] < lower_bound) | (data[column] > upper_bound)]
                
                return {
                    "column": column,
                    "outlier_count": len(outliers),
                    "outlier_percentage": round(len(outliers) / len(data) * 100, 2),
                    "bounds": {"lower": lower_bound, "upper": upper_bound},
                    "quartiles": {"Q1": Q1, "Q3": Q3, "IQR": IQR},
                    "outlier_indices": outliers.index.tolist()
                }, "data", True
            
            elif function_name == 'detect_outliers_zscore':
                column = parameters.get('column', '')
                threshold = parameters.get('threshold', 3)
                
                if not column or column not in data.columns:
                    # Auto-select first numeric column
                    numeric_cols = list(data.select_dtypes(include=[np.number]).columns)
                    if not numeric_cols:
                        raise ValueError("No numeric columns found for outlier detection")
                    column = numeric_cols[0]
                    if parameters.get('column'):
                        print(f"Warning: Column '{parameters.get('column')}' not found. Using '{column}' instead.")
                
                if not pd.api.types.is_numeric_dtype(data[column]):
                    raise ValueError(f"Column '{column}' is not numeric")
                
                z_scores = np.abs((data[column] - data[column].mean()) / data[column].std())
                outliers = data[z_scores > threshold]
                
                return {
                    "column": column,
                    "outlier_count": len(outliers),
                    "outlier_percentage": round(len(outliers) / len(data) * 100, 2),
                    "threshold": threshold,
                    "mean": data[column].mean(),
                    "std": data[column].std(),
                    "outlier_indices": outliers.index.tolist()
                }, "data", True
            
            else:
                raise ValueError(f"Function '{function_name}' is not supported")
        
        except Exception as e:
            # Log the actual error for debugging
            error_msg = str(e)
            print(f"Pandas function '{function_name}' error: {error_msg}")
            print(f"Data type: {type(data)}, Data shape: {getattr(data, 'shape', 'N/A')}")
            # Return the actual error message instead of generic "error"
            return None, self.format_user_friendly_error(error_msg, function_name), False
    
    def execute_numpy_function(self, data: Any, function_name: str, 
                              parameters: Dict[str, Any]) -> Tuple[Any, str, bool]:
        """Execute numpy function with error handling"""
        try:
            # Convert data to numpy array with better type handling
            if isinstance(data, pd.DataFrame):
                # For DataFrames (from uploaded CSV), extract numeric columns
                numeric_cols = data.select_dtypes(include=[np.number]).columns
                if len(numeric_cols) > 0:
                    # Use all numeric data as a flattened array
                    arr = data[numeric_cols].values.flatten()
                    arr = arr[~np.isnan(arr)]  # Remove NaN values
                else:
                    raise ValueError("No numeric columns found in the uploaded CSV data")
            elif isinstance(data, list):
                # Check if all items are numeric
                if data and isinstance(data[0], dict):
                    # List of dictionaries (from pandas operations)
                    df = pd.DataFrame(data)
                    numeric_cols = df.select_dtypes(include=[np.number]).columns
                    if len(numeric_cols) > 0:
                        arr = df[numeric_cols].values.flatten()
                        arr = arr[~np.isnan(arr)]  # Remove NaN values
                    else:
                        raise ValueError("No numeric data found in the dataset")
                else:
                    # Simple list of values
                    numeric_data = [x for x in data if isinstance(x, (int, float)) and x is not None]
                    if numeric_data:
                        arr = np.array(numeric_data, dtype=np.float64)
                    else:
                        arr = np.array(data)
            elif isinstance(data, dict):
                # Extract numeric values from dict
                numeric_data = []
                for key, value in data.items():
                    if isinstance(value, (int, float)):
                        numeric_data.append(value)
                    elif isinstance(value, list):
                        numeric_data.extend([v for v in value if isinstance(v, (int, float))])
                arr = np.array(numeric_data, dtype=np.float64) if numeric_data else np.array([])
            else:
                arr = np.array(data, dtype=np.float64)
            
            # Array Operations
            if function_name == 'reshape':
                shape = parameters.get('shape', '')
                if isinstance(shape, str):
                    try:
                        shape_parts = [int(x.strip()) for x in shape.split(',')]
                        shape_tuple = tuple(shape_parts)
                    except ValueError:
                        raise ValueError(f"Invalid shape format: {shape}. Use format like '2,3' or '-1,1'")
                else:
                    shape_tuple = shape
                
                result = arr.reshape(shape_tuple)
                return result.tolist(), "data", True
            
            elif function_name == 'transpose':
                result = arr.T
                return result.tolist(), "data", True
            
            elif function_name == 'flatten':
                result = arr.flatten()
                return result.tolist(), "data", True
            
            # Mathematical Operations
            elif function_name == 'sum':
                axis = parameters.get('axis', 'None')
                if axis == 'None':
                    result = float(np.sum(arr))
                else:
                    result = np.sum(arr, axis=int(axis)).tolist()
                return result, "data", True
            
            elif function_name == 'mean':
                axis = parameters.get('axis', 'None')
                if axis == 'None':
                    result = float(np.mean(arr))
                else:
                    result = np.mean(arr, axis=int(axis)).tolist()
                return result, "data", True
            
            elif function_name == 'std':
                axis = parameters.get('axis', 'None')
                if axis == 'None':
                    result = float(np.std(arr))
                else:
                    result = np.std(arr, axis=int(axis)).tolist()
                return result, "data", True
            
            else:
                raise ValueError(f"Function '{function_name}' is not supported")
        
        except Exception as e:
            # Log the actual error for debugging
            error_msg = str(e)
            print(f"Numpy function '{function_name}' error: {error_msg}")
            print(f"Data type: {type(data)}")
            # Return the actual error message instead of generic "error"
            return None, self.format_user_friendly_error(error_msg, function_name), False
    
    def execute_matplotlib_function(self, data: Any, function_name: str, 
                                  parameters: Dict[str, Any]) -> Tuple[Any, str, bool]:
        """Execute matplotlib function with error handling"""
        try:
            # Convert data to DataFrame with robust error handling
            if isinstance(data, pd.DataFrame):
                df = data
            elif isinstance(data, list) and len(data) > 0:
                if isinstance(data[0], dict):
                    df = pd.DataFrame(data)
                else:
                    # Handle list of values
                    df = pd.DataFrame({'values': data})
            elif isinstance(data, dict):
                # Handle single dictionary or nested dictionary
                if all(isinstance(v, (list, tuple)) for v in data.values()):
                    df = pd.DataFrame(data)
                else:
                    df = pd.DataFrame([data])
            elif isinstance(data, (tuple, list)) and len(data) == 0:
                raise ValueError("Empty data provided - cannot create plot")
            else:
                # Try to convert to DataFrame as last resort
                try:
                    df = pd.DataFrame(data)
                except Exception as e:
                    raise ValueError(f"Data format not supported for plotting. Expected DataFrame, list of dicts, or dict. Got {type(data)}. Error: {str(e)}")
            
            # Create figure with research-grade settings
            figsize = parameters.get('figsize', (12, 8))
            if isinstance(figsize, str):
                # Parse figsize string like "12,8"
                figsize = tuple(map(float, figsize.split(',')))
            
            plt.figure(figsize=figsize)
            
            # Apply style theme
            style_theme = parameters.get('style', 'default')
            if style_theme in ['seaborn', 'ggplot', 'bmh', 'fivethirtyeight']:
                plt.style.use(style_theme)
            else:
                plt.style.use('default')
            
            # Plot functions
            if function_name == 'line_plot':
                x_column = parameters.get('x_column', '')
                y_column = parameters.get('y_column', '')
                title = parameters.get('title', 'Line Plot')
                color = parameters.get('color', 'blue')
                linewidth = parameters.get('linewidth', 2.5)
                linestyle = parameters.get('linestyle', '-')
                marker = parameters.get('marker', '')
                
                if not x_column or x_column not in df.columns:
                    raise ValueError(f"X column '{x_column}' not found. Available: {list(df.columns)}")
                if not y_column or y_column not in df.columns:
                    raise ValueError(f"Y column '{y_column}' not found. Available: {list(df.columns)}")
                
                plt.plot(df[x_column], df[y_column], 
                        color=color, linewidth=linewidth, linestyle=linestyle, marker=marker)
                plt.xlabel(x_column, fontsize=14)
                plt.ylabel(y_column, fontsize=14)
                plt.title(title, fontsize=16, fontweight='bold', pad=20)
                plt.grid(True, alpha=0.3)
                plt.tight_layout()
            
            elif function_name == 'scatter_plot':
                x_column = parameters.get('x_column', '')
                y_column = parameters.get('y_column', '')
                title = parameters.get('title', 'Scatter Plot')
                color = parameters.get('color', 'blue')
                size = parameters.get('size', 60)
                alpha = parameters.get('alpha', 0.7)
                marker = parameters.get('marker', 'o')
                
                # Auto-select numeric columns if not specified or invalid
                numeric_cols = list(df.select_dtypes(include=[np.number]).columns)
                if len(numeric_cols) < 2:
                    raise ValueError(f"Need at least 2 numeric columns for scatter plot. Found: {numeric_cols}")
                
                if not x_column or x_column not in df.columns:
                    x_column = numeric_cols[0]
                    if parameters.get('x_column'):
                        print(f"Warning: X column '{parameters.get('x_column')}' not found. Using '{x_column}' instead.")
                
                if not y_column or y_column not in df.columns:
                    # Use second numeric column if available, otherwise use first
                    y_column = numeric_cols[1] if len(numeric_cols) > 1 and numeric_cols[1] != x_column else numeric_cols[0]
                    if parameters.get('y_column'):
                        print(f"Warning: Y column '{parameters.get('y_column')}' not found. Using '{y_column}' instead.")
                
                plt.scatter(df[x_column], df[y_column], 
                           c=color, s=size, alpha=alpha, marker=marker, edgecolors='black', linewidth=0.5)
                plt.xlabel(x_column, fontsize=14)
                plt.ylabel(y_column, fontsize=14)
                plt.title(title, fontsize=16, fontweight='bold', pad=20)
                plt.grid(True, alpha=0.3)
                plt.tight_layout()
            
            elif function_name == 'histogram':
                column = parameters.get('column', '')
                bins = parameters.get('bins', 30)
                color = parameters.get('color', 'skyblue')
                
                # Auto-select first numeric column if column not specified or invalid
                if not column or column not in df.columns:
                    numeric_cols = list(df.select_dtypes(include=[np.number]).columns)
                    if not numeric_cols:
                        raise ValueError("No numeric columns found for histogram")
                    column = numeric_cols[0]
                    if parameters.get('column'):  # Only warn if user specified a column
                        print(f"Warning: Column '{parameters.get('column')}' not found. Using '{column}' instead. Available: {list(df.columns)}")
                
                plt.hist(df[column], bins=bins, alpha=0.7, edgecolor='black', color=color)
                plt.xlabel(column, fontsize=12)
                plt.ylabel('Frequency', fontsize=12)
                plt.title(f'Histogram of {column}', fontsize=14, fontweight='bold')
                plt.grid(True, alpha=0.3)
            
            elif function_name == 'bar_plot':
                x_column = parameters.get('x_column', '')
                y_column = parameters.get('y_column', '')
                title = parameters.get('title', 'Bar Plot')
                color = parameters.get('color', 'steelblue')
                
                if not x_column or x_column not in df.columns:
                    raise ValueError(f"X column '{x_column}' not found. Available: {list(df.columns)}")
                if not y_column or y_column not in df.columns:
                    raise ValueError(f"Y column '{y_column}' not found. Available: {list(df.columns)}")
                
                plt.bar(df[x_column], df[y_column], color=color, alpha=0.8, edgecolor='black')
                plt.xlabel(x_column, fontsize=12)
                plt.ylabel(y_column, fontsize=12)
                plt.title(title, fontsize=14, fontweight='bold')
                plt.xticks(rotation=45)
                plt.grid(True, alpha=0.3, axis='y')
            
            elif function_name == 'box_plot':
                columns = parameters.get('columns', '')
                title = parameters.get('title', 'Box Plot')
                
                # Handle column specification
                if isinstance(columns, str) and columns:
                    columns = [col.strip() for col in columns.split(',')]
                else:
                    columns = []
                
                # Filter to numeric columns only using pandas numeric detection
                numeric_cols = []
                if columns:
                    # Use specified columns if they exist
                    numeric_cols = [col for col in columns if col in df.columns and pd.api.types.is_numeric_dtype(df[col])]
                
                # Auto-select all numeric columns if none specified or none valid
                if not numeric_cols:
                    all_numeric = list(df.select_dtypes(include=[np.number]).columns)
                    if not all_numeric:
                        raise ValueError("No numeric columns found for box plot")
                    # Limit to first 6 columns to avoid overcrowded plots
                    numeric_cols = all_numeric[:6]
                    if parameters.get('columns'):
                        print(f"Warning: Specified columns '{parameters.get('columns')}' not found or not numeric. Using available numeric columns: {numeric_cols}")
                
                plt.boxplot([df[col].dropna() for col in numeric_cols], labels=numeric_cols)
                plt.ylabel('Values', fontsize=14)
                plt.title(title, fontsize=16, fontweight='bold', pad=20)
                plt.xticks(rotation=45)
                plt.grid(True, alpha=0.3, axis='y')
                plt.tight_layout()
            
            elif function_name == 'heatmap':
                title = parameters.get('title', 'Correlation Heatmap')
                cmap = parameters.get('colormap', 'coolwarm')
                
                # Calculate correlation matrix for numeric columns
                numeric_df = df.select_dtypes(include=[np.number])
                if numeric_df.empty:
                    raise ValueError("No numeric columns found for correlation heatmap")
                
                correlation_matrix = numeric_df.corr()
                
                # Create heatmap using seaborn for better aesthetics
                sns.heatmap(correlation_matrix, annot=True, cmap=cmap, center=0,
                           square=True, fmt='.2f', cbar_kws={'shrink': 0.8})
                plt.title(title, fontsize=14, fontweight='bold')
                plt.tight_layout()
            
            elif function_name == 'violin_plot':
                x_column = parameters.get('x_column', '')
                y_column = parameters.get('y_column', '')
                title = parameters.get('title', 'Violin Plot')
                
                if not y_column or y_column not in df.columns:
                    raise ValueError(f"Y column '{y_column}' not found. Available: {list(df.columns)}")
                
                if x_column and x_column in df.columns:
                    # Grouped violin plot
                    sns.violinplot(data=df, x=x_column, y=y_column)
                    plt.xticks(rotation=45)
                else:
                    # Single violin plot
                    sns.violinplot(y=df[y_column])
                
                plt.xlabel(x_column if x_column else '', fontsize=12)
                plt.ylabel(y_column, fontsize=12)
                plt.title(title, fontsize=14, fontweight='bold')
                plt.grid(True, alpha=0.3)
            
            elif function_name == 'pair_plot':
                title = parameters.get('title', 'Pair Plot')
                hue_column = parameters.get('hue_column', '')
                
                # Select numeric columns for pair plot
                numeric_df = df.select_dtypes(include=[np.number])
                if len(numeric_df.columns) < 2:
                    raise ValueError("Need at least 2 numeric columns for pair plot")
                
                # Limit to first 5 numeric columns to avoid overcrowding
                plot_df = numeric_df.iloc[:, :5]
                
                if hue_column and hue_column in df.columns:
                    plot_df[hue_column] = df[hue_column]
                    sns.pairplot(plot_df, hue=hue_column)
                else:
                    sns.pairplot(plot_df)
                
                plt.suptitle(title, fontsize=14, fontweight='bold', y=1.02)
            
            else:
                raise ValueError(f"Plot function '{function_name}' is not supported")
            
            # Convert plot to base64 string
            buffer = io.BytesIO()
            plt.savefig(buffer, format='png', dpi=150, bbox_inches='tight', 
                       facecolor='white', edgecolor='none')
            buffer.seek(0)
            plot_data = base64.b64encode(buffer.getvalue()).decode()
            plt.close()
            
            plot_info = {
                "plot_type": function_name,
                "image_base64": plot_data,
                "parameters": parameters,
                "python_version": f"{sys.version_info.major}.{sys.version_info.minor}",
                "optimizations_used": sys.version_info >= (3, 12)
            }
            
            return plot_info, "plot", False
        
        except Exception as e:
            plt.close()  # Ensure plot is closed even on error
            # Log the actual error for debugging
            print(f"Matplotlib function '{function_name}' error: {str(e)}")
            print(f"Parameters: {parameters}")
            print(f"Data type: {type(data)}")
            print(f"Data sample: {str(data)[:200] if data is not None else 'None'}...")
            if 'df' in locals():
                print(f"DataFrame columns: {list(df.columns)}")
                print(f"DataFrame shape: {df.shape}")
            else:
                print("DataFrame conversion failed")
            # Return the actual error message instead of generic "error"
            return None, self.format_user_friendly_error(str(e), function_name), False