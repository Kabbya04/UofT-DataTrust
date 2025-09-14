import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store';

export default function WorkflowStats() {
  const { nodes, connections } = useSelector((state: RootState) => state.workflow);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="font-medium text-gray-900 mb-3">Workflow Info</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Nodes:</span>
          <span className="font-medium">{nodes.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Connections:</span>
          <span className="font-medium">{connections.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Status:</span>
          <span className="text-green-600 font-medium">Ready</span>
        </div>
      </div>
    </div>
  );
}