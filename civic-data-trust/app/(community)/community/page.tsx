'use client';

import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../../store';

// Import layout components
import { LeftSidebar, MainCanvas } from './components/layout';
import PluginLibrary from './components/PluginLibrary';
import TopNavigation from './components/TopNavigation';
import { NotebookCleanupModal } from './components/notebook';

// Import hooks
import { useNotebook } from './hooks';

// Separate component to use hooks
function CommunityPageContent() {
  // UI state
  const [draggedNode, setDraggedNode] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Use notebook hook
  const notebook = useNotebook();

  // Ensure component is mounted before rendering canvas
  useEffect(() => {
    setIsMounted(true);
  }, []);

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

    store.dispatch({ type: 'workflow/addNode', payload: newNode });
    setDraggedNode(null);
  };

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
        {/* Left Sidebar */}
        <LeftSidebar isDarkMode={isDarkMode} />

        {/* Main Canvas Area */}
        <MainCanvas
          isDarkMode={isDarkMode}
          isMounted={isMounted}
          draggedNode={draggedNode}
          onNodeDrop={handleNodeDrop}
        />

        {/* Right Panel - Plugin Library */}
        <PluginLibrary
          onDragStart={setDraggedNode}
          onDragEnd={() => setDraggedNode(null)}
          isDarkMode={isDarkMode}
        />

        {/* Notebook Cleanup Modal */}
        <NotebookCleanupModal
          isOpen={notebook.showCleanupModal}
          onCleanupAndStart={notebook.handleCleanupAndStart}
          onKeepFilesAndStart={notebook.handleKeepFilesAndStart}
          onCancel={notebook.handleCancelCleanup}
        />
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