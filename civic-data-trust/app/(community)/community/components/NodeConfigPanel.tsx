import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, ChevronDown, ChevronRight, Info, Plus, Trash2, GripVertical, Play, Image } from 'lucide-react';
import { updateNode } from '@/app/store/workflowSlice';
import { RootState } from '@/app/store';
import { toast } from 'react-hot-toast';
import axios from 'axios';

// Function to execute the function chain via API
const executeFunctionChain = async (nodeId: string, library: string | null, functionChain: any[], dispatch: any, currentNode: any, setPlotData: (data: any) => void) => {
  try {
    toast.loading('Executing function chain...');
    
    // Determine input data based on node type and available CSV data
    let input_data: any = {
      dataset_name: "sample_employees"  // Default fallback
    };
    
    // Check for CSV content in current node or any connected nodes
    if (currentNode?.parameters?.csvContent) {
      input_data = {
        csv_content: currentNode.parameters.csvContent,
        filename: currentNode.parameters.fileName || 'uploaded.csv'
      };
    } else if (currentNode?.type === 'csv_input' && currentNode?.parameters?.csvContent) {
      input_data = {
        csv_content: currentNode.parameters.csvContent,
        filename: currentNode.parameters.fileName || 'uploaded.csv'
      };
    } else {
      // Try to find CSV data from the global state or recent uploads
      // For now, we'll check if there's any uploaded CSV data available
      const uploadedData = localStorage.getItem('lastUploadedCSV');
      if (uploadedData) {
        try {
          const parsedData = JSON.parse(uploadedData);
          input_data = {
            csv_content: parsedData.content,
            filename: parsedData.filename || 'uploaded.csv'
          };
        } catch (e) {
          console.warn('Failed to parse stored CSV data:', e);
        }
      }
    }
    
    const response = await axios.post('http://localhost:8000/api/v1/eda-execute/', {
      node_id: nodeId,
      workflow_type: library === 'pandas' ? 'basic_eda' : 
                     library === 'numpy' ? 'custom' : 
                     library === 'matplotlib' ? 'visualization_suite' : 'custom',
      function_chain: functionChain.map(step => ({
        id: step.id,
        functionName: step.functionName,
        category: step.category,
        library: library,
        parameters: step.parameters,
        description: step.description || ''
      })),
      input_data: {
        csv_content: typeof input_data === 'string' ? input_data : 
                     input_data?.csv_content || JSON.stringify(input_data),
        filename: input_data?.filename || 'data.csv'
      },
      generate_download_link: false,
      colab_optimized: false
    });
    
    toast.dismiss();
    
    if (response.data && response.data.success) {
      toast.success('Function chain executed successfully');
      
      // Update the node with execution results
      dispatch(updateNode({
        id: nodeId,
        updates: { 
          parameters: {
            ...functionChain[0].parameters,
            executionResults: response.data.results,
            lastExecuted: new Date().toISOString()
          }
        }
      }));
      
      // Check for plot results and store them
      const plotResults = response.data.results.filter((result: any) => result.output_type === 'plot' && result.success);
      if (plotResults.length > 0) {
        setPlotData(plotResults);
      }
      
      return response.data;
    } else {
      toast.error('Error executing function chain');
      console.error('API error:', response.data);
      return null;
    }
  } catch (error) {
    toast.dismiss();
    toast.error('Failed to execute function chain');
    console.error('Execution error:', error);
    return null;
  }
};

interface NodeConfigPanelProps {
  nodeId: string;
  onClose: () => void;
}

interface FunctionStep {
  id: string;
  functionName: string;
  category: string;
  parameters: Record<string, any>;
  description: string;
}

interface EDAFunctionChains {
  pandas: FunctionStep[];
  numpy: FunctionStep[];
  matplotlib: FunctionStep[];
  [key: string]: FunctionStep[];
}

// Type definitions for library functions
interface FunctionParameter {
  name: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  default?: any;
  description: string;
  options?: any[];
}

interface FunctionDefinition {
  description: string;
  params: FunctionParameter[];
  returnsData: boolean;
}

interface CategoryFunctions {
  [functionName: string]: FunctionDefinition;
}

interface LibraryCategories {
  [categoryName: string]: CategoryFunctions;
}

interface LibraryFunctions {
  [libraryName: string]: LibraryCategories;
}

// Library function definitions with proper typing - moved outside component for better performance
const LIBRARY_FUNCTIONS: LibraryFunctions = {
  pandas: {
    'Data Inspection': {
      'head': {
        description: 'Return the first n rows',
        params: [
          { name: 'n', type: 'number', default: 5, description: 'Number of rows to return' }
        ],
        returnsData: true
      },
      'tail': {
        description: 'Return the last n rows',
        params: [
          { name: 'n', type: 'number', default: 5, description: 'Number of rows to return' }
        ],
        returnsData: true
      },
      'info': {
        description: 'Get concise summary of DataFrame',
        params: [],
        returnsData: false
      },
      'describe': {
        description: 'Generate descriptive statistics',
        params: [
          { name: 'include', type: 'select', options: ['all', 'number', 'object'], default: 'all', description: 'Data types to include' }
        ],
        returnsData: true
      },
      'shape': {
        description: 'Return tuple of dimensions',
        params: [],
        returnsData: false
      }
    },
    'Data Cleaning': {
      'dropna': {
        description: 'Remove missing values',
        params: [
          { name: 'axis', type: 'select', options: [0, 1], default: 0, description: 'Drop rows (0) or columns (1)' },
          { name: 'how', type: 'select', options: ['any', 'all'], default: 'any', description: 'Drop if any or all values are NA' }
        ],
        returnsData: true
      },
      'fillna': {
        description: 'Fill missing values',
        params: [
          { name: 'value', type: 'text', default: '', description: 'Value to use for filling' },
          { name: 'method', type: 'select', options: ['none', 'ffill', 'bfill'], default: 'none', description: 'Fill method' }
        ],
        returnsData: true
      },
      'drop_duplicates': {
        description: 'Remove duplicate rows',
        params: [
          { name: 'keep', type: 'select', options: ['first', 'last', 'false'], default: 'first', description: 'Which duplicates to keep' }
        ],
        returnsData: true
      }
    },
    'Data Manipulation': {
      'groupby': {
        description: 'Group data by one or more columns',
        params: [
          { name: 'by', type: 'text', default: '', description: 'Column name(s) to group by' },
          { name: 'agg_func', type: 'select', options: ['sum', 'mean', 'count', 'min', 'max'], default: 'sum', description: 'Aggregation function' }
        ],
        returnsData: true
      },
      'sort_values': {
        description: 'Sort by values',
        params: [
          { name: 'by', type: 'text', default: '', description: 'Column name to sort by' },
          { name: 'ascending', type: 'boolean', default: true, description: 'Sort ascending' }
        ],
        returnsData: true
      },
      'merge': {
        description: 'Merge with another DataFrame',
        params: [
          { name: 'on', type: 'text', default: '', description: 'Column to merge on' },
          { name: 'how', type: 'select', options: ['inner', 'outer', 'left', 'right'], default: 'inner', description: 'Type of merge' }
        ],
        returnsData: true
      },
      'pivot_table': {
        description: 'Create pivot table',
        params: [
          { name: 'values', type: 'text', default: '', description: 'Column to aggregate' },
          { name: 'index', type: 'text', default: '', description: 'Row grouper' },
          { name: 'columns', type: 'text', default: '', description: 'Column grouper' },
          { name: 'aggfunc', type: 'select', options: ['mean', 'sum', 'count'], default: 'mean', description: 'Aggregation function' }
        ],
        returnsData: true
      }
    },
    'Data Selection': {
      'filter_rows': {
        description: 'Filter rows based on condition',
        params: [
          { name: 'column', type: 'text', default: '', description: 'Column name' },
          { name: 'operator', type: 'select', options: ['>', '<', '>=', '<=', '==', '!='], default: '>', description: 'Comparison operator' },
          { name: 'value', type: 'text', default: '', description: 'Value to compare against' }
        ],
        returnsData: true
      },
      'select_columns': {
        description: 'Select specific columns',
        params: [
          { name: 'columns', type: 'text', default: '', description: 'Comma-separated column names' }
        ],
        returnsData: true
      }
    }
  },
  numpy: {
    'Array Operations': {
      'reshape': {
        description: 'Change array shape',
        params: [
          { name: 'shape', type: 'text', default: '', description: 'New shape as tuple (e.g., -1,1)' }
        ],
        returnsData: true
      },
      'transpose': {
        description: 'Transpose array',
        params: [],
        returnsData: true
      },
      'flatten': {
        description: 'Flatten array to 1D',
        params: [],
        returnsData: true
      }
    },
    'Mathematical Operations': {
      'sum': {
        description: 'Sum of array elements',
        params: [
          { name: 'axis', type: 'select', options: ['None', '0', '1'], default: 'None', description: 'Axis along which to sum' }
        ],
        returnsData: true
      },
      'mean': {
        description: 'Arithmetic mean',
        params: [
          { name: 'axis', type: 'select', options: ['None', '0', '1'], default: 'None', description: 'Axis along which to compute mean' }
        ],
        returnsData: true
      },
      'std': {
        description: 'Standard deviation',
        params: [
          { name: 'axis', type: 'select', options: ['None', '0', '1'], default: 'None', description: 'Axis along which to compute std' }
        ],
        returnsData: true
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
          { name: 'title', type: 'text', default: '', description: 'Plot title' }
        ],
        returnsData: false
      },
      'scatter_plot': {
        description: 'Create scatter plot',
        params: [
          { name: 'x_column', type: 'text', default: '', description: 'X-axis column name' },
          { name: 'y_column', type: 'text', default: '', description: 'Y-axis column name' },
          { name: 'title', type: 'text', default: '', description: 'Plot title' }
        ],
        returnsData: false
      },
      'histogram': {
        description: 'Create histogram',
        params: [
          { name: 'column', type: 'text', default: '', description: 'Column name for histogram' },
          { name: 'bins', type: 'number', default: 30, description: 'Number of bins' },
          { name: 'color', type: 'text', default: 'skyblue', description: 'Histogram color' }
        ],
        returnsData: false
      },
      'bar_plot': {
        description: 'Create bar plot',
        params: [
          { name: 'x_column', type: 'text', default: '', description: 'X-axis column name' },
          { name: 'y_column', type: 'text', default: '', description: 'Y-axis column name' },
          { name: 'title', type: 'text', default: 'Bar Plot', description: 'Plot title' },
          { name: 'color', type: 'text', default: 'steelblue', description: 'Bar color' }
        ],
        returnsData: false
      }
    },
    'Statistical Plots': {
      'box_plot': {
        description: 'Create box plot for distribution analysis',
        params: [
          { name: 'columns', type: 'text', default: '', description: 'Comma-separated numeric column names' },
          { name: 'title', type: 'text', default: 'Box Plot', description: 'Plot title' }
        ],
        returnsData: false
      },
      'violin_plot': {
        description: 'Create violin plot for distribution visualization',
        params: [
          { name: 'y_column', type: 'text', default: '', description: 'Y-axis column name' },
          { name: 'x_column', type: 'text', default: '', description: 'X-axis grouping column (optional)' },
          { name: 'title', type: 'text', default: 'Violin Plot', description: 'Plot title' }
        ],
        returnsData: false
      },
      'heatmap': {
        description: 'Create correlation heatmap',
        params: [
          { name: 'title', type: 'text', default: 'Correlation Heatmap', description: 'Plot title' },
          { name: 'colormap', type: 'select', options: ['coolwarm', 'viridis', 'plasma', 'RdYlBu'], default: 'coolwarm', description: 'Color scheme' }
        ],
        returnsData: false
      },
      'pair_plot': {
        description: 'Create pairwise relationship plots',
        params: [
          { name: 'title', type: 'text', default: 'Pair Plot', description: 'Plot title' },
          { name: 'hue_column', type: 'text', default: '', description: 'Column for color grouping (optional)' }
        ],
        returnsData: false
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder={param.description}
        />
      );
  }
};

// Memoized Function Step Component
const FunctionStepComponent: React.FC<{
  step: FunctionStep;
  stepIndex: number;
  library: string;
  onUpdateStep: (stepIndex: number, updatedStep: FunctionStep) => void;
  onRemoveStep: (stepIndex: number) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveStep: (stepIndex: number, direction: 'up' | 'down') => void;
}> = React.memo(({ step, stepIndex, library, onUpdateStep, onRemoveStep, canMoveUp, canMoveDown, onMoveStep }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const libraryConfig = LIBRARY_FUNCTIONS[library];
  const categoryConfig = libraryConfig?.[step.category];
  const functionDef = categoryConfig?.[step.functionName];
  
  const handleParameterChange = (paramName: string, value: any) => {
    const updatedStep = {
      ...step,
      parameters: {
        ...step.parameters,
        [paramName]: value
      }
    };
    onUpdateStep(stepIndex, updatedStep);
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      {/* Step Header */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => canMoveUp && onMoveStep(stepIndex, 'up')}
              disabled={!canMoveUp}
              className={`p-1 rounded ${canMoveUp ? 'hover:bg-gray-200 text-gray-600' : 'text-gray-300'}`}
            >
              ▲
            </button>
            <button
              onClick={() => canMoveDown && onMoveStep(stepIndex, 'down')}
              disabled={!canMoveDown}
              className={`p-1 rounded ${canMoveDown ? 'hover:bg-gray-200 text-gray-600' : 'text-gray-300'}`}
            >
              ▼
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
              Step {stepIndex + 1}
            </span>
            <span className="font-medium text-gray-900">{step.functionName}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onRemoveStep(stepIndex)}
            className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Step Content */}
      {isExpanded && (
        <div className="p-3 space-y-3">
          <p className="text-sm text-gray-600">{step.description}</p>
          
          {functionDef && functionDef.params.length > 0 && (
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-gray-700">Parameters:</h5>
              {functionDef.params.map((param) => (
                <div key={param.name}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {param.name}
                    {param.description && (
                       <span className="text-gray-500 font-normal ml-1">- {param.description}</span>
                     )}
                   </label>
                  <DynamicFormField
                    param={param}
                    value={step.parameters[param.name]}
                    onChange={(value) => handleParameterChange(param.name, value)}
                  />
                </div>
              ))}
            </div>
          )}
          
          {(!functionDef || functionDef.params.length === 0) && (
            <p className="text-xs text-gray-500 italic">No parameters required</p>
          )}
        </div>
      )}
    </div>
  );
});

export default function NodeConfigPanel({ nodeId, onClose }: NodeConfigPanelProps) {
  const dispatch = useDispatch();
  const node = useSelector((state: RootState) => 
    state.workflow.nodes.find(n => n.id === nodeId)
  );
  
  const [parameters, setParameters] = useState(node?.parameters || {});
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [functionChain, setFunctionChain] = useState<FunctionStep[]>([]);
  const [showAddFunction, setShowAddFunction] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);
  const [plotData, setPlotData] = useState<any>(null);
  
  useEffect(() => {
    setParameters(node?.parameters || {});
    // Always use function chain mode
    if (node?.parameters?.functionChain) {
      setFunctionChain(node.parameters.functionChain || []);
    } else if (node?.parameters?.selectedFunction) {
      // Convert single function to chain format for backward compatibility
      const singleStep: FunctionStep = {
        id: `step-${Date.now()}`,
        functionName: node.parameters.selectedFunction,
        category: node.parameters.selectedCategory || '',
        parameters: node.parameters.functionParams || {},
        description: 'Single function step'
      };
      setFunctionChain([singleStep]);
    }
  }, [node]);
  
  const handleParameterChange = useCallback((key: string, value: any) => {
    const newParameters = { ...parameters, [key]: value };
    setParameters(newParameters);
    dispatch(updateNode({
      id: nodeId,
      updates: { parameters: newParameters }
    }));
  }, [parameters, nodeId, dispatch]);

  // Chain mode is now always enabled - no toggle needed

  const addFunctionToChain = useCallback((functionName: string, category: string, library: string) => {
    const libraryConfig = LIBRARY_FUNCTIONS[library];
    const categoryConfig = libraryConfig?.[category];
    const functionDef = categoryConfig?.[functionName];
    
    const newStep: FunctionStep = {
      id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      functionName,
      category,
      parameters: {},
      description: functionDef?.description || ''
    };
    
    const updatedChain = [...functionChain, newStep];
    setFunctionChain(updatedChain);
    
    const newParameters = {
      ...parameters,
      functionChain: updatedChain
    };
    setParameters(newParameters);
    dispatch(updateNode({
      id: nodeId,
      updates: { parameters: newParameters }
    }));
    
    setShowAddFunction(false);
  }, [functionChain, parameters, nodeId, dispatch]);

  const updateFunctionStep = useCallback((stepIndex: number, updatedStep: FunctionStep) => {
    const updatedChain = [...functionChain];
    updatedChain[stepIndex] = updatedStep;
    setFunctionChain(updatedChain);
    
    const newParameters = {
      ...parameters,
      functionChain: updatedChain
    };
    setParameters(newParameters);
    dispatch(updateNode({
      id: nodeId,
      updates: { parameters: newParameters }
    }));
  }, [functionChain, parameters, nodeId, dispatch]);

  const removeFunctionStep = (stepIndex: number) => {
    const updatedChain = functionChain.filter((_, index) => index !== stepIndex);
    setFunctionChain(updatedChain);
    
    const newParameters = {
      ...parameters,
      functionChain: updatedChain
    };
    setParameters(newParameters);
    dispatch(updateNode({
      id: nodeId,
      updates: { parameters: newParameters }
    }));
  };

  const moveFunctionStep = (stepIndex: number, direction: 'up' | 'down') => {
    const updatedChain = [...functionChain];
    const newIndex = direction === 'up' ? stepIndex - 1 : stepIndex + 1;
    
    if (newIndex >= 0 && newIndex < updatedChain.length) {
      [updatedChain[stepIndex], updatedChain[newIndex]] = [updatedChain[newIndex], updatedChain[stepIndex]];
      setFunctionChain(updatedChain);
      
      const newParameters = {
        ...parameters,
        functionChain: updatedChain
      };
      setParameters(newParameters);
      dispatch(updateNode({
        id: nodeId,
        updates: { parameters: newParameters }
      }));
    }
  };

  const toggleCategory = (categoryKey: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  if (!node) return null;

  const isDataScienceNode = ['pandas', 'numpy', 'matplotlib'].includes(node.type);
  const isEDAProcessor = node.type === 'eda_processor';
  const currentLibrary = isDataScienceNode ? node.type : null;
  const currentFunctions = currentLibrary ? LIBRARY_FUNCTIONS[currentLibrary] : null;
  
  // EDA Processor state
  const [activeTab, setActiveTab] = useState<string>('workflow');
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('basic_eda');
  const [edaFunctionChains, setEdaFunctionChains] = useState<EDAFunctionChains>({
    pandas: [],
    numpy: [],
    matplotlib: []
  });
  const [generateDownloadLink, setGenerateDownloadLink] = useState<boolean>(true);
  const [colabOptimized, setColabOptimized] = useState<boolean>(true);

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
        {/* Execute Function Chain Button */}
        {isDataScienceNode && functionChain.length > 0 && (
          <div className="mb-4 space-y-2">
            <button
              onClick={() => executeFunctionChain(nodeId, currentLibrary, functionChain, dispatch, node, setPlotData)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Play className="w-4 h-4" />
              Execute Function Chain
            </button>
            
            {/* Visualization Button for Matplotlib */}
            {currentLibrary === 'matplotlib' && plotData && plotData.length > 0 && (
              <button
                onClick={() => setShowVisualization(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Image className="w-4 h-4" />
                View Visualizations ({plotData.length})
              </button>
            )}
          </div>
        )}
        
        {/* Data Science Library Configuration */}
        {isDataScienceNode && currentLibrary && currentFunctions && (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <h3 className="font-medium text-blue-900 mb-2">
                {currentLibrary.charAt(0).toUpperCase() + currentLibrary.slice(1)} Functions
              </h3>
              
              <p className="text-sm text-blue-600">
                Chain multiple functions to execute sequentially
              </p>
            </div>

            {/* Function Chain Interface */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Function Chain ({functionChain.length} steps)</h4>
                  <button
                    onClick={() => setShowAddFunction(true)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Function
                  </button>
                </div>

                {/* Function Steps */}
                <div className="space-y-2">
                  {functionChain.map((step, index) => (
                    <FunctionStepComponent
                      key={step.id}
                      step={step}
                      stepIndex={index}
                      library={currentLibrary}
                      onUpdateStep={updateFunctionStep}
                      onRemoveStep={removeFunctionStep}
                      canMoveUp={index > 0}
                      canMoveDown={index < functionChain.length - 1}
                      onMoveStep={moveFunctionStep}
                    />
                  ))}
                  
                  {functionChain.length === 0 && (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                      <Play className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No functions in chain</p>
                      <p className="text-xs">Click "Add Function" to get started</p>
                    </div>
                  )}
                </div>

                {/* Execution Preview */}
                {functionChain.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Execution Order:</h5>
                    <div className="text-xs text-gray-600 font-mono">
                      data → {functionChain.map(step => step.functionName).join(' → ')} → result
                    </div>
                  </div>
                )}
              </div>

            {/* Add Function Modal/Dropdown */}
            {showAddFunction && (
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Add Function to Chain</h4>
                  <button
                    onClick={() => setShowAddFunction(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {Object.entries(currentFunctions).map(([categoryName, functions]) => (
                    <div key={categoryName} className="border border-gray-200 rounded">
                      <button
                        onClick={() => toggleCategory(categoryName)}
                        className="w-full flex items-center justify-between p-2 hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-sm text-gray-900">{categoryName}</span>
                        {expandedCategories[categoryName] ? 
                          <ChevronDown className="w-4 h-4 text-gray-500" /> : 
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        }
                      </button>
                      
                      {expandedCategories[categoryName] && (
                        <div className="border-t border-gray-200 p-1">
                          {Object.entries(functions).map(([functionName, functionDef]) => (
                            <button
                              key={functionName}
                              onClick={() => addFunctionToChain(functionName, categoryName, currentLibrary)}
                              className="w-full text-left p-2 rounded hover:bg-blue-50 transition-colors"
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
              </div>
            )}
          </div>
        )}

        {/* EDA Processor Configuration */}
        {isEDAProcessor && (
          <div className="space-y-4">
            <div className="bg-purple-50 rounded-lg p-3">
              <h3 className="font-medium text-purple-900 mb-2">
                EDA Processor - Unified Data Analysis
              </h3>
              <p className="text-sm text-purple-600">
                Execute pandas, numpy, and matplotlib functions in a unified workflow
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'workflow', label: 'Workflow', icon: '🔄' },
                  { id: 'pandas', label: 'Pandas', icon: '🐼' },
                  { id: 'numpy', label: 'NumPy', icon: '🔢' },
                  { id: 'matplotlib', label: 'Matplotlib', icon: '📊' },
                  { id: 'settings', label: 'Settings', icon: '⚙️' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-1">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Workflow Tab */}
            {activeTab === 'workflow' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select EDA Workflow
                  </label>
                  <select
                    value={selectedWorkflow}
                    onChange={(e) => setSelectedWorkflow(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="basic_eda">Basic EDA - Essential data exploration</option>
                    <option value="data_cleaning">Data Cleaning - Clean and prepare data</option>
                    <option value="visualization_suite">Visualization Suite - Comprehensive charts</option>
                    <option value="custom">Custom Chain - Build your own workflow</option>
                  </select>
                </div>

                {/* Workflow Description */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {selectedWorkflow === 'basic_eda' && 'Basic EDA Workflow'}
                    {selectedWorkflow === 'data_cleaning' && 'Data Cleaning Workflow'}
                    {selectedWorkflow === 'visualization_suite' && 'Visualization Suite Workflow'}
                    {selectedWorkflow === 'custom' && 'Custom Workflow'}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {selectedWorkflow === 'basic_eda' && 'Performs essential exploratory data analysis: head() → info() → describe() → correlation heatmap'}
                    {selectedWorkflow === 'data_cleaning' && 'Cleans and prepares data: dropna() → drop_duplicates() → statistical summary'}
                    {selectedWorkflow === 'visualization_suite' && 'Creates comprehensive visualizations: histogram → box plots → scatter plots → correlation matrix'}
                    {selectedWorkflow === 'custom' && 'Build a custom function chain across pandas, numpy, and matplotlib libraries'}
                  </p>
                  
                  {selectedWorkflow !== 'custom' && (
                    <div className="text-xs text-gray-500">
                      <strong>Functions:</strong> 
                      {selectedWorkflow === 'basic_eda' && 'head, info, describe, heatmap'}
                      {selectedWorkflow === 'data_cleaning' && 'dropna, drop_duplicates, describe'}
                      {selectedWorkflow === 'visualization_suite' && 'histogram, box_plot, scatter_plot, heatmap'}
                    </div>
                  )}
                </div>

                {/* Execute Button */}
                <button
                  onClick={() => {
                    // Execute EDA workflow
                    toast.success(`Executing ${selectedWorkflow} workflow...`);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Execute EDA Workflow
                </button>
              </div>
            )}

            {/* Library-specific tabs */}
            {['pandas', 'numpy', 'matplotlib'].includes(activeTab) && (
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <h4 className="font-medium text-blue-900 mb-2">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Functions
                  </h4>
                  <p className="text-sm text-blue-600">
                    Add {activeTab} functions to the unified EDA chain
                  </p>
                </div>

                {/* Function Chain for this library */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-gray-900">
                      {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Chain ({edaFunctionChains[activeTab].length} functions)
                    </h5>
                    <button
                      onClick={() => {
                       // Add function logic
                       toast.success(`Add ${activeTab} function`);
                     }}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                    >
                      <Plus className="w-3 h-3" />
                      Add Function
                    </button>
                  </div>

                  {edaFunctionChains[activeTab].length === 0 ? (
                    <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                      <div className="text-2xl mb-2">
                        {activeTab === 'pandas' && '🐼'}
                        {activeTab === 'numpy' && '🔢'}
                        {activeTab === 'matplotlib' && '📊'}
                      </div>
                      <p className="text-sm">No {activeTab} functions added</p>
                      <p className="text-xs">Click "Add Function" to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {edaFunctionChains[activeTab].map((func, index) => (
                        <div key={index} className="bg-white border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-sm">{func.functionName}</div>
                              <div className="text-xs text-gray-500">{func.description}</div>
                            </div>
                            <button
                              onClick={() => {
                                // Remove function
                                  const newChain = [...edaFunctionChains[activeTab]];
                                  newChain.splice(index, 1);
                                  setEdaFunctionChains(prev => ({
                                    ...prev,
                                    [activeTab]: newChain
                                  }));
                              }}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Available Functions */}
                <div className="border border-gray-200 rounded-lg p-3">
                  <h5 className="font-medium text-gray-900 mb-2">Available {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Functions</h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {LIBRARY_FUNCTIONS[activeTab] && Object.entries(LIBRARY_FUNCTIONS[activeTab]).map(([categoryName, categoryFunctions]) => (
                      <div key={categoryName}>
                        <div className="font-medium text-xs text-gray-600 mb-1">{categoryName}</div>
                        <div className="grid grid-cols-1 gap-1">
                          {Object.entries(categoryFunctions).map(([functionName, functionDef]) => (
                            <button
                              key={functionName}
                              onClick={() => {
                                // Add function to chain
                                const newFunction: FunctionStep = {
                                   id: `${activeTab}-${Date.now()}`,
                                   functionName,
                                   category: categoryName,
                                   parameters: {},
                                   description: functionDef.description
                                 };
                                 setEdaFunctionChains(prev => ({
                                    ...prev,
                                    [activeTab]: [...prev[activeTab], newFunction]
                                  }));
                                toast.success(`Added ${functionName} to ${activeTab} chain`);
                              }}
                              className="text-left p-2 text-xs rounded hover:bg-gray-50 border border-gray-100"
                            >
                              <div className="font-medium">{functionName}</div>
                              <div className="text-gray-500">{functionDef.description}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900 mb-2">EDA Execution Settings</h4>
                  <p className="text-sm text-gray-600">Configure output and integration options</p>
                </div>

                {/* Download Link Generation */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium text-sm text-gray-700">Generate Download Link</label>
                    <p className="text-xs text-gray-500">Create public Cloudflare tunnel for results</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={generateDownloadLink}
                    onChange={(e) => setGenerateDownloadLink(e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </div>

                {/* Google Colab Optimization */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium text-sm text-gray-700">Google Colab Optimized</label>
                    <p className="text-xs text-gray-500">Include wget commands and Colab notebook</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={colabOptimized}
                    onChange={(e) => setColabOptimized(e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </div>

                {/* Execution Options */}
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-900">Execution Options</h5>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium text-sm text-gray-700">Continue on Error</label>
                      <p className="text-xs text-gray-500">Continue execution if a function fails</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium text-sm text-gray-700">Track Progress</label>
                      <p className="text-xs text-gray-500">Show real-time execution progress</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Execution Summary */}
                <div className="bg-purple-50 rounded-lg p-3">
                  <h5 className="font-medium text-purple-900 mb-2">Execution Summary</h5>
                  <div className="text-sm text-purple-700 space-y-1">
                    <div>Pandas functions: {edaFunctionChains.pandas.length}</div>
                    <div>NumPy functions: {edaFunctionChains.numpy.length}</div>
                    <div>Matplotlib functions: {edaFunctionChains.matplotlib.length}</div>
                    <div className="font-medium pt-1 border-t border-purple-200">
                      Total functions: {edaFunctionChains.pandas.length + edaFunctionChains.numpy.length + edaFunctionChains.matplotlib.length}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Rest of the original configuration sections remain the same... */}
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

        {/* Chain Summary for Data Science Nodes */}
        {isDataScienceNode && functionChain.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Chain Configuration Summary</h3>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm space-y-2">
                <div className="font-medium text-gray-900 mb-2">
                  Chain: {functionChain.length} function{functionChain.length !== 1 ? 's' : ''}
                </div>
                {functionChain.map((step, index) => (
                  <div key={step.id} className="text-xs text-gray-600 ml-2">
                    <div className="font-medium">
                      {index + 1}. {currentLibrary}.{step.functionName}()
                    </div>
                    {Object.keys(step.parameters).length > 0 && (
                      <div className="ml-4 text-gray-500">
                        {Object.entries(step.parameters).map(([key, value]) => (
                          <div key={key}>
                            {key}: {JSON.stringify(value)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Execution Results Display */}
        {parameters.executionResults && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Execution Results</h3>
            <div className="bg-gray-50 rounded-lg p-3 max-h-64 overflow-y-auto">
              <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                {typeof parameters.executionResults === 'string'
                  ? parameters.executionResults
                  : JSON.stringify(parameters.executionResults, null, 2)}
              </pre>
            </div>
            {parameters.lastExecuted && (
              <div className="text-xs text-gray-500 mt-2">
                Last executed: {new Date(parameters.lastExecuted).toLocaleString()}
              </div>
            )}
          </div>
        )}

        {/* Performance & Compatibility Warnings */}
        {isDataScienceNode && functionChain.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Chain Analysis</h3>
            <div className="space-y-2">
              {/* Performance Warning */}
              {functionChain.length > 5 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Performance Notice</span>
                  </div>
                  <p className="text-xs text-yellow-700 mt-1">
                    Chain has {functionChain.length} functions. Consider breaking into smaller chains for better performance.
                  </p>
                </div>
              )}
              
              {/* Data Flow Validation */}
              {currentLibrary && functionChain.some((step, index) => {
                if (index === 0) return false;
                const libraryConfig = LIBRARY_FUNCTIONS[currentLibrary];
                const currentCategoryConfig = libraryConfig?.[step.category];
                const currentFunc = currentCategoryConfig?.[step.functionName];
                const prevCategoryConfig = libraryConfig?.[functionChain[index-1].category];
                const prevFunc = prevCategoryConfig?.[functionChain[index-1].functionName];
                return prevFunc && !prevFunc.returnsData && currentFunc;
              }) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Data Flow Warning</span>
                  </div>
                  <p className="text-xs text-red-700 mt-1">
                    Some functions in the chain don't return data for the next step. Review the execution order.
                  </p>
                </div>
              )}
              
              {/* Success Indicator */}
              {functionChain.length > 0 && functionChain.length <= 5 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Chain Ready</span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    Function chain is properly configured and ready for execution.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Plot Visualization Modal */}
      {showVisualization && plotData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full mx-4 flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Matplotlib Visualizations</h3>
              <button
                onClick={() => setShowVisualization(false)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-6">
                {plotData.map((plot: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {plot.function_name} - {plot.result.plot_type}
                      </h4>
                      <div className="text-sm text-gray-600">
                        Parameters: {JSON.stringify(plot.result.parameters)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Execution time: {plot.execution_time_ms.toFixed(2)}ms
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-2 flex justify-center">
                      <img
                        src={`data:image/png;base64,${plot.result.image_base64}`}
                        alt={`${plot.function_name} visualization`}
                        className="max-w-full h-auto rounded shadow-sm"
                        style={{ maxHeight: '400px' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Total visualizations: {plotData.length}</span>
                <button
                  onClick={() => setShowVisualization(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}