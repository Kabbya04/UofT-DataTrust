import React from 'react';
import { 
  Bot, Brain, Zap, Cpu, Settings, 
  Database, GitBranch, Globe, Webhook,
  Filter, GitMerge, Split, Code, FileText, Image,
  Calculator, Table, LineChart, BarChart3
} from 'lucide-react';

const nodeLibrary = [
  // AI Models
  { 
    id: 'claude', 
    name: 'Claude', 
    icon: <Bot className="w-5 h-5" />, 
    color: '#FF6B35',
    category: 'AI',
    description: 'Anthropic\'s AI assistant',
    inputs: [{ id: 'main', type: 'main', label: 'Input' }],
    outputs: [{ id: 'main', type: 'main', label: 'Output' }]
  },
  { 
    id: 'gpt4', 
    name: 'GPT-4', 
    icon: <Brain className="w-5 h-5" />, 
    color: '#10B981',
    category: 'AI',
    description: 'OpenAI\'s language model',
    inputs: [{ id: 'main', type: 'main', label: 'Input' }],
    outputs: [{ id: 'main', type: 'main', label: 'Output' }]
  },
  { 
    id: 'gemini', 
    name: 'Gemini', 
    icon: <Zap className="w-5 h-5" />, 
    color: '#3B82F6',
    category: 'AI',
    description: 'Google\'s AI model',
    inputs: [{ id: 'main', type: 'main', label: 'Input' }],
    outputs: [{ id: 'main', type: 'main', label: 'Output' }]
  },
  { 
    id: 'mistral', 
    name: 'Mistral', 
    icon: <Cpu className="w-5 h-5" />, 
    color: '#8B5CF6',
    category: 'AI',
    description: 'Mistral AI model',
    inputs: [{ id: 'main', type: 'main', label: 'Input' }],
    outputs: [{ id: 'main', type: 'main', label: 'Output' }]
  },
  { 
    id: 'llama', 
    name: 'Llama', 
    icon: <Settings className="w-5 h-5" />, 
    color: '#F59E0B',
    category: 'AI',
    description: 'Meta\'s Llama model',
    inputs: [{ id: 'main', type: 'main', label: 'Input' }],
    outputs: [{ id: 'main', type: 'main', label: 'Output' }]
  },
  
  // Data Transformation
  { 
    id: 'json_transform', 
    name: 'JSON Transform', 
    icon: <Code className="w-5 h-5" />, 
    color: '#6366F1',
    category: 'Data',
    description: 'Transform JSON data',
    inputs: [{ id: 'main', type: 'main', label: 'Input' }],
    outputs: [{ id: 'main', type: 'main', label: 'Output' }]
  },
  { 
    id: 'merge_data', 
    name: 'Merge', 
    icon: <GitMerge className="w-5 h-5" />, 
    color: '#8B5CF6',
    category: 'Data',
    description: 'Merge multiple data sources',
    inputs: [
      { id: 'input1', type: 'main', label: 'Input 1' },
      { id: 'input2', type: 'main', label: 'Input 2' }
    ],
    outputs: [{ id: 'main', type: 'main', label: 'Output' }]
  },
  { 
    id: 'split_data', 
    name: 'Split', 
    icon: <Split className="w-5 h-5" />, 
    color: '#EC4899',
    category: 'Data',
    description: 'Split data into branches',
    inputs: [{ id: 'main', type: 'main', label: 'Input' }],
    outputs: [
      { id: 'output1', type: 'main', label: 'Output 1' },
      { id: 'output2', type: 'main', label: 'Output 2' }
    ]
  },
  { 
    id: 'filter', 
    name: 'Filter', 
    icon: <Filter className="w-5 h-5" />, 
    color: '#F59E0B',
    category: 'Data',
    description: 'Filter data based on conditions',
    inputs: [{ id: 'main', type: 'main', label: 'Input' }],
    outputs: [
      { id: 'pass', type: 'main', label: 'Pass' },
      { id: 'fail', type: 'main', label: 'Fail' }
    ]
  },
  
  // Data Science - Unified EDA Processor
  { 
    id: 'eda_processor', 
    name: 'EDA Processor', 
    icon: <BarChart3 className="w-5 h-5" />, 
    color: '#7C3AED',
    category: 'Data Science',
    description: 'Unified exploratory data analysis with pandas, numpy & matplotlib',
    inputs: [{ id: 'main', type: 'main', label: 'Data Input' }],
    outputs: [
      { id: 'processed_data', type: 'data', label: 'Processed Data' },
      { id: 'visualizations', type: 'visualization', label: 'Charts' },
      { id: 'download_link', type: 'link', label: 'Colab Link' }
    ],
    features: [
      'Multi-library execution (Pandas → NumPy → Matplotlib)',
      'Predefined EDA workflows',
      'Custom function chains',
      'Google Colab integration',
      'Automated file type detection',
      'Public download links'
    ],
    workflows: [
      'Basic EDA',
      'Data Cleaning', 
      'Visualization Suite',
      'Custom Chain'
    ]
  },
  
  // API
  { 
    id: 'http_request', 
    name: 'HTTP Request', 
    icon: <Globe className="w-5 h-5" />, 
    color: '#06B6D4',
    category: 'API',
    description: 'Make HTTP requests',
    inputs: [{ id: 'main', type: 'main', label: 'Input' }],
    outputs: [{ id: 'main', type: 'main', label: 'Response' }]
  },
  { 
    id: 'webhook', 
    name: 'Webhook', 
    icon: <Webhook className="w-5 h-5" />, 
    color: '#14B8A6',
    category: 'API',
    description: 'Receive webhook calls',
    inputs: [],
    outputs: [{ id: 'main', type: 'main', label: 'Data' }]
  },
  
  // Logic
  { 
    id: 'if_condition', 
    name: 'IF', 
    icon: <GitBranch className="w-5 h-5" />, 
    color: '#F97316',
    category: 'Logic',
    description: 'Conditional branching',
    inputs: [{ id: 'main', type: 'main', label: 'Input' }],
    outputs: [
      { id: 'true', type: 'condition', label: 'True' },
      { id: 'false', type: 'condition', label: 'False' }
    ]
  },
  
  // Utility
  { 
    id: 'text_input', 
    name: 'Text Input', 
    icon: <FileText className="w-5 h-5" />, 
    color: '#10B981',
    category: 'Utility',
    description: 'Manual text input',
    inputs: [],
    outputs: [{ id: 'main', type: 'main', label: 'Text' }]
  },
  { 
    id: 'image_input', 
    name: 'Image Input', 
    icon: <Image className="w-5 h-5" />, 
    color: '#3B82F6',
    category: 'Utility',
    description: 'Image data input',
    inputs: [],
    outputs: [{ id: 'main', type: 'main', label: 'Image Data' }]
  },
];

interface PluginLibraryProps {
  onDragStart: (node: any) => void;
  onDragEnd: () => void;
}

export default function PluginLibrary({ onDragStart, onDragEnd }: PluginLibraryProps) {
  const categories = ['AI', 'Data', 'Data Science', 'API', 'Logic', 'Utility'];
  
  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Node Library</h2>
        <p className="text-sm text-gray-600 mb-6">
          Drag nodes to the canvas to build your workflow
        </p>
        
        {categories.map(category => {
          const categoryNodes = nodeLibrary.filter(node => node.category === category);
          if (categoryNodes.length === 0) return null;
          
          return (
            <div key={category} className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {categoryNodes.map(node => (
                  <div
                    key={node.id}
                    className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-move hover:shadow-md hover:border-gray-300 transition-all"
                    draggable
                    onDragStart={() => onDragStart(node)}
                    onDragEnd={onDragEnd}
                  >
                    <div 
                      className="p-2 rounded-lg mr-3"
                      style={{ backgroundColor: node.color + '20', color: node.color }}
                    >
                      {node.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{node.name}</h4>
                      <p className="text-xs text-gray-500">{node.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}