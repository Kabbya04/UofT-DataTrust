'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Upload, Zap, Bot, Cpu, Brain, Settings } from 'lucide-react';

const WorkflowCanvas = dynamic(() => import('./components/WorkflowCanvas'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-gray-500">Loading canvas...</div>
});

interface Plugin {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

interface CanvasNode {
  id: string;
  type: 'plugin' | 'image';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
}

const plugins: Plugin[] = [
  { id: 'claude', name: 'Claude', icon: <Bot className="w-5 h-5" />, color: '#FF6B35' },
  { id: 'gpt4', name: 'GPT-4', icon: <Brain className="w-5 h-5" />, color: '#10B981' },
  { id: 'gemini', name: 'Gemini', icon: <Zap className="w-5 h-5" />, color: '#3B82F6' },
  { id: 'mistral', name: 'Mistral', icon: <Cpu className="w-5 h-5" />, color: '#8B5CF6' },
  { id: 'llama', name: 'Llama', icon: <Settings className="w-5 h-5" />, color: '#F59E0B' },
];

export default function CommunityPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [canvasNodes, setCanvasNodes] = useState<CanvasNode[]>([]);
  const [draggedPlugin, setDraggedPlugin] = useState<Plugin | null>(null);

  const handleImageSelect = () => {
    setSelectedImage('/images/download.jpg');
    // Add image node to canvas
    const imageNode: CanvasNode = {
      id: 'image-1',
      type: 'image',
      name: 'download.jpg',
      x: 100,
      y: 100,
      width: 120,
      height: 80,
    };
    setCanvasNodes([imageNode]);
  };

  const handleDragStart = (plugin: Plugin) => {
    setDraggedPlugin(plugin);
  };

  const handleDragEnd = () => {
    setDraggedPlugin(null);
  };

  const handleCanvasDrop = (plugin: Plugin, x: number, y: number) => {
    const newNode: CanvasNode = {
      id: `${plugin.id}-${Date.now()}`,
      type: 'plugin',
      name: plugin.name,
      x,
      y,
      width: 120,
      height: 60,
      color: plugin.color,
    };
    
    setCanvasNodes([...canvasNodes, newNode]);
    setDraggedPlugin(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel - Data Selection */}
      <div className="w-80 bg-white border-r border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Image Workhouse</h2>
          <p className="text-sm text-gray-600 mb-4">Select data to work with in your workflow</p>
        </div>
        
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Available Data</h3>
              <Upload className="w-5 h-5 text-gray-400" />
            </div>
            
            <div 
              className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors ${
                selectedImage ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
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
                  <p className="text-xs text-gray-500">Click to use in workflow</p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <p className="text-sm font-medium">download.jpg</p>
                  <p className="text-xs">Click to select</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Workflow Canvas</h1>
            <p className="text-gray-600">Drag plugins from the right panel to create your workflow</p>
          </div>
          
          <div className="h-[calc(100%-80px)]">
            <WorkflowCanvas
              canvasNodes={canvasNodes}
              onDrop={handleCanvasDrop}
              draggedPlugin={draggedPlugin}
            />
          </div>
        </div>
      </div>

      {/* Right Panel - Plugin Library */}
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Plugin Library</h2>
          <p className="text-sm text-gray-600 mb-4">Drag plugins to the canvas to build your workflow</p>
        </div>
        
        <div className="space-y-3">
          {plugins.map((plugin) => (
            <div
              key={plugin.id}
              className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-move hover:shadow-md transition-shadow"
              draggable
              onDragStart={() => handleDragStart(plugin)}
              onDragEnd={handleDragEnd}
            >
              <div 
                className="p-2 rounded-lg mr-3"
                style={{ backgroundColor: plugin.color + '20', color: plugin.color }}
              >
                {plugin.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{plugin.name}</h3>
                <p className="text-sm text-gray-500">AI Language Model</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">How to use</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Select data from the left panel</li>
            <li>• Drag plugins to the canvas</li>
            <li>• Connect nodes to create workflows</li>
          </ul>
        </div>
      </div>
    </div>
  );
}