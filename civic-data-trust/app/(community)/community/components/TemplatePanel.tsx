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
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{template.name}</h2>
              <p className="text-lg text-gray-600 mb-4">{template.description}</p>
              <div className="flex items-center gap-6 text-base">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 font-medium">{template.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 font-medium">{template.difficulty}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 font-medium">{template.category}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors text-2xl font-bold p-2 hover:bg-gray-100 rounded-lg"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[60vh]">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-6 text-center border border-blue-100">
              <div className="text-3xl font-bold text-blue-600">{template.preview.nodeCount}</div>
              <div className="text-base text-blue-800 font-medium mt-1">Nodes</div>
            </div>
            <div className="bg-green-50 rounded-xl p-6 text-center border border-green-100">
              <div className="text-3xl font-bold text-green-600">{template.preview.connectionCount}</div>
              <div className="text-base text-green-800 font-medium mt-1">Connections</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-6 text-center border border-purple-100">
              <div className="text-3xl font-bold text-purple-600">{template.tags.length}</div>
              <div className="text-base text-purple-800 font-medium mt-1">Tags</div>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-3">
              {template.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Node Flow Preview */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Workflow Overview</h3>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex flex-wrap items-center gap-3">
                {template.nodes.map((node, index) => (
                  <React.Fragment key={node.id}>
                    <div
                      className="px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm"
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
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-700 mb-4">What's Included</h3>
            <div className="space-y-3">
              {template.nodes.slice(0, 5).map((node) => (
                <div key={node.id} className="flex items-center gap-4">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-base text-gray-700">
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
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-start gap-4">
              <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-blue-900 mb-3 text-lg">How to use this template</h4>
                <ol className="text-base text-blue-800 space-y-2 list-decimal list-inside">
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
        <div className="p-8 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-all duration-200 font-medium text-base hover:bg-gray-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={() => onUseTemplate(template)}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg 
                       transition-all duration-200 flex items-center gap-2 font-semibold text-base"
          >
            <Zap className="w-5 h-5" />
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
      <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Workflow Templates</h3>
          <Layout className="w-5 h-5 text-gray-400" />
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm rounded-xl transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-700 font-semibold border border-blue-200 shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Template List */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 
                         transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-base mb-2 group-hover:text-blue-600 
                                 transition-colors">
                    {template.name}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {template.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    getDifficultyColor(template.difficulty)
                  }`}>
                    {template.difficulty}
                  </span>
                  <span className="text-sm text-gray-600 font-medium">
                    {template.preview.nodeCount} nodes
                  </span>
                </div>

                <button
                  onClick={() => setPreviewTemplate(template)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 
                            hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="flex items-center gap-2 font-medium">
                    <Clock className="w-4 h-4" />
                    {template.estimatedTime}
                  </span>
                  <span className="font-medium">{template.category}</span>
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