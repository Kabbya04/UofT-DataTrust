'use client';

import React, { useState, useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import { store, RootState } from '../../store';
import { addNode } from '../../store/workflowSlice';
import PluginLibrary from './components/PluginLibrary';
import { Upload, Save, Download, Play, FileJson, RefreshCw, Trash2, Image, FileText, Database } from 'lucide-react';
import TemplatePanel from './components/TemplatePanel';
import TopNavigation from './components/TopNavigation';

// Import our extracted hooks and services
import { useNotebook, useWorkflow, useDataSources } from './hooks';
import type { TabType } from './types';
// Dynamic import with SSR disabled for Konva components
const WorkflowCanvas = dynamic(
  () => import('./components/WorkflowCanvas'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading canvas...</div>
      </div>
    )
  }
);

// Separate component to use Redux hooks
function WorkflowInfo() {
  const { nodes, connections } = useSelector((state: RootState) => state.workflow);
  
  return (
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
  );
}

function CommunityPageContent() {
  // UI state
  const [draggedNode, setDraggedNode] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Use our extracted hooks
  const notebook = useNotebook();
  const workflow = useWorkflow();
  const dataSources = useDataSources();

  // Ensure component is mounted before rendering canvas
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handlers now use our extracted hooks
  const handleImageSelect = dataSources.handleImageSelect;

  const handleNodeDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (!draggedNode) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const zoom = store.getState().workflow.zoom;
    const viewport = store.getState().workflow.viewport;
    
    const x = (e.clientX - rect.left - viewport.x) / zoom;
    const y = (e.clientY - rect.top - viewport.y) / zoom;
    
    const newNode = {
      id: `${draggedNode.id}-${Date.now()}`,
      type: draggedNode.id,
      name: draggedNode.name,
      x: x - 70,
      y: y - 40,
      width: 140,
      height: 80,
      color: draggedNode.color,
      inputs: (draggedNode.inputs || []).map((input: any) => ({
        ...input,
        connected: false
      })),
      outputs: (draggedNode.outputs || []).map((output: any) => ({
        ...output,
        connected: false
      })),
      parameters: {},
      data: {}
    };
    
    store.dispatch(addNode(newNode));
    setDraggedNode(null);
  };

  const handleSaveWorkflow = workflow.saveWorkflow;

  const handleLoadWorkflow = workflow.loadWorkflow;

  const handleClearCanvas = () => {
    const success = workflow.clearWorkflow();
    if (success) {
      dataSources.clearDataSources();
    }
  };

  const handleTestRun = workflow.testWorkflow;

  const handleAddJsonData = dataSources.handleJsonAdd;

  const handleAddCsvData = dataSources.handleCsvUpload;

  // Notebook functionality now handled by useNotebook hook
  const toggleNotebookMode = notebook.toggleNotebook;

  const handleToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Update the document class for global dark mode
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className={`flex flex-col h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Top Navigation */}
      <TopNavigation isDarkMode={isDarkMode} onToggleDarkMode={handleToggleDarkMode} />
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <div className={`w-80 border-r flex flex-col transition-colors duration-200 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
        {/* Header with Navigation Tabs */}
        <div className={`p-6 border-b transition-colors duration-200 ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-2xl font-bold mb-4 transition-colors duration-200 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Workflow Builder</h2>
          <input
            type="text"
            value={workflow.workflowName}
            onChange={(e) => workflow.setWorkflowName(e.target.value)}
            className={`w-full px-3 py-1 text-sm border rounded-lg mb-4 transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            placeholder="Enter workflow name..."
          />

          {/* Tab Navigation */}
          <div className={`flex gap-1 rounded-lg p-1 transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <button
              onClick={() => workflow.setActiveTab('data')}
              className={`flex-1 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${workflow.activeTab === 'data'
                  ? (isDarkMode ? 'bg-gray-600 text-blue-400 shadow-md border border-blue-500' : 'bg-white text-blue-700 shadow-md border border-blue-200')
                  : (isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-600' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50')
                }`}
            >
              Data Sources
            </button>
            <button
              onClick={() => workflow.setActiveTab('templates')}
              className={`flex-1 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${workflow.activeTab === 'templates'
                  ? (isDarkMode ? 'bg-gray-600 text-blue-400 shadow-md border border-blue-500' : 'bg-white text-blue-700 shadow-md border border-blue-200')
                  : (isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-600' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50')
                }`}
            >
              Templates
            </button>
            <button
              onClick={() => workflow.setActiveTab('info')}
              className={`flex-1 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${workflow.activeTab === 'info'
                  ? (isDarkMode ? 'bg-gray-600 text-blue-400 shadow-md border border-blue-500' : 'bg-white text-blue-700 shadow-md border border-blue-200')
                  : (isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-600' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50')
                }`}
            >
              Workflow
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {/* Data Sources Tab */}
          {workflow.activeTab === 'data' && (
            <div className={`border rounded-xl p-6 shadow-sm transition-colors duration-200 ${
              isDarkMode 
                ? 'border-gray-700 bg-gray-800' 
                : 'border-gray-200 bg-white'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold transition-colors duration-200 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Data Sources</h3>
                <Upload className={`w-5 h-5 transition-colors duration-200 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-400'
                }`} />
              </div>

              {/* Grid layout for data source cards */}
              <div className="grid grid-cols-1 gap-4">
                {/* Image Data Card */}
                <div
                  className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
                    dataSources.selectedDataSources.includes('image')
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : (isDarkMode 
                          ? 'bg-gray-700 border-gray-600 hover:border-blue-400 shadow-sm' 
                          : 'bg-white border-gray-200 hover:border-blue-300 shadow-sm')
                    }`}
                  onClick={handleImageSelect}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Image className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold text-base transition-colors duration-200 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Image Data</div>
                      <div className={`text-sm mt-1 transition-colors duration-200 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>download.jpg</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-gray-100 px-3 py-1 rounded-full font-medium">JPG</span>
                        <span className="text-xs text-gray-500 font-medium">1.2 MB</span>
                      </div>
                    </div>
                  </div>
                  {dataSources.selectedDataSources.includes('image') && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>

                {/* JSON Data Card */}
                <div
                  className={`relative bg-white border-2 rounded-xl p-5 cursor-pointer
                          transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${dataSources.selectedDataSources.includes('json')
                      ? 'border-green-500 bg-green-50 shadow-md'
                      : 'border-gray-200 hover:border-green-300 shadow-sm'
                    }`}
                  onClick={handleAddJsonData}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <FileJson className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-base text-gray-900">JSON Data</div>
                      <div className="text-sm text-gray-600 mt-1">Custom JSON input</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-gray-100 px-3 py-1 rounded-full font-medium">JSON</span>
                        <span className="text-xs text-gray-500 font-medium">Variable</span>
                      </div>
                    </div>
                  </div>
                  {dataSources.selectedDataSources.includes('json') && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>

                {/* CSV Data Card */}
                <div
                  className={`relative bg-white border-2 rounded-xl p-5 cursor-pointer
                          transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${dataSources.selectedDataSources.includes('csv')
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-gray-200 hover:border-purple-300 shadow-sm'
                    }`}
                  onClick={handleAddCsvData}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-base text-gray-900">CSV Data</div>
                      <div className="text-sm text-gray-600 mt-1">Upload CSV file</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-gray-100 px-3 py-1 rounded-full font-medium">CSV</span>
                        <span className="text-xs text-gray-500 font-medium">Click to upload</span>
                      </div>
                    </div>
                  </div>
                  {dataSources.selectedDataSources.includes('csv') && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full"></div>
                  )}
                </div>

                {/* Database Card */}
                <div
                  className="relative bg-white border-2 rounded-xl p-5 cursor-pointer 
                        transition-all duration-200 hover:shadow-lg border-gray-200 
                        hover:border-orange-300 opacity-60 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-100 rounded-xl">
                      <Database className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-base text-gray-900">Database</div>
                      <div className="text-sm text-gray-600 mt-1">Coming soon</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-gray-100 px-3 py-1 rounded-full font-medium">SQL</span>
                        <span className="text-xs text-gray-500 font-medium">Not available</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Templates Tab */}
          {workflow.activeTab === 'templates' && (
            <TemplatePanel
              onTemplateLoad={(template) => {
                console.log('Template loaded:', template.name);
                // You can add additional logic here if needed
              }}
            />
          )}

          {/* Workflow Info Tab */}
          {workflow.activeTab === 'info' && (
            <>
              {/* Workflow Management */}
              <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Management</h3>
                <div className="space-y-2">
                  <button
                    onClick={handleLoadWorkflow}
                    className="w-full px-4 py-3 text-sm font-medium bg-gray-50 text-gray-700 rounded-xl
                         hover:bg-gray-100 hover:shadow-sm transition-all duration-200 flex items-center justify-center 
                            gap-2 border border-gray-200"
                  >
                    <Upload className="w-4 h-4" />
                    Import Workflow
                  </button>
                  <button
                    onClick={handleSaveWorkflow}
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

              {/* Workflow Info */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Workflow Info</h3>
                <WorkflowInfo />
              </div>
            </>
          )}
        </div>

        {/* Actions - Always visible */}
        <div className="p-6 border-t border-gray-200 space-y-2">
          <button
            onClick={handleSaveWorkflow}
            className="w-full px-5 py-3 bg-blue-600 text-white rounded-xl 
                hover:bg-blue-700 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2
                   font-semibold text-sm"
          >
            <Save className="w-4 h-4" />
            Save Workflow
          </button>
          <button
            onClick={handleTestRun}
            className="w-full px-5 py-3 bg-green-600 text-white rounded-xl 
                hover:bg-green-700 hover:shadow-lg transition-all duration-200 flex items-center justify-center 
                    gap-2 font-semibold text-sm"
          >
            <Play className="w-4 h-4" />
            Test Run
          </button>
        </div>
      </div>

        {/* Canvas Area */}
        <div className="flex-1 p-6">
          <div className={`rounded-lg shadow-sm border h-full flex flex-col transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
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
                  onClick={toggleNotebookMode}
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

          <div className="flex-1 relative">
            {notebook.isActive ? (
              notebook.loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Starting Jupyter Notebook...</p>
                  </div>
                </div>
              ) : notebook.url ? (
                <iframe
                  src={notebook.url}
                  className="w-full h-full border-0"
                  title="Jupyter Notebook"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-downloads"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-600">Failed to load notebook</p>
                </div>
              )
            ) : (
              isMounted && (
                <WorkflowCanvas
                  canvasNodes={[]}
                  onDrop={handleNodeDrop}
                  draggedPlugin={draggedNode}
                />
              )
            )}
          </div>
        </div>
      </div>

        {/* Right Panel - Plugin Library */}
        <PluginLibrary
          onDragStart={setDraggedNode}
          onDragEnd={() => setDraggedNode(null)}
          isDarkMode={isDarkMode}
        />

        {/* Notebook Cleanup Modal */}
        {notebook.showCleanupModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full mx-4">
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Existing Files Found</h3>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  There are existing data files in the notebook directory from previous EDA sessions.
                  Would you like to remove them before opening the notebook to start fresh?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      try {
                        await notebook.handleCleanupAndStart();
                      } catch (error) {
                        alert('Failed to cleanup files. Please try again.');
                        console.error('Cleanup error:', error);
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete & Open Notebook
                  </button>
                  <button
                    onClick={() => notebook.handleKeepFilesAndStart()}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Keep Files & Continue
                  </button>
                  <button
                    onClick={() => notebook.handleCancelCleanup()}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CommunityPage() {
  return (
    <Provider store={store}>
      <CommunityPageContent />
    </Provider>
  );
}