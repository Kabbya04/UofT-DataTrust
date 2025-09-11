import React, { useState } from 'react';
import { X, Download, Eye, FileText, BarChart3, Database, Clock, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import FileDownloadService from './FileDownloadService';
import { toast } from 'react-hot-toast';

interface EDAResult {
  library: string;
  function_name: string;
  success: boolean;
  result: any; // Main data field - contains the actual function result
  output?: any; // Legacy field for backward compatibility
  execution_time_ms: number;
  output_type: 'text' | 'plot' | 'data' | 'error' | 'info';
  description?: string;
  step_id?: string;
  error?: string;
}

// Update the interface to match the actual API response structure
interface LibraryResults {
  steps: EDAResult[];
  success_count?: number;
  error_count?: number;
  total_execution_time_ms?: number;
  visualizations?: any[];
  data_transformations?: any[];
  calculations?: any[];
}

interface EDAResultsData {
  success: boolean;
  execution_id: string;
  node_id: string;
  workflow_type: string;
  steps_executed: number;
  total_steps: number;
  total_execution_time_ms: number;
  pandas_results: LibraryResults;
  numpy_results: LibraryResults;
  matplotlib_results: LibraryResults;
  download_url?: string;
  wget_command?: string;
  colab_compatible: boolean;
  colab_instructions?: string;
  warnings?: string[];
  error?: string;
}

interface EDAResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: EDAResultsData | null;
  onDownload?: () => void;
  nodeId?: string;
}

const EDAResultsModal: React.FC<EDAResultsModalProps> = ({ 
  isOpen, 
  onClose, 
  results, 
  onDownload,
  nodeId 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'chronological' | 'pandas' | 'numpy' | 'matplotlib' | 'download'>('overview');
  const [selectedResult, setSelectedResult] = useState<EDAResult | null>(null);
  const [useSimpleDownload, setUseSimpleDownload] = useState(false);

  // Simple download handler using backend endpoint
  const handleSimpleDownload = async () => {
    if (!results?.execution_id) {
      toast.error('No execution ID available for download');
      return;
    }

    toast.loading('Starting download...');

    try {
      // Use the backend download endpoint with execution ID
      const downloadUrl = `http://localhost:8000/api/v1/eda-download/${results.execution_id}`;
      const params = new URLSearchParams({
        execution_id: results.execution_id,
        filename: `eda_results_${results.execution_id}.zip`,
        format: 'zip'
      });

      if (nodeId) {
        params.append('node_id', nodeId);
      }

      const fullUrl = `${downloadUrl}?${params.toString()}`;
      
      // Open in new tab - let browser handle the download
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
      
      toast.dismiss();
      toast.success('Download started! Check your downloads folder or new tab.');
      
    } catch (error) {
      console.error('Download failed:', error);
      toast.dismiss();
      toast.error('Download failed. Please try again or contact support.');
    }
  };

  if (!isOpen || !results) return null;

  // Fix the allResults computation (around line 52)
  const allResults = [
    ...(results.pandas_results?.steps || []),
    ...(results.numpy_results?.steps || []),
    ...(results.matplotlib_results?.steps || [])
  ];

  const successfulResults = allResults.filter(r => r.success);
  const failedResults = allResults.filter(r => !r.success);

  const renderResultCard = (result: EDAResult, index: number) => {
    const getIcon = () => {
      switch (result.library) {
        case 'pandas': return '🐼';
        case 'numpy': return '🔢';
        case 'matplotlib': return '📊';
        default: return '⚙️';
      }
    };

    const getStatusIcon = () => {
      return result.success ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <AlertCircle className="w-4 h-4 text-red-500" />
      );
    };

    return (
      <div 
        key={`${result.library}-${index}`}
        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
          result.success 
            ? 'border-green-200 bg-green-50 hover:bg-green-100' 
            : 'border-red-200 bg-red-50 hover:bg-red-100'
        }`}
        onClick={() => setSelectedResult(result)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getIcon()}</span>
            <span className="font-medium text-sm">{result.function_name}</span>
            {getStatusIcon()}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {result.execution_time_ms}ms
          </div>
        </div>
        
        {result.description && (
          <p className="text-xs text-gray-600 mb-2">{result.description}</p>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded ${
              result.output_type === 'plot' ? 'bg-purple-100 text-purple-700' :
              result.output_type === 'data' ? 'bg-blue-100 text-blue-700' :
              result.output_type === 'text' ? 'bg-gray-100 text-gray-700' :
              'bg-red-100 text-red-700'
            }`}>
              {result.output_type}
            </span>
            <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
              <Eye className="w-3 h-3" />
              View
            </button>
          </div>
          
          {/* Plot preview thumbnail */}
          {result.output_type === 'plot' && result.result?.image_base64 && (
            <div className="mt-2">
              <img
                src={`data:image/png;base64,${result.result.image_base64}`}
                alt={`${result.function_name} preview`}
                className="w-full h-16 object-cover rounded border opacity-75 hover:opacity-100 transition-opacity"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderResultDetail = () => {
    if (!selectedResult) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Select a result to view details</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b">
          <span className="text-2xl">
            {selectedResult.library === 'pandas' ? '🐼' : 
             selectedResult.library === 'numpy' ? '🔢' : 
             selectedResult.library === 'matplotlib' ? '📊' : '⚙️'}
          </span>
          <div>
            <h3 className="font-semibold">{selectedResult.function_name}</h3>
            <p className="text-sm text-gray-600">{selectedResult.library} • {selectedResult.execution_time_ms}ms</p>
          </div>
          <div className="ml-auto">
            {selectedResult.success ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium mb-2">Output:</h4>
          <div className="bg-white rounded border p-3 max-h-64 overflow-auto">
            {selectedResult.output_type === 'plot' ? (
              <div className="text-center">
                {selectedResult.result?.image_base64 ? (
                  <div className="space-y-3">
                    <img
                      src={`data:image/png;base64,${selectedResult.result.image_base64}`}
                      alt={`${selectedResult.function_name} visualization`}
                      className="max-w-full h-auto rounded shadow-sm mx-auto"
                      style={{ maxHeight: '400px' }}
                    />
                    <div className="text-xs text-gray-600 space-y-1">
                      <p><strong>Plot Type:</strong> {selectedResult.result.plot_type}</p>
                      <p><strong>Parameters:</strong> {JSON.stringify(selectedResult.result.parameters)}</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <BarChart3 className="w-16 h-16 mx-auto text-purple-500 mb-2" />
                    <p className="text-sm text-gray-600">Visualization generated</p>
                    {selectedResult.output && (
                      <p className="text-xs text-gray-500 mt-1">{selectedResult.output}</p>
                    )}
                  </div>
                )}
              </div>
            ) : selectedResult.output_type === 'data' ? (
              <div>
                <Database className="w-6 h-6 text-blue-500 mb-2" />
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                  {typeof selectedResult.output === 'string' 
                    ? selectedResult.output 
                    : JSON.stringify(selectedResult.output, null, 2)}
                </pre>
              </div>
            ) : (
              // Enhanced handling for pandas and other data results
              <div>
                {(() => {
                  // Prioritize 'result' field over 'output' field (backend uses 'result')
                  let displayData = selectedResult.result;
                  
                  // Fallback to output field for backward compatibility
                  if (!displayData && selectedResult.output) {
                    displayData = selectedResult.output;
                  }
                  
                  if (displayData) {
                    const library = selectedResult.library;
                    const functionName = selectedResult.function_name;
                    const outputType = selectedResult.output_type;
                    
                    // PANDAS FUNCTION HANDLERS
                    if (library === 'pandas') {
                      // Info function - special structured display
                      if ((functionName === 'info' || outputType === 'info') && displayData.info) {
                        return (
                          <div>
                            <Database className="w-6 h-6 text-blue-500 mb-2" />
                            <div className="space-y-3">
                              <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-1">DataFrame Info:</h5>
                                <pre className="text-xs text-gray-700 whitespace-pre-wrap bg-gray-50 p-2 rounded">
                                  {displayData.info}
                                </pre>
                              </div>
                              {displayData.shape && (
                                <div>
                                  <h5 className="text-sm font-medium text-gray-700 mb-1">Shape:</h5>
                                  <p className="text-sm text-gray-600">{displayData.shape[0]} rows × {displayData.shape[1]} columns</p>
                                </div>
                              )}
                              {displayData.columns && (
                                <div>
                                  <h5 className="text-sm font-medium text-gray-700 mb-1">Columns:</h5>
                                  <div className="flex flex-wrap gap-1">
                                    {displayData.columns.map((col: string, idx: number) => (
                                      <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        {col}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }
                      
                      // Describe function - statistical summary table
                      if (functionName === 'describe' && (Array.isArray(displayData) || typeof displayData === 'object')) {
                        const describeData = Array.isArray(displayData) ? displayData : [displayData];
                        if (describeData.length > 0 && typeof describeData[0] === 'object') {
                          return (
                            <div>
                              <Database className="w-6 h-6 text-blue-500 mb-2" />
                              <div className="space-y-2">
                                <h5 className="text-sm font-medium text-gray-700">Statistical Summary:</h5>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full text-xs border border-gray-200">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th className="px-2 py-1 text-left font-medium text-gray-700 border-b">Statistic</th>
                                        {Object.keys(describeData[0]).filter(key => key !== 'index').map((key) => (
                                          <th key={key} className="px-2 py-1 text-left font-medium text-gray-700 border-b">
                                            {key}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {describeData.map((row: any, idx: number) => (
                                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                          <td className="px-2 py-1 border-b font-medium text-gray-700">
                                            {row.index || `Row ${idx + 1}`}
                                          </td>
                                          {Object.entries(row).filter(([key]) => key !== 'index').map(([key, value]: [string, any], cellIdx: number) => (
                                            <td key={cellIdx} className="px-2 py-1 border-b text-gray-600">
                                              {typeof value === 'number' ? Number(value).toFixed(4) : String(value)}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      }
                      
                      // Head/Tail functions - data preview table
                      if (['head', 'tail'].includes(functionName) && Array.isArray(displayData) && displayData.length > 0 && typeof displayData[0] === 'object') {
                        return (
                          <div>
                            <Database className="w-6 h-6 text-blue-500 mb-2" />
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium text-gray-700">Data Preview ({displayData.length} rows):</h5>
                              <div className="overflow-x-auto">
                                <table className="min-w-full text-xs border border-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      {Object.keys(displayData[0]).map((key) => (
                                        <th key={key} className="px-2 py-1 text-left font-medium text-gray-700 border-b">
                                          {key}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {displayData.slice(0, 10).map((row: any, idx: number) => (
                                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        {Object.values(row).map((value: any, cellIdx: number) => (
                                          <td key={cellIdx} className="px-2 py-1 border-b text-gray-600">
                                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                                {displayData.length > 10 && (
                                  <p className="text-xs text-gray-500 mt-1">... and {displayData.length - 10} more rows</p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      }
                      
                      // Shape function - simple display
                      if (functionName === 'shape' && Array.isArray(displayData)) {
                        return (
                          <div>
                            <Database className="w-6 h-6 text-blue-500 mb-2" />
                            <div className="bg-blue-50 p-3 rounded">
                              <h5 className="text-sm font-medium text-gray-700 mb-1">DataFrame Shape:</h5>
                              <p className="text-lg font-semibold text-blue-700">
                                {displayData[0]} rows × {displayData[1]} columns
                              </p>
                            </div>
                          </div>
                        );
                      }
                      
                      // Groupby, pivot_table, and other aggregation results
                      if (['groupby', 'pivot_table', 'sort_values', 'drop_duplicates', 'dropna', 'fillna'].includes(functionName)) {
                        if (Array.isArray(displayData) && displayData.length > 0 && typeof displayData[0] === 'object') {
                          return (
                            <div>
                              <Database className="w-6 h-6 text-blue-500 mb-2" />
                              <div className="space-y-2">
                                <h5 className="text-sm font-medium text-gray-700">Result ({displayData.length} rows):</h5>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full text-xs border border-gray-200">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        {Object.keys(displayData[0]).map((key) => (
                                          <th key={key} className="px-2 py-1 text-left font-medium text-gray-700 border-b">
                                            {key}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {displayData.slice(0, 20).map((row: any, idx: number) => (
                                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                          {Object.values(row).map((value: any, cellIdx: number) => (
                                            <td key={cellIdx} className="px-2 py-1 border-b text-gray-600">
                                              {typeof value === 'number' ? Number(value).toFixed(2) : String(value)}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                  {displayData.length > 20 && (
                                    <p className="text-xs text-gray-500 mt-1">... and {displayData.length - 20} more rows</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        }
                      }
                    }
                    
                    // NUMPY FUNCTION HANDLERS
                    if (library === 'numpy') {
                      // Array operations that return arrays
                      if (['reshape', 'transpose', 'flatten'].includes(functionName)) {
                        if (Array.isArray(displayData)) {
                          return (
                            <div>
                              <Database className="w-6 h-6 text-green-500 mb-2" />
                              <div className="space-y-2">
                                <h5 className="text-sm font-medium text-gray-700">Array Result:</h5>
                                <div className="bg-green-50 p-3 rounded">
                                  <p className="text-xs text-gray-600 mb-2">Shape: {Array.isArray(displayData[0]) ? `${displayData.length} × ${displayData[0].length}` : displayData.length}</p>
                                  <div className="max-h-40 overflow-auto">
                                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                                      {Array.isArray(displayData[0]) 
                                        ? displayData.map(row => `[${row.join(', ')}]`).join('\n')
                                        : `[${displayData.join(', ')}]`}
                                    </pre>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      }
                      
                      // Mathematical operations that return single values or simple arrays
                      if (['sum', 'mean', 'std', 'min', 'max', 'var'].includes(functionName)) {
                        return (
                          <div>
                            <Database className="w-6 h-6 text-green-500 mb-2" />
                            <div className="bg-green-50 p-3 rounded">
                              <h5 className="text-sm font-medium text-gray-700 mb-1">Calculation Result:</h5>
                              <p className="text-lg font-semibold text-green-700">
                                {Array.isArray(displayData) 
                                  ? displayData.length === 1 
                                    ? displayData[0] 
                                    : `[${displayData.join(', ')}]`
                                  : displayData}
                              </p>
                            </div>
                          </div>
                        );
                      }
                    }
                    
                    // DEFAULT HANDLING for any other cases
                    return (
                      <div>
                        <Database className="w-6 h-6 text-blue-500 mb-2" />
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-gray-700">Output:</h5>
                          <pre className="text-xs text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded max-h-64 overflow-auto">
                            {typeof displayData === 'string' 
                              ? displayData 
                              : JSON.stringify(displayData, null, 2)}
                          </pre>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="text-center py-4">
                        <FileText className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">No output data available</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Function executed successfully but returned no displayable output
                        </p>
                      </div>
                    );
                  }
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">EDA Execution Results</h2>
            <p className="text-sm text-gray-600">
              {results.workflow_type} • {results.steps_executed}/{results.total_steps} steps • {results.total_execution_time_ms}ms
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'chronological', label: `Timeline (${allResults.length})`, icon: '⏱️' },
              { id: 'pandas', label: `Pandas (${results.pandas_results?.steps?.length || 0})`, icon: '🐼' },
              { id: 'numpy', label: `NumPy (${results.numpy_results?.steps?.length || 0})`, icon: '🔢' },
              { id: 'matplotlib', label: `Matplotlib (${results.matplotlib_results?.steps?.length || 0})`, icon: '📈' },
              { id: 'download', label: 'Download', icon: '💾' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Results List */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-green-800">Successful Operations</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{successfulResults.length}</p>
                  </div>
                  
                  {failedResults.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="font-medium text-red-800">Failed Operations</span>
                      </div>
                      <p className="text-2xl font-bold text-red-600">{failedResults.length}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">All Results</h4>
                    {allResults.map((result, index) => renderResultCard(result, index))}
                  </div>
                </div>
              )}

              {activeTab === 'chronological' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <h4 className="font-medium text-gray-900">Execution Timeline</h4>
                  </div>
                  
                  <div className="space-y-3">
                    {allResults.map((result, index) => (
                      <div key={`timeline-${result.library}-${index}`} className="relative">
                        {/* Timeline connector */}
                        {index < allResults.length - 1 && (
                          <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200"></div>
                        )}
                        
                        {/* Timeline item */}
                        <div className="flex gap-3">
                          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg ${
                            result.success ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {result.library === 'pandas' ? '🐼' : 
                             result.library === 'numpy' ? '🔢' : 
                             result.library === 'matplotlib' ? '📊' : '⚙️'}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            {renderResultCard(result, index)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {allResults.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No execution results to display</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'pandas' && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 mb-3">Pandas Operations</h4>
                  {(results.pandas_results?.steps || []).map((result, index) => renderResultCard(result, index))}
                </div>
              )}

              {activeTab === 'numpy' && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 mb-3">NumPy Operations</h4>
                  {(results.numpy_results?.steps || []).map((result, index) => renderResultCard(result, index))}
                </div>
              )}

              {activeTab === 'matplotlib' && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 mb-3">Matplotlib Visualizations</h4>
                  {(results.matplotlib_results?.steps || []).map((result, index) => renderResultCard(result, index))}
                </div>
              )}

              {activeTab === 'download' && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 mb-3">Download Options</h4>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Download className="w-5 h-5 text-blue-500" />
                      <span className="font-medium text-blue-800">Processed Data Package</span>
                    </div>
                    <p className="text-sm text-blue-600 mb-4">Complete EDA results with data, visualizations, and metadata</p>
                    
                    {!useSimpleDownload ? (
                      <>
                        <FileDownloadService
                          downloadUrl={results.download_url}
                          fileName={`eda_results_${results.execution_id || Date.now()}.zip`}
                          executionId={results.execution_id}
                          nodeId={nodeId}
                          onDownloadComplete={(success, filePath) => {
                            if (success) {
                              console.log('Download completed successfully:', filePath);
                            } else {
                              console.error('Download failed');
                              setUseSimpleDownload(true);
                            }
                          }}
                        />
                        
                        {/* Switch to simple download button */}
                        <div className="mt-3 pt-3 border-t border-blue-200">
                          <button
                            onClick={() => setUseSimpleDownload(true)}
                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                          >
                            Having issues? Try simple download instead
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Simple Download Interface */}
                        <div className="space-y-3">
                          <button
                            onClick={handleSimpleDownload}
                            disabled={!results.download_url}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                              results.download_url
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            <Download className="w-4 h-4" />
                            {results.download_url ? 'Download ZIP Package' : 'No Download URL Available'}
                          </button>
                          
                          <div className="flex justify-between items-center text-xs">
                            <button
                              onClick={() => setUseSimpleDownload(false)}
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              ← Back to advanced download
                            </button>
                            {results.download_url && (
                              <a
                                href={results.download_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline"
                              >
                                Open in new tab
                              </a>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {results.colab_compatible && results.wget_command && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ExternalLink className="w-5 h-5 text-purple-500" />
                        <span className="font-medium text-purple-800">Google Colab Integration</span>
                      </div>
                      <p className="text-sm text-purple-600 mb-3">Use this command in Google Colab to download the results:</p>
                      <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm overflow-x-auto">
                        {results.wget_command}
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(results.wget_command || '')}
                        className="mt-2 text-sm text-purple-600 hover:text-purple-800"
                      >
                        📋 Copy to clipboard
                      </button>
                    </div>
                  )}

                  {results.warnings && results.warnings.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                        <span className="font-medium text-yellow-800">Warnings</span>
                      </div>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        {results.warnings.map((warning, index) => (
                          <li key={index}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Result Details */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              {activeTab === 'download' ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <Download className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Download Your EDA Results</h3>
                    <p className="text-gray-600">Your processed data, visualizations, and analysis results are packaged and ready for download.</p>
                  </div>

                  {results.colab_instructions && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Google Colab Instructions:</h4>
                      <div className="text-sm text-gray-700 whitespace-pre-line">
                        {results.colab_instructions}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                renderResultDetail()
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EDAResultsModal;