'use client';

import React, { useState, useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import { store, RootState } from '../../store';
import { addNode, setViewport, setZoom } from '../../store/workflowSlice';
import PluginLibrary from './components/PluginLibrary';
import { Upload, Save, Download, Play, FileJson, RefreshCw, Trash2, Image, FileText, Database } from 'lucide-react';
import TemplatePanel from './components/TemplatePanel';
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<any>(null);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [isMounted, setIsMounted] = useState(false);
  const [selectedDataSources, setSelectedDataSources] = useState<string[]>([]);
  const [activeLeftTab, setActiveLeftTab] = useState<'data' | 'templates' | 'info'>('data');
  
  // Get workflow state for export
  const workflowState = useSelector((state: RootState) => state.workflow);

  // Ensure component is mounted before rendering canvas
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleImageSelect = () => {
    setSelectedImage('/images/download.jpg');
    setSelectedDataSources([...selectedDataSources, 'image']);
    
    // Add image input node to canvas
    const imageNode = {
      id: `image-${Date.now()}`,
      type: 'image_input',
      name: 'Image Input',
      x: 100,
      y: 100,
      width: 140,
      height: 80,
      color: '#3B82F6',
      inputs: [],
      outputs: [{ id: 'main', type: 'main' as const, label: 'Image Data', connected: false }],
      data: { imagePath: '/images/download.jpg' },
      parameters: {}
    };
    
    store.dispatch(addNode(imageNode));
  };

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

  const handleSaveWorkflow = () => {
    const workflowData = {
      name: workflowName,
      nodes: workflowState.nodes,
      connections: workflowState.connections,
      viewport: workflowState.viewport,
      zoom: workflowState.zoom,
      timestamp: new Date().toISOString()
    };
    
    // Convert to JSON and download
    const dataStr = JSON.stringify(workflowData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${workflowName.replace(/\s+/g, '_')}_workflow.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleLoadWorkflow = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event: any) => {
        try {
          const workflowData = JSON.parse(event.target.result);
          
          // Clear existing workflow by dispatching individual delete actions
          const currentState = store.getState().workflow;
          currentState.nodes.forEach(node => {
            store.dispatch({ type: 'workflow/deleteNode', payload: node.id });
          });
          
          // Load nodes
          workflowData.nodes.forEach((node: any) => {
            store.dispatch(addNode(node));
          });
          
          // Load connections
          workflowData.connections.forEach((connection: any) => {
            store.dispatch({ type: 'workflow/addConnection', payload: connection });
          });
          
          // Set viewport and zoom
          if (workflowData.viewport) {
            store.dispatch(setViewport(workflowData.viewport));
          }
          if (workflowData.zoom) {
            store.dispatch(setZoom(workflowData.zoom));
          }
          
          setWorkflowName(workflowData.name || 'Imported Workflow');
        } catch (error) {
          console.error('Error loading workflow:', error);
          alert('Failed to load workflow. Please check the file format.');
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  };

  const handleClearCanvas = () => {
    if (confirm('Are you sure you want to clear the entire workflow?')) {
      // Clear all nodes which will also clear connections due to the reducer logic
      const currentState = store.getState().workflow;
      currentState.nodes.forEach(node => {
        store.dispatch({ type: 'workflow/deleteNode', payload: node.id });
      });
      
      // Reset viewport and zoom
      store.dispatch(setViewport({ x: 0, y: 0 }));
      store.dispatch(setZoom(1));
      
      setSelectedImage(null);
      setSelectedDataSources([]);
      setWorkflowName('Untitled Workflow');
    }
  };

  const handleTestRun = () => {
    console.log('Testing workflow with configuration:', {
      nodes: workflowState.nodes.length,
      connections: workflowState.connections.length,
      workflow: workflowState
    });
    
    // Here you would implement the test run logic
    alert('Test run initiated! Check console for workflow configuration.');
  };

  const handleAddJsonData = () => {
    setSelectedDataSources([...selectedDataSources, 'json']);
    const jsonNode = {
      id: `json-${Date.now()}`,
      type: 'text_input',
      name: 'JSON Data',
      x: 100,
      y: 200,
      width: 140,
      height: 80,
      color: '#10B981',
      inputs: [],
      outputs: [{ id: 'main', type: 'main' as const, label: 'JSON Output', connected: false }],
      parameters: {
        jsonData: '{}'
      },
      data: {}
    };
    
    store.dispatch(addNode(jsonNode));
  };

  const handleAddCsvData = () => {
    alert('CSV upload functionality would be implemented here');
    // In a real implementation, this would open a file picker for CSV files
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header with Navigation Tabs */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Workflow Builder</h2>
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="w-full px-3 py-1 text-sm border border-gray-300 rounded-lg 
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            placeholder="Enter workflow name..."
          />

          {/* Tab Navigation */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveLeftTab('data')}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${activeLeftTab === 'data'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Data Sources
            </button>
            <button
              onClick={() => setActiveLeftTab('templates')}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${activeLeftTab === 'templates'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Templates
            </button>
            <button
              onClick={() => setActiveLeftTab('info')}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${activeLeftTab === 'info'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Workflow
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {/* Data Sources Tab */}
          {activeLeftTab === 'data' && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Data Sources</h3>
                <Upload className="w-5 h-5 text-gray-400" />
              </div>

              {/* Grid layout for data source cards */}
              <div className="grid grid-cols-1 gap-3">
                {/* Image Data Card */}
                <div
                  className={`relative bg-white border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${selectedDataSources.includes('image')
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                  onClick={handleImageSelect}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded">
                      <Image className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">Image Data</div>
                      <div className="text-xs text-gray-500 mt-1">download.jpg</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">JPG</span>
                        <span className="text-xs text-gray-400">1.2 MB</span>
                      </div>
                    </div>
                  </div>
                  {selectedDataSources.includes('image') && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>

                {/* JSON Data Card */}
                <div
                  className={`relative bg-white border-2 rounded-lg p-4 cursor-pointer 
                          transition-all hover:shadow-md ${selectedDataSources.includes('json')
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                  onClick={handleAddJsonData}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded">
                      <FileJson className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">JSON Data</div>
                      <div className="text-xs text-gray-500 mt-1">Custom JSON input</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">JSON</span>
                        <span className="text-xs text-gray-400">Variable</span>
                      </div>
                    </div>
                  </div>
                  {selectedDataSources.includes('json') && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>

                {/* CSV Data Card */}
                <div
                  className="relative bg-white border-2 rounded-lg p-4 cursor-pointer
                         transition-all hover:shadow-md border-gray-200
                           hover:border-gray-300"
                  onClick={handleAddCsvData}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">CSV Data</div>
                      <div className="text-xs text-gray-500 mt-1">Upload CSV file</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">CSV</span>
                        <span className="text-xs text-gray-400">Click to upload</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Database Card */}
                <div
                  className="relative bg-white border-2 rounded-lg p-4 cursor-pointer 
                        transition-all hover:shadow-md border-gray-200 
                        hover:border-gray-300 opacity-60"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-100 rounded">
                      <Database className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">Database</div>
                      <div className="text-xs text-gray-500 mt-1">Coming soon</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">SQL</span>
                        <span className="text-xs text-gray-400">Not available</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Templates Tab */}
          {activeLeftTab === 'templates' && (
            <TemplatePanel
              onTemplateLoad={(template) => {
                console.log('Template loaded:', template.name);
                // You can add additional logic here if needed
              }}
            />
          )}

          {/* Workflow Info Tab */}
          {activeLeftTab === 'info' && (
            <>
              {/* Workflow Management */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Workflow Management</h3>
                <div className="space-y-2">
                  <button
                    onClick={handleLoadWorkflow}
                    className="w-full px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg
                         hover:bg-gray-100 transition-colors flex items-center justify-center 
                            gap-2"
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
            className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg 
                hover:bg-blue-700 transition-colors flex items-center justify-center gap-2
                   font-medium"
          >
            <Save className="w-4 h-4" />
            Save Workflow
          </button>
          <button
            onClick={handleTestRun}
            className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg 
                hover:bg-green-700 transition-colors flex items-center justify-center 
                    gap-2 font-medium"
          >
            <Play className="w-4 h-4" />
            Test Run
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex 
                          flex-col">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 
                          to-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Workflow Canvas</h1>
                <p className="text-gray-600">
                  Drag nodes from the library and connect them to create your workflow
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="p-2 hover:bg-white rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex-1 relative">
            {isMounted && (
              <WorkflowCanvas
                canvasNodes={[]}
                onDrop={handleNodeDrop}
                draggedPlugin={draggedNode}
              />
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Plugin Library */}
      <PluginLibrary
        onDragStart={setDraggedNode}
        onDragEnd={() => setDraggedNode(null)}
      />
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