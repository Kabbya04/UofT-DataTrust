'use client';

import React, { useState, useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import { store, RootState } from '../../store';
import { addNode, setViewport, setZoom } from '../../store/workflowSlice';
import PluginLibrary from './components/PluginLibrary';
import { Upload, Save, Download, Play, FileJson, RefreshCw, Trash2 } from 'lucide-react';

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
  
  // Get workflow state for export
  const workflowState = useSelector((state: RootState) => state.workflow);

  // Ensure component is mounted before rendering canvas
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleImageSelect = () => {
    setSelectedImage('/images/download.jpg');
    
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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel - Data Selection and Workflow Info */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Workflow Builder</h2>
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="w-full px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter workflow name..."
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {/* Data Sources */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Data Sources</h3>
              <Upload className="w-5 h-5 text-gray-400" />
            </div>
            
            <div 
              className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all ${
                selectedImage 
                  ? 'border-blue-500 bg-blue-50 hover:bg-blue-100' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
              onClick={handleImageSelect}
            >
              {selectedImage ? (
                <div className="text-center">
                  <img 
                    src={selectedImage} 
                    alt="Selected" 
                    className="mx-auto mb-2 max-w-full h-20 object-cover rounded"
                  />
                  <p className="text-sm font-medium text-blue-700">download.jpg</p>
                  <p className="text-xs text-gray-500">Click to add another node</p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm font-medium">Click to add image</p>
                  <p className="text-xs">download.jpg available</p>
                </div>
              )}
            </div>
            
            {/* Additional data source options */}
            <div className="mt-3 space-y-2">
              <button 
                onClick={handleAddJsonData}
                className="w-full px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <FileJson className="w-4 h-4" />
                Add JSON Data
              </button>
            </div>
          </div>
          
          {/* Workflow Management */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Workflow Management</h3>
            <div className="space-y-2">
              <button 
                onClick={handleLoadWorkflow}
                className="w-full px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Import Workflow
              </button>
              <button 
                onClick={handleSaveWorkflow}
                className="w-full px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Workflow
              </button>
              <button 
                onClick={handleClearCanvas}
                className="w-full px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
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
        </div>
        
        {/* Actions */}
        <div className="p-6 border-t border-gray-200 space-y-2">
          <button 
            onClick={handleSaveWorkflow}
            className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Save className="w-4 h-4" />
            Save Workflow
          </button>
          <button 
            onClick={handleTestRun}
            className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Play className="w-4 h-4" />
            Test Run
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
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