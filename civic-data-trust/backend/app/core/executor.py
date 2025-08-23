import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib
import io
import base64
from typing import Any, Dict, Tuple, Optional, Union

from app.data.sample_data import SAMPLE_DATA

# Use non-interactive backend for matplotlib
matplotlib.use('Agg')

class DataScienceExecutor:
    """Executor class for running data science function chains"""
    
    def __init__(self):
        self.current_data = None
        self.plots_generated = []
    
    def initialize_data(self, input_data: Optional[Dict[str, Any]]) -> Any:
        """Initialize data from input or use sample data"""
        if input_data:
            if 'dataset_name' in input_data and input_data['dataset_name'] in SAMPLE_DATA:
                return SAMPLE_DATA[input_data['dataset_name']]
            else:
                # Try to create DataFrame from input data
                return pd.DataFrame(input_data)
        else:
            # Default to users dataset
            return SAMPLE_DATA['users']
    
    def update_current_data(self, result: Any) -> Any:
        """Update current data based on function result"""
        if isinstance(result, list):
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
        else:
            return f"Something went wrong with {function_name}. {error_msg}"
    
    def execute_function(self, data: Any, library: str, function_name: str, 
                        parameters: Dict[str, Any]) -> Tuple[Any, str, bool]:
        """Execute a function based on the library"""
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
                    result = data.fillna(method=method)
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
                except:
                    pass  # Keep as string
                
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
            
            else:
                raise ValueError(f"Function '{function_name}' is not supported")
        
        except Exception as e:
            return None, "error", False
    
    def execute_numpy_function(self, data: Any, function_name: str, 
                              parameters: Dict[str, Any]) -> Tuple[Any, str, bool]:
        """Execute numpy function with error handling"""
        try:
            # Convert data to numpy array if it's not already
            if isinstance(data, list):
                arr = np.array(data)
            elif isinstance(data, dict):
                # Extract numeric values from dict
                numeric_data = []
                for key, value in data.items():
                    if isinstance(value, (int, float)):
                        numeric_data.append(value)
                    elif isinstance(value, list):
                        numeric_data.extend([v for v in value if isinstance(v, (int, float))])
                arr = np.array(numeric_data) if numeric_data else np.array([])
            else:
                arr = np.array(data)
            
            # Array Operations
            if function_name == 'reshape':
                shape = parameters.get('shape', '')
                if isinstance(shape, str):
                    # Parse shape like "-1,1" or "2,3"
                    shape_parts = [int(x.strip()) for x in shape.split(',')]
                    shape_tuple = tuple(shape_parts)
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
                    axis = int(axis)
                    result = np.sum(arr, axis=axis).tolist()
                return result, "data", True
            
            elif function_name == 'mean':
                axis = parameters.get('axis', 'None')
                if axis == 'None':
                    result = float(np.mean(arr))
                else:
                    axis = int(axis)
                    result = np.mean(arr, axis=axis).tolist()
                return result, "data", True
            
            elif function_name == 'std':
                axis = parameters.get('axis', 'None')
                if axis == 'None':
                    result = float(np.std(arr))
                else:
                    axis = int(axis)
                    result = np.std(arr, axis=axis).tolist()
                return result, "data", True
            
            else:
                raise ValueError(f"Function '{function_name}' is not supported")
        
        except Exception as e:
            return None, "error", False
    
    def execute_matplotlib_function(self, data: Any, function_name: str, 
                                  parameters: Dict[str, Any]) -> Tuple[Any, str, bool]:
        """Execute matplotlib function with error handling"""
        try:
            # Convert data to DataFrame if it's a list of records
            if isinstance(data, list) and len(data) > 0 and isinstance(data[0], dict):
                df = pd.DataFrame(data)
            elif isinstance(data, dict):
                df = pd.DataFrame([data])
            else:
                raise ValueError("Data must be in a format that can be converted to DataFrame for plotting")
            
            plt.figure(figsize=(10, 6))
            
            if function_name == 'line_plot':
                x_column = parameters.get('x_column', '')
                y_column = parameters.get('y_column', '')
                title = parameters.get('title', 'Line Plot')
                
                if not x_column or x_column not in df.columns:
                    raise ValueError(f"X column '{x_column}' not found. Available: {list(df.columns)}")
                if not y_column or y_column not in df.columns:
                    raise ValueError(f"Y column '{y_column}' not found. Available: {list(df.columns)}")
                
                plt.plot(df[x_column], df[y_column])
                plt.xlabel(x_column)
                plt.ylabel(y_column)
                plt.title(title)
                plt.grid(True)
            
            elif function_name == 'scatter_plot':
                x_column = parameters.get('x_column', '')
                y_column = parameters.get('y_column', '')
                title = parameters.get('title', 'Scatter Plot')
                
                if not x_column or x_column not in df.columns:
                    raise ValueError(f"X column '{x_column}' not found. Available: {list(df.columns)}")
                if not y_column or y_column not in df.columns:
                    raise ValueError(f"Y column '{y_column}' not found. Available: {list(df.columns)}")
                
                plt.scatter(df[x_column], df[y_column])
                plt.xlabel(x_column)
                plt.ylabel(y_column)
                plt.title(title)
                plt.grid(True)
            
            elif function_name == 'histogram':
                column = parameters.get('column', '')
                bins = parameters.get('bins', 30)
                
                if not column or column not in df.columns:
                    raise ValueError(f"Column '{column}' not found. Available: {list(df.columns)}")
                
                plt.hist(df[column], bins=bins)
                plt.xlabel(column)
                plt.ylabel('Frequency')
                plt.title(f'Histogram of {column}')
                plt.grid(True)
            
            else:
                raise ValueError(f"Plot function '{function_name}' is not supported")
            
            # Convert plot to base64 string
            buffer = io.BytesIO()
            plt.savefig(buffer, format='png', dpi=150, bbox_inches='tight')
            buffer.seek(0)
            plot_data = base64.b64encode(buffer.getvalue()).decode()
            plt.close()
            
            plot_info = {
                "plot_type": function_name,
                "image_base64": plot_data,
                "parameters": parameters
            }
            
            return plot_info, "plot", False
        
        except Exception as e:
            plt.close()  # Ensure plot is closed even on error
            return None, "error", False