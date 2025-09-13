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
  const [notebookMode, setNotebookMode] = useState(false);
  const [notebookUrl, setNotebookUrl] = useState('');
  const [notebookLoading, setNotebookLoading] = useState(false);
  
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
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const csvContent = e.target?.result as string;
          
          try {
            // Send CSV to backend for processing
            const response = await fetch('http://localhost:8000/api/v1/data/upload-csv', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                csv_content: csvContent,
                filename: file.name
              })
            });
            
            if (!response.ok) {
              throw new Error(`Failed to process CSV: ${response.statusText}`);
            }
            
            const csvInfo = await response.json();
            
            // Create CSV data node with processed info
            const csvNode = {
              id: `csv-${Date.now()}`,
              type: 'csv_input',
              name: `CSV: ${file.name}`,
              x: 100,
              y: 150,
              width: 180,
              height: 100,
              color: '#8B5CF6',
              inputs: [],
              outputs: [{ id: 'main', type: 'main' as const, label: 'CSV Data', connected: false }],
              parameters: {
                fileName: file.name,
                csvContent: csvContent,
                fileSize: file.size,
                shape: csvInfo.shape,
                columns: csvInfo.columns,
                summary: csvInfo.summary
              },
              data: { 
                csvData: csvContent,
                processedInfo: csvInfo
              }
            };
            
            store.dispatch(addNode(csvNode));
            setSelectedDataSources([...selectedDataSources, 'csv']);
            
            // Store CSV data in localStorage for matplotlib functions to access
            localStorage.setItem('lastUploadedCSV', JSON.stringify({
              content: csvContent,
              filename: file.name,
              timestamp: new Date().toISOString(),
              columns: csvInfo.columns,
              shape: csvInfo.shape
            }));
            
            console.log('CSV data stored in localStorage for matplotlib access');
            
          } catch (error) {
            console.error('Error processing CSV:', error);
            alert(`Error processing CSV file: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const toggleNotebookMode = async () => {
    if (!notebookMode) {
      // Switching to notebook mode
      setNotebookLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/v1/notebook/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          const data = await response.json();
          setNotebookUrl(data.url);
          setNotebookMode(true);
        } else {
          alert('Failed to start notebook server');
        }
      } catch (error) {
        alert('Error connecting to backend');
        console.error('Notebook start error:', error);
      }
      setNotebookLoading(false);
    } else {
      // Switching back to canvas mode
      setNotebookMode(false);
      setNotebookUrl('');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header with Navigation Tabs */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Workflow Builder</h2>
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
              className={`flex-1 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${activeLeftTab === 'data'
                  ? 'bg-white text-blue-700 shadow-md border border-blue-200'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              Data Sources
            </button>
            <button
              onClick={() => setActiveLeftTab('templates')}
              className={`flex-1 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${activeLeftTab === 'templates'
                  ? 'bg-white text-blue-700 shadow-md border border-blue-200'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              Templates
            </button>
            <button
              onClick={() => setActiveLeftTab('info')}
              className={`flex-1 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${activeLeftTab === 'info'
                  ? 'bg-white text-blue-700 shadow-md border border-blue-200'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
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
            <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Data Sources</h3>
                <Upload className="w-5 h-5 text-gray-400" />
              </div>

              {/* Grid layout for data source cards */}
              <div className="grid grid-cols-1 gap-4">
                {/* Image Data Card */}
                <div
                  className={`relative bg-white border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${selectedDataSources.includes('image')
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 shadow-sm'
                    }`}
                  onClick={handleImageSelect}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Image className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-base text-gray-900">Image Data</div>
                      <div className="text-sm text-gray-600 mt-1">download.jpg</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-gray-100 px-3 py-1 rounded-full font-medium">JPG</span>
                        <span className="text-xs text-gray-500 font-medium">1.2 MB</span>
                      </div>
                    </div>
                  </div>
                  {selectedDataSources.includes('image') && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>

                {/* JSON Data Card */}
                <div
                  className={`relative bg-white border-2 rounded-xl p-5 cursor-pointer 
                          transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${selectedDataSources.includes('json')
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
                  {selectedDataSources.includes('json') && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>

                {/* CSV Data Card */}
                <div
                  className={`relative bg-white border-2 rounded-xl p-5 cursor-pointer 
                          transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${selectedDataSources.includes('csv')
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
                  {selectedDataSources.includes('csv') && (
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex 
                          flex-col">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 
                          to-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {notebookMode ? 'Jupyter Notebook' : 'Workflow Canvas'}
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                  {notebookMode 
                    ? 'Interactive notebook environment for data analysis'
                    : 'Drag nodes from the library and connect them to create your workflow'
                  }
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={toggleNotebookMode}
                  className={`px-5 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium text-sm ${
                    notebookMode 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm border border-gray-200'
                  }`}
                  title={notebookMode ? 'Switch to Canvas' : 'Open Notebook'}
                >
                  <FileText className="w-4 h-4" />
                  {notebookMode ? 'Canvas Mode' : 'Notebook Mode'}
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 relative">
            {notebookMode ? (
              notebookLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Starting Jupyter Notebook...</p>
                  </div>
                </div>
              ) : notebookUrl ? (
                <iframe
                  src={notebookUrl}
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