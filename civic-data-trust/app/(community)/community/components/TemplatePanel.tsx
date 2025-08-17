import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Layout, 
  Eye, 
  Clock, 
  Star, 
  Users, 
  ArrowRight,
  CheckCircle,
  Info,
  Zap
} from 'lucide-react';
import { RootState } from '@/app/store';
import { 
  addNode, 
  addConnection, 
  setViewport, 
  setZoom,
  setSelectedNodes 
} from '@/app/store/workflowSlice';
import { 
  workflowTemplates, 
  getTemplatesByCategory, 
  getTemplateCategories,
  WorkflowTemplate 
} from './WorkFlowTemplates';

interface TemplatePanelProps {
  onTemplateLoad?: (template: WorkflowTemplate) => void;
}

const TemplatePreviewModal: React.FC<{
  template: WorkflowTemplate;
  onClose: () => void;
  onUseTemplate: (template: WorkflowTemplate) => void;
}> = ({ template, onClose, onUseTemplate }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{template.name}</h2>
              <p className="text-gray-600 mb-4">{template.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{template.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{template.difficulty}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{template.category}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{template.preview.nodeCount}</div>
              <div className="text-sm text-blue-800">Nodes</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{template.preview.connectionCount}</div>
              <div className="text-sm text-green-800">Connections</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{template.tags.length}</div>
              <div className="text-sm text-purple-800">Tags</div>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {template.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Node Flow Preview */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Workflow Overview</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex flex-wrap items-center gap-2">
                {template.nodes.map((node, index) => (
                  <React.Fragment key={node.id}>
                    <div
                      className="px-3 py-2 rounded-lg text-xs font-medium text-white shadow-sm"
                      style={{ backgroundColor: node.color }}
                    >
                      {node.name}
                    </div>
                    {index < template.nodes.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">What's Included</h3>
            <div className="space-y-2">
              {template.nodes.slice(0, 5).map((node) => (
                <div key={node.id} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    <strong>{node.name}:</strong> {node.parameters?.notes || 'Pre-configured node ready to use'}
                  </span>
                </div>
              ))}
              {template.nodes.length > 5 && (
                <div className="text-sm text-gray-500 italic">
                  + {template.nodes.length - 5} more nodes...
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">How to use this template</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Click "Use This Template" to load it onto your canvas</li>
                  <li>Review and customize the pre-configured parameters</li>
                  <li>Connect your data sources and API endpoints</li>
                  <li>Test the workflow with sample data</li>
                  <li>Save and deploy your customized workflow</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onUseTemplate(template)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       transition-colors flex items-center gap-2 font-medium"
          >
            <Zap className="w-4 h-4" />
            Use This Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default function TemplatePanel({ onTemplateLoad }: TemplatePanelProps) {
  const dispatch = useDispatch();
  const workflowState = useSelector((state: RootState) => state.workflow);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [previewTemplate, setPreviewTemplate] = useState<WorkflowTemplate | null>(null);

  const categories = ['All', ...getTemplateCategories()];
  const filteredTemplates = selectedCategory === 'All' 
    ? workflowTemplates 
    : getTemplatesByCategory(selectedCategory);

  const handleUseTemplate = (template: WorkflowTemplate) => {
    // Ask for confirmation if canvas is not empty
    if (workflowState.nodes.length > 0) {
      const shouldProceed = window.confirm(
        'This will clear your current workflow and load the template. Continue?'
      );
      if (!shouldProceed) return;
    }

    // Clear existing workflow
    workflowState.nodes.forEach(node => {
      dispatch({ type: 'workflow/deleteNode', payload: node.id });
    });

    // Generate unique IDs for template nodes and connections
    const nodeIdMap = new Map<string, string>();
    const newNodes = template.nodes.map(node => {
      const newId = `${node.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      nodeIdMap.set(node.id, newId);
      return {
        ...node,
        id: newId,
        inputs: node.inputs?.map(input => ({ ...input, connected: false })),
        outputs: node.outputs?.map(output => ({ ...output, connected: false }))
      };
    });

    // Add nodes to canvas
    newNodes.forEach(node => {
      dispatch(addNode(node));
    });

    // Add connections with updated node IDs
    template.connections.forEach(connection => {
      const newConnection = {
        ...connection,
        id: `${connection.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sourceNodeId: nodeIdMap.get(connection.sourceNodeId) || connection.sourceNodeId,
        targetNodeId: nodeIdMap.get(connection.targetNodeId) || connection.targetNodeId
      };
      dispatch(addConnection(newConnection));
    });

    // Set viewport and zoom
    dispatch(setViewport(template.defaultViewport));
    dispatch(setZoom(template.defaultZoom));
    dispatch(setSelectedNodes([]));

    // Close preview modal
    setPreviewTemplate(null);

    // Callback for parent component
    if (onTemplateLoad) {
      onTemplateLoad(template);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">Workflow Templates</h3>
          <Layout className="w-5 h-5 text-gray-400" />
        </div>

        {/* Category Filter */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Template List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md 
                         transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm mb-1 group-hover:text-blue-600 
                                 transition-colors">
                    {template.name}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {template.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    getDifficultyColor(template.difficulty)
                  }`}>
                    {template.difficulty}
                  </span>
                  <span className="text-xs text-gray-500">
                    {template.preview.nodeCount} nodes
                  </span>
                </div>

                <button
                  onClick={() => setPreviewTemplate(template)}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 
                            hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  Preview
                </button>
              </div>

              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {template.estimatedTime}
                  </span>
                  <span>{template.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Layout className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No templates found for this category</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUseTemplate={handleUseTemplate}
        />
      )}
    </>
  );
}