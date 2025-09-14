import React from 'react';
import { Upload, Download, Trash2 } from 'lucide-react';
import { useWorkflow, useDataSources } from '../../hooks';

export default function WorkflowManagement() {
  const workflow = useWorkflow();
  const dataSources = useDataSources();

  const handleClearCanvas = () => {
    const success = workflow.clearWorkflow();
    if (success) {
      dataSources.clearDataSources();
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Management</h3>
      <div className="space-y-2">
        <button
          onClick={workflow.loadWorkflow}
          className="w-full px-4 py-3 text-sm font-medium bg-gray-50 text-gray-700 rounded-xl
               hover:bg-gray-100 hover:shadow-sm transition-all duration-200 flex items-center justify-center
                  gap-2 border border-gray-200"
        >
          <Upload className="w-4 h-4" />
          Import Workflow
        </button>
        <button
          onClick={workflow.saveWorkflow}
          className="w-full px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg
              hover:bg-gray-100 transition-colors flex items-center justify-center
                  gap-2"
        >
          <Download className="w-4 h-4" />
          Export Workflow
        </button>
        <button
          onClick={handleClearCanvas}
          className="w-full px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg
              hover:bg-red-100 transition-colors flex items-center justify-center
                  gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear Canvas
        </button>
      </div>
    </div>
  );
}