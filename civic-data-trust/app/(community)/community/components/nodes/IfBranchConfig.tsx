'use client';

import React from 'react';
import { useDispatch } from 'react-redux';
import { updateNodeParameters } from '../../../../store/workflowSlice';

interface IfBranchConfigProps {
  nodeId: string;
  parameters: Record<string, any>;
}

const IfBranchConfig: React.FC<IfBranchConfigProps> = ({ nodeId, parameters }) => {
  const dispatch = useDispatch();
  const currentCondition = parameters?.condition ?? 1;

  const handleConditionChange = (condition: number) => {
    dispatch(updateNodeParameters({
      id: nodeId,
      parameters: { condition }
    }));
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Condition Selection</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => handleConditionChange(0)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentCondition === 0
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Condition 0
          </button>
          <button
            onClick={() => handleConditionChange(1)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentCondition === 1
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Condition 1
          </button>
        </div>
      </div>
      
      <div className="bg-gray-50 p-3 rounded-md">
        <h4 className="text-xs font-medium text-gray-600 mb-2">Data Routing</h4>
        <p className="text-xs text-gray-500 leading-relaxed">
          {currentCondition === 0 
            ? "Input data will be routed to the False (0) output port. Use this for negative conditions or when the condition evaluates to false."
            : "Input data will be routed to the True (1) output port. Use this for positive conditions or when the condition evaluates to true."
          }
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Connect the appropriate output port to continue your workflow based on the selected condition.
        </p>
      </div>
    </div>
  );
};

export default IfBranchConfig;