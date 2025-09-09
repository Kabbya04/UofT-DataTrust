import React, { useState } from 'react';
import { X, Download, Eye, FileText, BarChart3, Database, Clock, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

interface EDAResult {
  library: string;
  function_name: string;
  success: boolean;
  output: any;
  execution_time_ms: number;
  output_type: 'text' | 'plot' | 'data' | 'error';
  description?: string;
}

interface EDAResultsData {
  success: boolean;
  execution_id: string;
  node_id: string;
  workflow_type: string;
  steps_executed: number;
  total_steps: number;
  total_execution_time_ms: number;
  pandas_results: EDAResult[];
  numpy_results: EDAResult[];
  matplotlib_results: EDAResult[];
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
}

const EDAResultsModal: React.FC<EDAResultsModalProps> = ({ 
  isOpen, 
  onClose, 
  results, 
  onDownload 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'pandas' | 'numpy' | 'matplotlib' | 'download'>('overview');
  const [selectedResult, setSelectedResult] = useState<EDAResult | null>(null);

  if (!isOpen || !results) return null;

  const allResults = [
    ...(Array.isArray(results.pandas_results) ? results.pandas_results : []),
    ...(Array.isArray(results.numpy_results) ? results.numpy_results : []),
    ...(Array.isArray(results.matplotlib_results) ? results.matplotlib_results : [])
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
                <BarChart3 className="w-16 h-16 mx-auto text-purple-500 mb-2" />
                <p className="text-sm text-gray-600">Visualization generated</p>
                {selectedResult.output && (
                  <p className="text-xs text-gray-500 mt-1">{selectedResult.output}</p>
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
              <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                {typeof selectedResult.output === 'string' 
                  ? selectedResult.output 
                  : JSON.stringify(selectedResult.output, null, 2)}
              </pre>
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
              { id: 'pandas', label: `Pandas (${Array.isArray(results.pandas_results) ? results.pandas_results.length : 0})`, icon: '🐼' },
              { id: 'numpy', label: `NumPy (${Array.isArray(results.numpy_results) ? results.numpy_results.length : 0})`, icon: '🔢' },
              { id: 'matplotlib', label: `Matplotlib (${Array.isArray(results.matplotlib_results) ? results.matplotlib_results.length : 0})`, icon: '📈' },
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

              {activeTab === 'pandas' && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 mb-3">Pandas Operations</h4>
                  {(Array.isArray(results.pandas_results) ? results.pandas_results : []).map((result, index) => renderResultCard(result, index))}
                </div>
              )}

              {activeTab === 'numpy' && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 mb-3">NumPy Operations</h4>
                  {(Array.isArray(results.numpy_results) ? results.numpy_results : []).map((result, index) => renderResultCard(result, index))}
                </div>
              )}

              {activeTab === 'matplotlib' && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900 mb-3">Matplotlib Visualizations</h4>
                  {(Array.isArray(results.matplotlib_results) ? results.matplotlib_results : []).map((result, index) => renderResultCard(result, index))}
                </div>
              )}

              {activeTab === 'download' && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 mb-3">Download Options</h4>
                  
                  {results.download_url && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Download className="w-5 h-5 text-blue-500" />
                        <span className="font-medium text-blue-800">Processed Data Package</span>
                      </div>
                      <p className="text-sm text-blue-600 mb-3">Complete EDA results with data, visualizations, and metadata</p>
                      <button
                        onClick={onDownload}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download ZIP Package
                      </button>
                    </div>
                  )}

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