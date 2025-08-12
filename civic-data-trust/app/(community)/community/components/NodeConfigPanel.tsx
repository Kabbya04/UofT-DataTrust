import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import { updateNode } from '@/app/store/workflowSlice';
import { RootState } from '@/app/store';

interface NodeConfigPanelProps {
  nodeId: string;
  onClose: () => void;
}

export default function NodeConfigPanel({ nodeId, onClose }: NodeConfigPanelProps) {
  const dispatch = useDispatch();
  const node = useSelector((state: RootState) => 
    state.workflow.nodes.find(n => n.id === nodeId)
  );
  
  const [parameters, setParameters] = useState(node?.parameters || {});
  
  useEffect(() => {
    setParameters(node?.parameters || {});
  }, [node]);
  
  const handleParameterChange = (key: string, value: any) => {
    const newParameters = { ...parameters, [key]: value };
    setParameters(newParameters);
    dispatch(updateNode({
      id: nodeId,
      updates: { parameters: newParameters }
    }));
  };
  
  if (!node) return null;
  
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
      </div>
    </div>
  );
}