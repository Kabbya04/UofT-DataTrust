'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateNodeParameters, updateNode } from '../../../../store/workflowSlice';
import { RootState } from '../../../../store';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Play } from 'lucide-react';

interface SplitConfigProps {
  nodeId: string;
  parameters: Record<string, any>;
}

const SplitConfig: React.FC<SplitConfigProps> = ({ nodeId, parameters }) => {
  const dispatch = useDispatch();
  const { connections, nodes } = useSelector((state: RootState) => state.workflow);
  
  const splitType = parameters?.splitType ?? 'rows';
  const rowCount = parameters?.rowCount ?? 10;
  const selectedColumns1 = parameters?.selectedColumns1 ?? [];
  const selectedColumns2 = parameters?.selectedColumns2 ?? [];

  // Find connected input node to get available columns
  const inputConnection = connections.find(
    conn => conn.targetNodeId === nodeId && conn.targetPortId === 'input'
  );
  
  const connectedNode = inputConnection 
    ? nodes.find(node => node.id === inputConnection.sourceNodeId)
    : null;
    
  const availableColumns = connectedNode?.data?.outputData?.columns || [];
  const [isExecuting, setIsExecuting] = useState(false);

  const handleParameterChange = (updates: Record<string, any>) => {
    dispatch(updateNodeParameters({
      id: nodeId,
      parameters: { ...parameters, ...updates }
    }));
  };

  const handleColumnToggle = (column: string, outputNumber: 1 | 2) => {
    const currentColumns = outputNumber === 1 ? selectedColumns1 : selectedColumns2;
    const otherColumns = outputNumber === 1 ? selectedColumns2 : selectedColumns1;
    const otherKey = outputNumber === 1 ? 'selectedColumns2' : 'selectedColumns1';
    
    let newColumns;
    if (currentColumns.includes(column)) {
      // Remove column from current output
      newColumns = currentColumns.filter((col: string) => col !== column);
    } else {
      // Add column to current output and remove from other output
      newColumns = [...currentColumns, column];
      const newOtherColumns = otherColumns.filter((col: string) => col !== column);
      handleParameterChange({ [otherKey]: newOtherColumns });
    }
    
    const key = outputNumber === 1 ? 'selectedColumns1' : 'selectedColumns2';
    handleParameterChange({ [key]: newColumns });
  };

  const executeSplit = async () => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    toast.loading('Executing split operation...');
    
    try {
      // Get input data from connected node or localStorage
      let inputData: any = {
        dataset_name: "sample_employees"
      };
      
      if (connectedNode?.parameters?.csvContent) {
        inputData = {
          csv_content: connectedNode.parameters.csvContent,
          filename: connectedNode.parameters.fileName || 'uploaded.csv'
        };
      } else {
        const uploadedData = localStorage.getItem('lastUploadedCSV');
        if (uploadedData) {
          try {
            const parsedData = JSON.parse(uploadedData);
            inputData = {
              csv_content: parsedData.content,
              filename: parsedData.filename || 'uploaded.csv'
            };
          } catch (e) {
            console.warn('Failed to parse stored CSV data:', e);
          }
        }
      }
      
      const requestData = {
        node_id: nodeId,
        node_type: 'split',
        parameters: {
          splitType,
          rowCount: splitType === 'rows' ? rowCount : undefined,
          selectedColumns1: splitType === 'columns' ? selectedColumns1 : undefined,
          selectedColumns2: splitType === 'columns' ? selectedColumns2 : undefined
        },
        input_data: inputData
      };
      
      const response = await axios.post('http://localhost:8000/api/v1/transform/split', requestData);
      
      if (response.data.success) {
        toast.dismiss();
        toast.success('Split operation completed successfully!');
        
        // Update node with execution results and output data
        dispatch(updateNode({
          id: nodeId,
          updates: {
            parameters: {
              ...parameters,
              executionResults: response.data,
              lastExecuted: new Date().toISOString(),
              outputData1: response.data.output_data,
              outputData2: response.data.output_data_2
            },
            data: {
              outputData1: response.data.output_data,
              outputData2: response.data.output_data_2,
              metadata: response.data.metadata
            }
          }
        }));
        
        // Update connected downstream nodes with split data
        const downstreamConnections = connections.filter(
          conn => conn.sourceNodeId === nodeId
        );
        
        downstreamConnections.forEach(conn => {
          const outputData = conn.sourcePortId === 'output1' 
            ? response.data.output_data 
            : response.data.output_data_2;
            
          if (outputData) {
            dispatch(updateNode({
              id: conn.targetNodeId,
              updates: {
                parameters: {
                  csvContent: outputData,
                  fileName: `split_${conn.sourcePortId}_${Date.now()}.csv`,
                  splitSource: nodeId,
                  splitPort: conn.sourcePortId
                }
              }
            }));
          }
        });
        
      } else {
        toast.dismiss();
        toast.error('Split operation failed: ' + (response.data.error || 'Unknown error'));
      }
    } catch (error: any) {
      toast.dismiss();
      toast.error('Failed to execute split: ' + (error.response?.data?.detail || error.message));
      console.error('Split execution error:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Split Type</h3>
        <select
          value={splitType}
          onChange={(e) => handleParameterChange({ splitType: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="rows">Split by Rows</option>
          <option value="columns">Split by Columns</option>
        </select>
      </div>

      {splitType === 'rows' && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Number of Rows for Output 1
          </label>
          <input
            type="number"
            value={rowCount}
            onChange={(e) => handleParameterChange({ rowCount: parseInt(e.target.value) || 0 })}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter number of rows"
          />
          <p className="text-xs text-gray-500">
            Remaining rows will go to Output 2
          </p>
        </div>
      )}

      {splitType === 'columns' && (
        <div className="space-y-4">
          {availableColumns.length > 0 ? (
            <>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Output 1 Columns</h4>
                <div className="max-h-32 overflow-y-auto space-y-1 border border-gray-200 rounded-md p-2">
                  {availableColumns.map((column: string) => (
                    <label key={`output1-${column}`} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedColumns1.includes(column)}
                        onChange={() => handleColumnToggle(column, 1)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{column}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Output 2 Columns</h4>
                <div className="max-h-32 overflow-y-auto space-y-1 border border-gray-200 rounded-md p-2">
                  {availableColumns.map((column: string) => (
                    <label key={`output2-${column}`} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedColumns2.includes(column)}
                        onChange={() => handleColumnToggle(column, 2)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{column}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-sm text-yellow-800">
                No columns available. Connect a CSV data source to see column options.
              </p>
            </div>
          )}
        </div>
      )}
      
      <div className="bg-gray-50 p-3 rounded-md">
        <h4 className="text-xs font-medium text-gray-600 mb-2">Split Configuration</h4>
        <p className="text-xs text-gray-500 leading-relaxed">
          {splitType === 'rows' 
            ? `First ${rowCount} rows will go to Output 1, remaining rows to Output 2.`
            : `Selected columns will be distributed between Output 1 (${selectedColumns1.length} columns) and Output 2 (${selectedColumns2.length} columns).`
          }
        </p>
      </div>
      
      {/* Execute Split Button */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={executeSplit}
          disabled={isExecuting || (splitType === 'columns' && selectedColumns1.length === 0 && selectedColumns2.length === 0)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Play className="w-4 h-4" />
          {isExecuting ? 'Executing Split...' : 'Execute Split'}
        </button>
        
        {parameters.lastExecuted && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Last executed: {new Date(parameters.lastExecuted).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default SplitConfig;