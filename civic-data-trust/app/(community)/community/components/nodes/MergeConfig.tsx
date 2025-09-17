'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateNodeParameters, updateNode } from '../../../../store/workflowSlice';
import { RootState } from '../../../../store';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Play, AlertTriangle } from 'lucide-react';

interface MergeConfigProps {
  nodeId: string;
  parameters: Record<string, any>;
}

const MergeConfig: React.FC<MergeConfigProps> = ({ nodeId, parameters }) => {
  const dispatch = useDispatch();
  const { connections, nodes } = useSelector((state: RootState) => state.workflow);
  
  const mergeType = parameters?.mergeType ?? 'columns';
  const selectedColumns = parameters?.selectedColumns ?? { input1: [], input2: [] };

  // Find connected input nodes
  const input1Connection = connections.find(
    conn => conn.targetNodeId === nodeId && conn.targetPortId === 'input1'
  );
  const input2Connection = connections.find(
    conn => conn.targetNodeId === nodeId && conn.targetPortId === 'input2'
  );
  
  const connectedNode1 = input1Connection 
    ? nodes.find(node => node.id === input1Connection.sourceNodeId)
    : null;
  const connectedNode2 = input2Connection 
    ? nodes.find(node => node.id === input2Connection.sourceNodeId)
    : null;

  const [isExecuting, setIsExecuting] = useState(false);

  // Extract columns from connected CSV data
  const getAvailableColumns = (connectedNode: any) => {
    if (!connectedNode) return [];
    
    // First check if columns are stored in node data
    if (connectedNode?.data?.outputData?.columns) {
      return connectedNode.data.outputData.columns;
    }
    
    // Then check if we can extract from CSV content
    if (connectedNode?.parameters?.csvContent) {
      try {
        const csvContent = connectedNode.parameters.csvContent;
        const lines = csvContent.split('\n');
        if (lines.length > 0) {
          const headers = lines[0].split(',').map((header: string) => header.trim().replace(/"/g, ''));
          return headers.filter((header: string) => header.length > 0);
        }
      } catch (e) {
        console.warn('Failed to parse CSV headers:', e);
      }
    }
    
    return [];
  };
  
  const availableColumns1 = getAvailableColumns(connectedNode1);
  const availableColumns2 = getAvailableColumns(connectedNode2);

  const handleParameterChange = (updates: Record<string, any>) => {
    dispatch(updateNodeParameters({
      id: nodeId,
      parameters: { ...parameters, ...updates }
    }));
  };

  const handleColumnToggle = (column: string, inputNumber: 1 | 2) => {
    const inputKey = `input${inputNumber}` as 'input1' | 'input2';
    const currentColumns = selectedColumns[inputKey] || [];
    
    let newColumns;
    if (currentColumns.includes(column)) {
      // Remove column
      newColumns = currentColumns.filter((col: string) => col !== column);
    } else {
      // Add column
      newColumns = [...currentColumns, column];
    }
    
    handleParameterChange({ 
      selectedColumns: {
        ...selectedColumns,
        [inputKey]: newColumns
      }
    });
  };

  const executeMerge = async () => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    toast.loading('Executing merge operation...');
    
    try {
      // Get input data from connected nodes
      const getInputData = (connectedNode: any) => {
        if (connectedNode?.parameters?.csvContent) {
          return {
            csv_content: connectedNode.parameters.csvContent,
            filename: connectedNode.parameters.fileName || 'input.csv'
          };
        }
        return null;
      };
      
      const inputData1 = getInputData(connectedNode1);
      const inputData2 = getInputData(connectedNode2);
      
      if (!inputData1 || !inputData2) {
        throw new Error('Both inputs must be connected with valid CSV data');
      }
      
      const requestData = {
        node_id: nodeId,
        node_type: 'merge',
        parameters: {
          mergeType,
          selectedColumns: mergeType === 'columns' ? selectedColumns : undefined
        },
        input_data_1: inputData1,
        input_data_2: inputData2
      };
      
      const response = await axios.post('http://localhost:8000/api/v1/transform/merge', requestData);
      
      if (response.data.success) {
        toast.dismiss();
        toast.success('Merge operation completed successfully!');
        
        // Update node with execution results
        dispatch(updateNode({
          id: nodeId,
          updates: {
            parameters: {
              ...parameters,
              executionResults: response.data,
              lastExecuted: new Date().toISOString(),
              outputData: response.data.output_data
            },
            data: {
              outputData: response.data.output_data,
              metadata: response.data.metadata
            }
          }
        }));
        
        // Update connected downstream nodes with merged data
        const downstreamConnections = connections.filter(
          conn => conn.sourceNodeId === nodeId && conn.sourcePortId === 'output'
        );
        
        downstreamConnections.forEach(conn => {
          dispatch(updateNode({
            id: conn.targetNodeId,
            updates: {
              parameters: {
                csvContent: response.data.output_data,
                fileName: `merged_${Date.now()}.csv`,
                mergeSource: nodeId
              }
            }
          }));
        });
        
      } else {
        toast.dismiss();
        toast.error('Merge operation failed: ' + (response.data.error || 'Unknown error'));
      }
    } catch (error: any) {
      toast.dismiss();
      toast.error('Failed to execute merge: ' + (error.response?.data?.detail || error.message));
      console.error('Merge execution error:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const bothInputsConnected = connectedNode1 && connectedNode2;
  const hasColumnsSelected = mergeType === 'rows' || 
    (selectedColumns.input1?.length > 0 || selectedColumns.input2?.length > 0);

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Merge Type</h3>
        <select
          value={mergeType}
          onChange={(e) => handleParameterChange({ mergeType: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="columns">Merge by Columns</option>
          <option value="rows">Merge by Rows</option>
        </select>
      </div>

      {mergeType === 'columns' && (
        <div className="space-y-4">
          {/* Warning about row count matching */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-yellow-800 font-medium">Row Count Matching Required</p>
              <p className="text-xs text-yellow-700 mt-1">
                For column merge, both input datasets must have the same number of rows. 
                Mismatched row counts may result in data loss or errors.
              </p>
            </div>
          </div>

          {/* Input 1 Column Selection */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">
              Input 1 Columns {!connectedNode1 && <span className="text-red-500">(Not Connected)</span>}
            </h4>
            {availableColumns1.length > 0 ? (
              <div className="max-h-32 overflow-y-auto space-y-1 border border-gray-200 rounded-md p-2">
                {availableColumns1.map((column: string) => (
                  <label key={`input1-${column}`} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedColumns.input1?.includes(column) || false}
                      onChange={() => handleColumnToggle(column, 1)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">{column}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                <p className="text-sm text-gray-600">
                  {connectedNode1 ? 'No columns available from Input 1' : 'Connect Input 1 to see columns'}
                </p>
              </div>
            )}
          </div>
          
          {/* Input 2 Column Selection */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">
              Input 2 Columns {!connectedNode2 && <span className="text-red-500">(Not Connected)</span>}
            </h4>
            {availableColumns2.length > 0 ? (
              <div className="max-h-32 overflow-y-auto space-y-1 border border-gray-200 rounded-md p-2">
                {availableColumns2.map((column: string) => (
                  <label key={`input2-${column}`} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedColumns.input2?.includes(column) || false}
                      onChange={() => handleColumnToggle(column, 2)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-700">{column}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                <p className="text-sm text-gray-600">
                  {connectedNode2 ? 'No columns available from Input 2' : 'Connect Input 2 to see columns'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {mergeType === 'rows' && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm text-blue-800">
            Row merge will concatenate all rows from Input 1 followed by all rows from Input 2. 
            Both inputs should have the same column structure for best results.
          </p>
        </div>
      )}
      
      <div className="bg-gray-50 p-3 rounded-md">
        <h4 className="text-xs font-medium text-gray-600 mb-2">Merge Configuration</h4>
        <p className="text-xs text-gray-500 leading-relaxed">
          {mergeType === 'columns' 
            ? `Column merge: Input 1 (${selectedColumns.input1?.length || 0} columns) + Input 2 (${selectedColumns.input2?.length || 0} columns)`
            : 'Row merge: All rows from Input 1 followed by all rows from Input 2'
          }
        </p>
      </div>
      
      {/* Execute Merge Button */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={executeMerge}
          disabled={isExecuting || !bothInputsConnected || !hasColumnsSelected}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Play className="w-4 h-4" />
          {isExecuting ? 'Executing Merge...' : 'Execute Merge'}
        </button>
        
        {!bothInputsConnected && (
          <p className="text-xs text-red-500 mt-2 text-center">
            Both inputs must be connected to execute merge
          </p>
        )}
        
        {parameters.lastExecuted && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Last executed: {new Date(parameters.lastExecuted).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default MergeConfig;