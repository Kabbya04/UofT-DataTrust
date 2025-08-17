import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, ChevronDown, ChevronRight, Info } from 'lucide-react';
import { updateNode } from '@/app/store/workflowSlice';
import { RootState } from '@/app/store';

interface NodeConfigPanelProps {
  nodeId: string;
  onClose: () => void;
}

// Library function definitions
const libraryFunctions = {
  pandas: {
    'Data Inspection': {
      'head': {
        description: 'Return the first n rows',
        params: [
          { name: 'n', type: 'number', default: 5, description: 'Number of rows to return' }
        ]
      },
      'tail': {
        description: 'Return the last n rows',
        params: [
          { name: 'n', type: 'number', default: 5, description: 'Number of rows to return' }
        ]
      },
      'info': {
        description: 'Get concise summary of DataFrame',
        params: []
      },
      'describe': {
        description: 'Generate descriptive statistics',
        params: [
          { name: 'include', type: 'select', options: ['all', 'number', 'object'], default: 'all', description: 'Data types to include' }
        ]
      },
      'shape': {
        description: 'Return tuple of dimensions',
        params: []
      }
    },
    'Data Cleaning': {
      'dropna': {
        description: 'Remove missing values',
        params: [
          { name: 'axis', type: 'select', options: [0, 1], default: 0, description: 'Drop rows (0) or columns (1)' },
          { name: 'how', type: 'select', options: ['any', 'all'], default: 'any', description: 'Drop if any or all values are NA' }
        ]
      },
      'fillna': {
        description: 'Fill missing values',
        params: [
          { name: 'value', type: 'text', default: '', description: 'Value to use for filling' },
          { name: 'method', type: 'select', options: ['none', 'ffill', 'bfill'], default: 'none', description: 'Fill method' }
        ]
      },
      'drop_duplicates': {
        description: 'Remove duplicate rows',
        params: [
          { name: 'keep', type: 'select', options: ['first', 'last', 'false'], default: 'first', description: 'Which duplicates to keep' }
        ]
      }
    },
    'Data Manipulation': {
      'groupby': {
        description: 'Group data by one or more columns',
        params: [
          { name: 'by', type: 'text', default: '', description: 'Column name(s) to group by' },
          { name: 'agg_func', type: 'select', options: ['sum', 'mean', 'count', 'min', 'max'], default: 'sum', description: 'Aggregation function' }
        ]
      },
      'sort_values': {
        description: 'Sort by values',
        params: [
          { name: 'by', type: 'text', default: '', description: 'Column name to sort by' },
          { name: 'ascending', type: 'boolean', default: true, description: 'Sort ascending' }
        ]
      },
      'merge': {
        description: 'Merge with another DataFrame',
        params: [
          { name: 'on', type: 'text', default: '', description: 'Column to merge on' },
          { name: 'how', type: 'select', options: ['inner', 'outer', 'left', 'right'], default: 'inner', description: 'Type of merge' }
        ]
      },
      'pivot_table': {
        description: 'Create pivot table',
        params: [
          { name: 'values', type: 'text', default: '', description: 'Column to aggregate' },
          { name: 'index', type: 'text', default: '', description: 'Row grouper' },
          { name: 'columns', type: 'text', default: '', description: 'Column grouper' },
          { name: 'aggfunc', type: 'select', options: ['mean', 'sum', 'count'], default: 'mean', description: 'Aggregation function' }
        ]
      }
    },
    'Data Selection': {
      'filter_rows': {
        description: 'Filter rows based on condition',
        params: [
          { name: 'column', type: 'text', default: '', description: 'Column name' },
          { name: 'operator', type: 'select', options: ['>', '<', '>=', '<=', '==', '!='], default: '>', description: 'Comparison operator' },
          { name: 'value', type: 'text', default: '', description: 'Value to compare against' }
        ]
      },
      'select_columns': {
        description: 'Select specific columns',
        params: [
          { name: 'columns', type: 'text', default: '', description: 'Comma-separated column names' }
        ]
      }
    }
  },
  numpy: {
    'Array Operations': {
      'reshape': {
        description: 'Change array shape',
        params: [
          { name: 'shape', type: 'text', default: '', description: 'New shape as tuple (e.g., -1,1)' }
        ]
      },
      'transpose': {
        description: 'Transpose array',
        params: []
      },
      'flatten': {
        description: 'Flatten array to 1D',
        params: []
      }
    },
    'Mathematical Operations': {
      'sum': {
        description: 'Sum of array elements',
        params: [
          { name: 'axis', type: 'select', options: ['None', '0', '1'], default: 'None', description: 'Axis along which to sum' }
        ]
      },
      'mean': {
        description: 'Arithmetic mean',
        params: [
          { name: 'axis', type: 'select', options: ['None', '0', '1'], default: 'None', description: 'Axis along which to compute mean' }
        ]
      },
      'std': {
        description: 'Standard deviation',
        params: [
          { name: 'axis', type: 'select', options: ['None', '0', '1'], default: 'None', description: 'Axis along which to compute std' }
        ]
      },
      'min': {
        description: 'Minimum value',
        params: [
          { name: 'axis', type: 'select', options: ['None', '0', '1'], default: 'None', description: 'Axis along which to find minimum' }
        ]
      },
      'max': {
        description: 'Maximum value',
        params: [
          { name: 'axis', type: 'select', options: ['None', '0', '1'], default: 'None', description: 'Axis along which to find maximum' }
        ]
      }
    },
    'Array Creation': {
      'zeros': {
        description: 'Create array of zeros',
        params: [
          { name: 'shape', type: 'text', default: '', description: 'Shape as tuple (e.g., 10, 5)' }
        ]
      },
      'ones': {
        description: 'Create array of ones',
        params: [
          { name: 'shape', type: 'text', default: '', description: 'Shape as tuple (e.g., 10, 5)' }
        ]
      },
      'arange': {
        description: 'Create array with evenly spaced values',
        params: [
          { name: 'start', type: 'number', default: 0, description: 'Start value' },
          { name: 'stop', type: 'number', default: 10, description: 'Stop value' },
          { name: 'step', type: 'number', default: 1, description: 'Step size' }
        ]
      }
    },
    'Linear Algebra': {
      'dot': {
        description: 'Dot product of arrays',
        params: []
      },
      'linalg_norm': {
        description: 'Matrix or vector norm',
        params: [
          { name: 'ord', type: 'select', options: ['None', '1', '2', 'inf'], default: 'None', description: 'Order of norm' }
        ]
      }
    }
  },
  matplotlib: {
    'Basic Plots': {
      'line_plot': {
        description: 'Create line plot',
        params: [
          { name: 'x_column', type: 'text', default: '', description: 'X-axis column name' },
          { name: 'y_column', type: 'text', default: '', description: 'Y-axis column name' },
          { name: 'title', type: 'text', default: '', description: 'Plot title' },
          { name: 'xlabel', type: 'text', default: '', description: 'X-axis label' },
          { name: 'ylabel', type: 'text', default: '', description: 'Y-axis label' }
        ]
      },
      'scatter_plot': {
        description: 'Create scatter plot',
        params: [
          { name: 'x_column', type: 'text', default: '', description: 'X-axis column name' },
          { name: 'y_column', type: 'text', default: '', description: 'Y-axis column name' },
          { name: 'title', type: 'text', default: '', description: 'Plot title' },
          { name: 'color', type: 'text', default: 'blue', description: 'Point color' }
        ]
      },
      'bar_plot': {
        description: 'Create bar plot',
        params: [
          { name: 'x_column', type: 'text', default: '', description: 'X-axis column name' },
          { name: 'y_column', type: 'text', default: '', description: 'Y-axis column name' },
          { name: 'title', type: 'text', default: '', description: 'Plot title' },
          { name: 'color', type: 'text', default: 'blue', description: 'Bar color' }
        ]
      },
      'histogram': {
        description: 'Create histogram',
        params: [
          { name: 'column', type: 'text', default: '', description: 'Column name for histogram' },
          { name: 'bins', type: 'number', default: 30, description: 'Number of bins' },
          { name: 'title', type: 'text', default: '', description: 'Plot title' }
        ]
      }
    },
    'Statistical Plots': {
      'box_plot': {
        description: 'Create box plot',
        params: [
          { name: 'column', type: 'text', default: '', description: 'Column name for box plot' },
          { name: 'title', type: 'text', default: '', description: 'Plot title' }
        ]
      },
      'heatmap': {
        description: 'Create correlation heatmap',
        params: [
          { name: 'columns', type: 'text', default: '', description: 'Columns for correlation (comma-separated)' },
          { name: 'title', type: 'text', default: 'Correlation Heatmap', description: 'Plot title' }
        ]
      }
    },
    'Customization': {
      'set_style': {
        description: 'Set plot style',
        params: [
          { name: 'style', type: 'select', options: ['default', 'ggplot', 'seaborn', 'classic'], default: 'default', description: 'Plot style' },
          { name: 'figsize', type: 'text', default: '10,6', description: 'Figure size (width,height)' }
        ]
      }
    }
  }
};

// Component for rendering dynamic form fields
const DynamicFormField: React.FC<{
  param: any;
  value: any;
  onChange: (value: any) => void;
}> = ({ param, value, onChange }) => {
  switch (param.type) {
    case 'number':
      return (
        <input
          type="number"
          value={value || param.default || ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || param.default)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder={param.description}
        />
      );
    
    case 'boolean':
      return (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={value !== undefined ? value : param.default}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">{param.description}</span>
        </label>
      );
    
    case 'select':
      return (
        <select
          value={value || param.default || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {param.options.map((option: any) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    
    default: // text
      return (
        <input
          type="text"
          value={value || param.default || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder={param.description}
        />
      );
  }
};

export default function NodeConfigPanel({ nodeId, onClose }: NodeConfigPanelProps) {
  const dispatch = useDispatch();
  const node = useSelector((state: RootState) => 
    state.workflow.nodes.find(n => n.id === nodeId)
  );
  
  const [parameters, setParameters] = useState(node?.parameters || {});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [selectedFunction, setSelectedFunction] = useState<string>('');
  
  useEffect(() => {
    setParameters(node?.parameters || {});
    if (node?.parameters?.selectedFunction) {
      setSelectedFunction(node.parameters.selectedFunction);
    }
  }, [node]);
  
  const handleParameterChange = (key: string, value: any) => {
    const newParameters = { ...parameters, [key]: value };
    setParameters(newParameters);
    dispatch(updateNode({
      id: nodeId,
      updates: { parameters: newParameters }
    }));
  };

  const handleFunctionSelect = (functionKey: string, category: string, library: string) => {
    const newParameters = {
      ...parameters,
      selectedFunction: functionKey,
      selectedCategory: category,
      selectedLibrary: library,
      functionParams: {}
    };
    setParameters(newParameters);
    setSelectedFunction(functionKey);
    dispatch(updateNode({
      id: nodeId,
      updates: { parameters: newParameters }
    }));
  };

  const handleFunctionParamChange = (paramName: string, value: any) => {
    const newFunctionParams = {
      ...parameters.functionParams,
      [paramName]: value
    };
    const newParameters = {
      ...parameters,
      functionParams: newFunctionParams
    };
    setParameters(newParameters);
    dispatch(updateNode({
      id: nodeId,
      updates: { parameters: newParameters }
    }));
  };

  const toggleCategory = (categoryKey: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  if (!node) return null;

  const isDataScienceNode = ['pandas', 'numpy', 'matplotlib'].includes(node.type);
  const currentLibrary = isDataScienceNode ? node.type : null;
  const currentFunctions = currentLibrary ? libraryFunctions[currentLibrary as keyof typeof libraryFunctions] : null;

  // Get selected function details
  const selectedFunctionDetails = selectedFunction && currentFunctions ? 
    Object.values(currentFunctions).find((category: any) => 
      Object.keys(category).includes(selectedFunction)
    )?.[selectedFunction] : null;

  return (
    <div className="absolute top-0 right-0 w-96 h-full bg-white shadow-xl z-50 flex flex-col">
      <div className="p-4 border-b flex items-center justify-between bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">{node.name} Configuration</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Data Science Library Configuration */}
        {isDataScienceNode && currentLibrary && currentFunctions && (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <h3 className="font-medium text-blue-900 mb-1">
                {currentLibrary.charAt(0).toUpperCase() + currentLibrary.slice(1)} Functions
              </h3>
              <p className="text-sm text-blue-700">
                Select a function to configure for this {currentLibrary} node
              </p>
            </div>

            {/* Function Categories */}
            <div className="space-y-2">
              {Object.entries(currentFunctions).map(([categoryName, functions]) => (
                <div key={categoryName} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleCategory(categoryName)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{categoryName}</span>
                    {expandedCategories[categoryName] ? 
                      <ChevronDown className="w-4 h-4 text-gray-500" /> : 
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    }
                  </button>
                  
                  {expandedCategories[categoryName] && (
                    <div className="border-t border-gray-200 p-2">
                      {Object.entries(functions as any).map(([functionName, functionDef]: [string, any]) => (
                        <button
                          key={functionName}
                          onClick={() => handleFunctionSelect(functionName, categoryName, currentLibrary)}
                          className={`w-full text-left p-2 rounded hover:bg-blue-50 transition-colors mb-1 ${
                            selectedFunction === functionName ? 'bg-blue-100 border border-blue-300' : ''
                          }`}
                        >
                          <div className="font-medium text-sm text-gray-900">{functionName}</div>
                          <div className="text-xs text-gray-600">{functionDef.description}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Selected Function Parameters */}
            {selectedFunction && selectedFunctionDetails && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="font-medium text-gray-900">{selectedFunction} Parameters</h4>
                  <Info className="w-4 h-4 text-gray-500" />
                </div>
                
                <div className="space-y-3">
                  {selectedFunctionDetails.params.map((param: any) => (
                    <div key={param.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {param.name}
                        {param.description && (
                          <span className="text-gray-500 font-normal ml-1">- {param.description}</span>
                        )}
                      </label>
                      <DynamicFormField
                        param={param}
                        value={parameters.functionParams?.[param.name]}
                        onChange={(value) => handleFunctionParamChange(param.name, value)}
                      />
                    </div>
                  ))}
                  
                  {selectedFunctionDetails.params.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No parameters required for this function</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Original configuration sections for other node types */}
        {/* HTTP Request Node */}
        {node.type === 'http_request' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input
                type="text"
                value={parameters.url || ''}
                onChange={(e) => handleParameterChange('url', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://api.example.com/endpoint"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
              <select
                value={parameters.method || 'GET'}
                onChange={(e) => handleParameterChange('method', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Headers (JSON)</label>
              <textarea
                value={parameters.headers || '{}'}
                onChange={(e) => handleParameterChange('headers', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24 font-mono text-sm focus:ring-2 focus:ring-blue-500"
                placeholder='{"Content-Type": "application/json"}'
              />
            </div>
            
            {(parameters.method === 'POST' || parameters.method === 'PUT' || parameters.method === 'PATCH') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body (JSON)</label>
                <textarea
                  value={parameters.body || '{}'}
                  onChange={(e) => handleParameterChange('body', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32 font-mono text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder='{"key": "value"}'
                />
              </div>
            )}
          </>
        )}
        
        {/* Conditional Node */}
        {node.type === 'if_condition' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition Type</label>
              <select
                value={parameters.conditionType || 'equals'}
                onChange={(e) => handleParameterChange('conditionType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="equals">Equals</option>
                <option value="notEquals">Not Equals</option>
                <option value="contains">Contains</option>
                <option value="notContains">Not Contains</option>
                <option value="greaterThan">Greater Than</option>
                <option value="lessThan">Less Than</option>
                <option value="isEmpty">Is Empty</option>
                <option value="isNotEmpty">Is Not Empty</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Field to Check</label>
              <input
                type="text"
                value={parameters.field || ''}
                onChange={(e) => handleParameterChange('field', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="data.status"
              />
            </div>
            
            {!['isEmpty', 'isNotEmpty'].includes(parameters.conditionType) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                <input
                  type="text"
                  value={parameters.value || ''}
                  onChange={(e) => handleParameterChange('value', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="success"
                />
              </div>
            )}
          </>
        )}
        
        {/* JSON Transform Node */}
        {node.type === 'json_transform' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transform Expression</label>
              <textarea
                value={parameters.expression || ''}
                onChange={(e) => handleParameterChange('expression', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32 font-mono text-sm focus:ring-2 focus:ring-blue-500"
                placeholder={`{
  "output": "{{input.data}}",
  "timestamp": "{{$now}}",
  "processed": true
}`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Output Format</label>
              <select
                value={parameters.outputFormat || 'json'}
                onChange={(e) => handleParameterChange('outputFormat', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="json">JSON</option>
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
                <option value="array">Array</option>
              </select>
            </div>
          </>
        )}
        
        {/* AI Model Nodes */}
        {(['claude', 'gpt4', 'gemini', 'mistral', 'llama'].includes(node.type)) && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">System Prompt</label>
              <textarea
                value={parameters.systemPrompt || ''}
                onChange={(e) => handleParameterChange('systemPrompt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-blue-500"
                placeholder="You are a helpful assistant..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User Prompt Template</label>
              <textarea
                value={parameters.userPrompt || ''}
                onChange={(e) => handleParameterChange('userPrompt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-blue-500"
                placeholder="Process this text: {{input.text}}"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temperature: {parameters.temperature || 0.7}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={parameters.temperature || 0.7}
                onChange={(e) => handleParameterChange('temperature', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
              <input
                type="number"
                value={parameters.maxTokens || 1000}
                onChange={(e) => handleParameterChange('maxTokens', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="1"
                max="4000"
              />
            </div>
          </>
        )}
        
        {/* Filter Node */}
        {node.type === 'filter' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter Expression</label>
              <textarea
                value={parameters.filterExpression || ''}
                onChange={(e) => handleParameterChange('filterExpression', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24 font-mono text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="item.status === 'active' && item.value > 100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter Mode</label>
              <select
                value={parameters.filterMode || 'include'}
                onChange={(e) => handleParameterChange('filterMode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="include">Include Matching</option>
                <option value="exclude">Exclude Matching</option>
              </select>
            </div>
          </>
        )}
        
        {/* Merge Node */}
        {node.type === 'merge_data' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Merge Strategy</label>
              <select
                value={parameters.mergeStrategy || 'append'}
                onChange={(e) => handleParameterChange('mergeStrategy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="append">Append</option>
                <option value="combine">Combine by Key</option>
                <option value="merge">Deep Merge</option>
                <option value="overwrite">Overwrite</option>
              </select>
            </div>
            
            {parameters.mergeStrategy === 'combine' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Merge Key</label>
                <input
                  type="text"
                  value={parameters.mergeKey || ''}
                  onChange={(e) => handleParameterChange('mergeKey', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="id"
                />
              </div>
            )}
          </>
        )}
        
        {/* Common settings for all nodes */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Common Settings</h3>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Node Name</label>
            <input
              type="text"
              value={node.name}
              onChange={(e) => dispatch(updateNode({
                id: nodeId,
                updates: { name: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={parameters.notes || ''}
              onChange={(e) => handleParameterChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg h-16 focus:ring-2 focus:ring-blue-500"
              placeholder="Add notes about this node..."
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="continueOnFail"
              checked={parameters.continueOnFail || false}
              onChange={(e) => handleParameterChange('continueOnFail', e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="continueOnFail" className="text-sm text-gray-700">
              Continue workflow on error
            </label>
          </div>
        </div>

        {/* Preview/Summary for Data Science Nodes */}
        {isDataScienceNode && selectedFunction && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Configuration Summary</h3>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm">
                <div className="font-medium text-gray-900 mb-1">
                  Function: {currentLibrary}.{selectedFunction}()
                </div>
                <div className="text-gray-600 mb-2">
                  {selectedFunctionDetails?.description}
                </div>
                {parameters.functionParams && Object.keys(parameters.functionParams).length > 0 && (
                  <div className="text-xs text-gray-500">
                    <div className="font-medium mb-1">Parameters:</div>
                    {Object.entries(parameters.functionParams).map(([key, value]) => (
                      <div key={key} className="ml-2">
                        {key}: {JSON.stringify(value)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}