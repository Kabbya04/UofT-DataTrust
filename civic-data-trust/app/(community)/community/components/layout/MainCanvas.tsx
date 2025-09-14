import React from 'react';
import dynamic from 'next/dynamic';
import { RefreshCw, FileText } from 'lucide-react';
import NotebookView from '../notebook/NotebookView';

// Dynamic import with SSR disabled for Konva components
const WorkflowCanvas = dynamic(
  () => import('../WorkflowCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading canvas...</div>
      </div>
    )
  }
);

interface MainCanvasProps {
  isDarkMode: boolean;
  isMounted: boolean;
  draggedNode: any;
  onNodeDrop: (e: React.DragEvent) => void;
  notebook: any; // Notebook state passed from parent
}

export default function MainCanvas({
  isDarkMode,
  isMounted,
  draggedNode,
  onNodeDrop,
  notebook
}: MainCanvasProps) {

  return (
    <div className="flex-1 p-6">
      <div className={`rounded-lg shadow-sm border h-full flex flex-col transition-colors duration-200 ${
        isDarkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}>
        {/* Header */}
        <CanvasHeader
          isDarkMode={isDarkMode}
          notebook={notebook}
        />

        {/* Main Content */}
        <div className="flex-1 relative">
          {notebook.isActive ? (
            <NotebookView
              loading={notebook.loading}
              url={notebook.url}
            />
          ) : (
            isMounted && (
              <WorkflowCanvas
                canvasNodes={[]}
                onDrop={onNodeDrop}
                draggedPlugin={draggedNode}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

// Canvas Header Component
interface CanvasHeaderProps {
  isDarkMode: boolean;
  notebook: any; // Using any for now, will be typed properly later
}

function CanvasHeader({ isDarkMode, notebook }: CanvasHeaderProps) {
  return (
    <div className={`p-4 border-b transition-colors duration-200 ${
      isDarkMode
        ? 'border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700'
        : 'border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold transition-colors duration-200 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {notebook.isActive ? 'Jupyter Notebook' : 'Workflow Canvas'}
          </h1>
          <p className={`text-lg mt-2 transition-colors duration-200 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {notebook.isActive
              ? 'Interactive notebook environment for data analysis'
              : 'Drag nodes from the library and connect them to create your workflow'
            }
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={notebook.toggleNotebook}
            className={`px-5 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium text-sm ${
              notebook.isActive
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm border border-gray-200'
            }`}
            title={notebook.isActive ? 'Switch to Canvas' : 'Open Notebook'}
          >
            <FileText className="w-4 h-4" />
            {notebook.isActive ? 'Canvas Mode' : 'Notebook Mode'}
          </button>
          <button
            onClick={() => window.location.reload()}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDarkMode
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300'
                : 'hover:bg-white text-gray-600 hover:text-gray-700'
            }`}
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}