import React from 'react';
import { useWorkflow } from '../../hooks';
import TemplatePanel from '../TemplatePanel';
import DataSourcesPanel from '../data-sources/DataSourcesPanel';
import WorkflowInfoPanel from '../workflow/WorkflowInfoPanel';
import type { TabType } from '../../types';

interface LeftSidebarProps {
  isDarkMode: boolean;
}

export default function LeftSidebar({ isDarkMode }: LeftSidebarProps) {
  const workflow = useWorkflow();

  return (
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
          <TabButton
            active={workflow.activeTab === 'data'}
            onClick={() => workflow.setActiveTab('data')}
            isDarkMode={isDarkMode}
          >
            Data Sources
          </TabButton>
          <TabButton
            active={workflow.activeTab === 'templates'}
            onClick={() => workflow.setActiveTab('templates')}
            isDarkMode={isDarkMode}
          >
            Templates
          </TabButton>
          <TabButton
            active={workflow.activeTab === 'info'}
            onClick={() => workflow.setActiveTab('info')}
            isDarkMode={isDarkMode}
          >
            Workflow
          </TabButton>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {workflow.activeTab === 'data' && (
          <DataSourcesPanel isDarkMode={isDarkMode} />
        )}

        {workflow.activeTab === 'templates' && (
          <TemplatePanel
            onTemplateLoad={(template) => {
              console.log('Template loaded:', template.name);
              // You can add additional logic here if needed
            }}
          />
        )}

        {workflow.activeTab === 'info' && (
          <WorkflowInfoPanel isDarkMode={isDarkMode} />
        )}
      </div>

      {/* Actions - Always visible */}
      <div className="p-6 border-t border-gray-200 space-y-2">
        <button
          onClick={workflow.saveWorkflow}
          className="w-full px-5 py-3 bg-blue-600 text-white rounded-xl
              hover:bg-blue-700 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2
                 font-semibold text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Save Workflow
        </button>
        <button
          onClick={workflow.testWorkflow}
          className="w-full px-5 py-3 bg-green-600 text-white rounded-xl
              hover:bg-green-700 hover:shadow-lg transition-all duration-200 flex items-center justify-center
                  gap-2 font-semibold text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a2 2 0 002 2h2a2 2 0 002-2v-4m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v1" />
          </svg>
          Test Run
        </button>
      </div>
    </div>
  );
}

// Tab Button Component
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  isDarkMode: boolean;
  children: React.ReactNode;
}

function TabButton({ active, onClick, isDarkMode, children }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
        active
          ? (isDarkMode ? 'bg-gray-600 text-blue-400 shadow-md border border-blue-500' : 'bg-white text-blue-700 shadow-md border border-blue-200')
          : (isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-600' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50')
      }`}
    >
      {children}
    </button>
  );
}