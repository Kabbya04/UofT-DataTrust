// WorkflowTemplates.ts
import { NodeData, Connection } from '@/app/store/workflowSlice';

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  tags: string[];
  preview: {
    thumbnail?: string;
    nodeCount: number;
    connectionCount: number;
  };
  nodes: NodeData[];
  connections: Connection[];
  defaultViewport: { x: number; y: number };
  defaultZoom: number;
}

export const workflowTemplates: WorkflowTemplate[] = [
  // AI Processing Pipeline Templates
  {
    id: 'ai-image-analysis',
    name: 'AI Image Analysis Pipeline',
    description: 'Complete pipeline for analyzing images using multiple AI models and generating comprehensive reports.',
    category: 'AI Processing',
    difficulty: 'Intermediate',
    estimatedTime: '10-15 min',
    tags: ['AI', 'Image Processing', 'Multi-Model', 'Analysis'],
    preview: {
      nodeCount: 6,
      connectionCount: 5
    },
    defaultViewport: { x: 50, y: 50 },
    defaultZoom: 0.8,
    nodes: [
      {
        id: 'template-image-input',
        type: 'image_input',
        name: 'Image Input',
        x: 100,
        y: 150,
        width: 140,
        height: 80,
        color: '#3B82F6',
        inputs: [],
        outputs: [{ id: 'main', type: 'main' as const, label: 'Image Data', connected: true }],
        data: { imagePath: '/images/sample.jpg' },
        parameters: {
          notes: 'Upload or select an image for analysis'
        }
      },
      {
        id: 'template-claude-vision',
        type: 'claude',
        name: 'Claude Vision',
        x: 350,
        y: 100,
        width: 140,
        height: 80,
        color: '#FF6B35',
        inputs: [{ id: 'main', type: 'main' as const, label: 'Input', connected: true }],
        outputs: [{ id: 'main', type: 'main' as const, label: 'Analysis', connected: true }],
        parameters: {
          systemPrompt: 'You are an expert image analyst. Analyze the provided image and describe what you see in detail.',
          userPrompt: 'Analyze this image and provide: 1) Main subjects/objects, 2) Scene description, 3) Colors and composition, 4) Notable details',
          temperature: 0.3,
          maxTokens: 500,
          notes: 'Primary image analysis using Claude Vision'
        },
        data: {}
      },
      {
        id: 'template-gpt4-vision',
        type: 'gpt4',
        name: 'GPT-4 Vision',
        x: 350,
        y: 200,
        width: 140,
        height: 80,
        color: '#10B981',
        inputs: [{ id: 'main', type: 'main' as const, label: 'Input', connected: true }],
        outputs: [{ id: 'main', type: 'main' as const, label: 'Analysis', connected: true }],
        parameters: {
          systemPrompt: 'You are a professional photographer and visual arts expert. Provide technical and artistic analysis.',
          userPrompt: 'Analyze this image focusing on: 1) Technical aspects (lighting, composition, focus), 2) Artistic elements, 3) Potential improvements, 4) Overall quality assessment',
          temperature: 0.4,
          maxTokens: 500,
          notes: 'Secondary analysis focusing on technical and artistic aspects'
        },
        data: {}
      },
      {
        id: 'template-merge-analysis',
        type: 'merge_data',
        name: 'Merge Analysis',
        x: 600,
        y: 150,
        width: 140,
        height: 80,
        color: '#8B5CF6',
        inputs: [
          { id: 'input1', type: 'main' as const, label: 'Claude Analysis', connected: true },
          { id: 'input2', type: 'main' as const, label: 'GPT-4 Analysis', connected: true }
        ],
        outputs: [{ id: 'main', type: 'main' as const, label: 'Combined', connected: true }],
        parameters: {
          mergeStrategy: 'combine',
          mergeKey: 'analysis_type',
          notes: 'Combines both AI analyses for comprehensive insights'
        },
        data: {}
      },
      {
        id: 'template-json-transform',
        type: 'json_transform',
        name: 'Format Report',
        x: 850,
        y: 150,
        width: 140,
        height: 80,
        color: '#6366F1',
        inputs: [{ id: 'main', type: 'main' as const, label: 'Input', connected: true }],
        outputs: [{ id: 'main', type: 'main' as const, label: 'Report', connected: true }],
        parameters: {
          expression: `{
  "report_id": "{{$uuid}}",
  "timestamp": "{{$now}}",
  "image_analysis": {
    "claude_insights": "{{input.claude_analysis}}",
    "gpt4_insights": "{{input.gpt4_analysis}}",
    "combined_rating": "{{$avg(input.ratings)}}",
    "key_findings": "{{input.key_points}}"
  },
  "recommendations": "{{input.suggestions}}",
  "metadata": {
    "models_used": ["Claude", "GPT-4"],
    "processing_time": "{{$processingTime}}"
  }
}`,
          outputFormat: 'json',
          notes: 'Formats the analysis into a structured report'
        },
        data: {}
      },
      {
        id: 'template-webhook-output',
        type: 'http_request',
        name: 'Send Report',
        x: 1100,
        y: 150,
        width: 140,
        height: 80,
        color: '#06B6D4',
        inputs: [{ id: 'main', type: 'main' as const, label: 'Input', connected: true }],
        outputs: [{ id: 'main', type: 'main' as const, label: 'Response', connected: false }],
        parameters: {
          url: 'https://your-api.com/analysis-reports',
          method: 'POST',
          headers: '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_TOKEN"}',
          body: '{{input}}',
          notes: 'Sends the formatted report to your API endpoint'
        },
        data: {}
      }
    ],
    connections: [
      {
        id: 'conn-1',
        sourceNodeId: 'template-image-input',
        sourcePortId: 'main',
        targetNodeId: 'template-claude-vision',
        targetPortId: 'main',
        type: 'main'
      },
      {
        id: 'conn-2',
        sourceNodeId: 'template-image-input',
        sourcePortId: 'main',
        targetNodeId: 'template-gpt4-vision',
        targetPortId: 'main',
        type: 'main'
      },
      {
        id: 'conn-3',
        sourceNodeId: 'template-claude-vision',
        sourcePortId: 'main',
        targetNodeId: 'template-merge-analysis',
        targetPortId: 'input1',
        type: 'main'
      },
      {
        id: 'conn-4',
        sourceNodeId: 'template-gpt4-vision',
        sourcePortId: 'main',
        targetNodeId: 'template-merge-analysis',
        targetPortId: 'input2',
        type: 'main'
      },
      {
        id: 'conn-5',
        sourceNodeId: 'template-merge-analysis',
        sourcePortId: 'main',
        targetNodeId: 'template-json-transform',
        targetPortId: 'main',
        type: 'main'
      },
      {
        id: 'conn-6',
        sourceNodeId: 'template-json-transform',
        sourcePortId: 'main',
        targetNodeId: 'template-webhook-output',
        targetPortId: 'main',
        type: 'main'
      }
    ]
  },

  // Data Transformation Pipeline
  {
    id: 'data-processing-pipeline',
    name: 'Data Processing & Validation Pipeline',
    description: 'Complete data transformation workflow with validation, filtering, and multi-format output generation.',
    category: 'Data Transformation',
    difficulty: 'Beginner',
    estimatedTime: '5-10 min',
    tags: ['Data Processing', 'Validation', 'Transform', 'Export'],
    preview: {
      nodeCount: 7,
      connectionCount: 8
    },
    defaultViewport: { x: 30, y: 30 },
    defaultZoom: 0.7,
    nodes: [
      {
        id: 'template-json-input',
        type: 'text_input',
        name: 'Raw Data Input',
        x: 100,
        y: 150,
        width: 140,
        height: 80,
        color: '#10B981',
        inputs: [],
        outputs: [{ id: 'main', type: 'main' as const, label: 'Raw Data', connected: true }],
        parameters: {
          jsonData: '{"users": [{"id": 1, "name": "John Doe", "email": "john@example.com", "age": 30, "status": "active"}, {"id": 2, "name": "Jane Smith", "email": "", "age": 25, "status": "inactive"}]}',
          notes: 'Paste your raw JSON data here for processing'
        },
        data: {}
      },
      {
        id: 'template-data-validator',
        type: 'filter',
        name: 'Data Validator',
        x: 350,
        y: 100,
        width: 140,
        height: 80,
        color: '#F59E0B',
        inputs: [{ id: 'main', type: 'main' as const, label: 'Input', connected: true }],
        outputs: [
          { id: 'pass', type: 'main' as const, label: 'Valid Data', connected: true },
          { id: 'fail', type: 'main' as const, label: 'Invalid Data', connected: true }
        ],
        parameters: {
          filterExpression: 'item.email && item.email.includes("@") && item.age > 0',
          filterMode: 'include',
          notes: 'Validates data entries - checks for valid email and positive age'
        },
        data: {}
      },
      {
        id: 'template-active-filter',
        type: 'filter',
        name: 'Active Users Filter',
        x: 600,
        y: 50,
        width: 140,
        height: 80,
        color: '#10B981',
        inputs: [{ id: 'main', type: 'main' as const, label: 'Input', connected: true }],
        outputs: [
          { id: 'pass', type: 'main' as const, label: 'Active Users', connected: true },
          { id: 'fail', type: 'main' as const, label: 'Inactive Users', connected: true }
        ],
        parameters: {
          filterExpression: 'item.status === "active"',
          filterMode: 'include',
          notes: 'Separates active users from inactive ones'
        },
        data: {}
      },
      {
        id: 'template-data-enrichment',
        type: 'json_transform',
        name: 'Data Enrichment',
        x: 850,
        y: 50,
        width: 140,
        height: 80,
        color: '#6366F1',
        inputs: [{ id: 'main', type: 'main' as const, label: 'Input', connected: true }],
        outputs: [{ id: 'main', type: 'main' as const, label: 'Enriched', connected: true }],
        parameters: {
          expression: `{
  "user_id": "{{input.id}}",
  "full_name": "{{input.name}}",
  "email_address": "{{input.email}}",
  "age_years": "{{input.age}}",
  "account_status": "{{input.status}}",
  "created_at": "{{$now}}",
  "age_group": "{{input.age < 25 ? 'Young' : input.age < 40 ? 'Adult' : 'Senior'}}",
  "email_domain": "{{input.email.split('@')[1]}}",
  "is_verified": true
}`,
          outputFormat: 'json',
          notes: 'Enriches user data with additional computed fields'
        },
        data: {}
      },
      {
        id: 'template-error-handler',
        type: 'json_transform',
        name: 'Error Logger',
        x: 600,
        y: 200,
        width: 140,
        height: 80,
        color: '#EF4444',
        inputs: [{ id: 'main', type: 'main' as const, label: 'Input', connected: true }],
        outputs: [{ id: 'main', type: 'main' as const, label: 'Error Log', connected: true }],
        parameters: {
          expression: `{
  "error_id": "{{$uuid}}",
  "timestamp": "{{$now}}",
  "invalid_records": "{{input}}",
  "error_type": "validation_failed",
  "total_errors": "{{input.length}}",
  "common_issues": ["missing_email", "invalid_age", "empty_fields"]
}`,
          outputFormat: 'json',
          notes: 'Logs validation errors for review and debugging'
        },
        data: {}
      },
      {
        id: 'template-final-merge',
        type: 'merge_data',
        name: 'Final Assembly',
        x: 1100,
        y: 100,
        width: 140,
        height: 80,
        color: '#8B5CF6',
        inputs: [
          { id: 'input1', type: 'main' as const, label: 'Processed Data', connected: true },
          { id: 'input2', type: 'main' as const, label: 'Error Log', connected: true }
        ],
        outputs: [{ id: 'main', type: 'main' as const, label: 'Final Output', connected: true }],
        parameters: {
          mergeStrategy: 'combine',
          mergeKey: 'data_type',
          notes: 'Combines processed data with error logs for complete output'
        },
        data: {}
      },
      {
        id: 'template-export-api',
        type: 'http_request',
        name: 'Export to API',
        x: 1350,
        y: 100,
        width: 140,
        height: 80,
        color: '#06B6D4',
        inputs: [{ id: 'main', type: 'main' as const, label: 'Input', connected: true }],
        outputs: [{ id: 'main', type: 'main' as const, label: 'Response', connected: false }],
        parameters: {
          url: 'https://your-data-api.com/processed-data',
          method: 'POST',
          headers: '{"Content-Type": "application/json", "X-Data-Source": "workflow-processor"}',
          body: '{{input}}',
          notes: 'Exports processed data to your data warehouse or API'
        },
        data: {}
      }
    ],
    connections: [
      {
        id: 'conn-data-1',
        sourceNodeId: 'template-json-input',
        sourcePortId: 'main',
        targetNodeId: 'template-data-validator',
        targetPortId: 'main',
        type: 'main'
      },
      {
        id: 'conn-data-2',
        sourceNodeId: 'template-data-validator',
        sourcePortId: 'pass',
        targetNodeId: 'template-active-filter',
        targetPortId: 'main',
        type: 'main'
      },
      {
        id: 'conn-data-3',
        sourceNodeId: 'template-active-filter',
        sourcePortId: 'pass',
        targetNodeId: 'template-data-enrichment',
        targetPortId: 'main',
        type: 'main'
      },
      {
        id: 'conn-data-4',
        sourceNodeId: 'template-data-validator',
        sourcePortId: 'fail',
        targetNodeId: 'template-error-handler',
        targetPortId: 'main',
        type: 'main'
      },
      {
        id: 'conn-data-5',
        sourceNodeId: 'template-data-enrichment',
        sourcePortId: 'main',
        targetNodeId: 'template-final-merge',
        targetPortId: 'input1',
        type: 'main'
      },
      {
        id: 'conn-data-6',
        sourceNodeId: 'template-error-handler',
        sourcePortId: 'main',
        targetNodeId: 'template-final-merge',
        targetPortId: 'input2',
        type: 'main'
      },
      {
        id: 'conn-data-7',
        sourceNodeId: 'template-final-merge',
        sourcePortId: 'main',
        targetNodeId: 'template-export-api',
        targetPortId: 'main',
        type: 'main'
      }
    ]
  },

  // AI Model Comparison Template
  {
    id: 'ai-model-comparison',
    name: 'Multi-Model AI Comparison',
    description: 'Compare responses from multiple AI models for the same prompt to find the best solution.',
    category: 'AI Processing',
    difficulty: 'Advanced',
    estimatedTime: '15-20 min',
    tags: ['AI', 'Comparison', 'Multi-Model', 'Analysis'],
    preview: {
      nodeCount: 8,
      connectionCount: 7
    },
    defaultViewport: { x: 20, y: 40 },
    defaultZoom: 0.6,
    nodes: [
      {
        id: 'template-prompt-input',
        type: 'text_input',
        name: 'Prompt Input',
        x: 100,
        y: 200,
        width: 140,
        height: 80,
        color: '#10B981',
        inputs: [],
        outputs: [{ id: 'main', type: 'main' as const, label: 'Prompt', connected: true }],
        parameters: {
          jsonData: '{"prompt": "Write a creative short story about a robot discovering emotions for the first time.", "context": "Creative writing task", "evaluation_criteria": ["creativity", "emotional_depth", "narrative_structure", "originality"]}',
          notes: 'Input your prompt and evaluation criteria here'
        },
        data: {}
      },
      {
        id: 'template-claude-response',
        type: 'claude',
        name: 'Claude Response',
        x: 400,
        y: 100,
        width: 140,
        height: 80,
        color: '#FF6B35',
        inputs: [{ id: 'main', type: 'main' as const, label: 'Input', connected: true }],
        outputs: [{ id: 'main', type: 'main' as const, label: 'Response', connected: true }],
        parameters: {
          systemPrompt: 'You are a creative writing expert. Focus on emotional depth and narrative structure.',
          userPrompt: '{{input.prompt}}',
          temperature: 0.8,
          maxTokens: 1000,
          notes: 'Claude - Known for thoughtful and nuanced responses'
        },
        data: {}
      },
      {
        id: 'template-gpt4-response',
        type: 'gpt4',
        name: 'GPT-4 Response',
        x: 400,
        y: 200,
        width: 140,
        height: 80,
        color: '#10B981',
        inputs: [{ id: 'main', type: 'main' as const, label: 'Input', connected: true }],
        outputs: [{ id: 'main', type: 'main' as const, label: 'Response', connected: true }],
        parameters: {
          systemPrompt: 'You are a skilled storyteller. Emphasize creativity and originality.',
          userPrompt: '{{input.prompt}}',
          temperature: 0.8,
          maxTokens: 1000,
          notes: 'GPT-4 - Strong creative and analytical capabilities'
        },
        data: {}
      },
      {
        id: 'template-gemini-response',
        type: 'gemini',
        name: 'Gemini Response',
        x: 400,
        y: 300,
        width: 140,
        height: 80,
        color: '#3B82F6',
        inputs: [{ id: 'main', type: 'main' as const, label: 'Input', connected: true }],
        outputs: [{ id: 'main', type: 'main' as const, label: 'Response', connected: true }],
        parameters: {
          systemPrompt: 'You are an innovative writer. Focus on unique perspectives and detailed descriptions.',
          userPrompt: '{{input.prompt}}',
          temperature: 0.8,
          maxTokens: 1000,
          notes: 'Gemini - Google\'s multimodal AI with creative strengths'
        },
        data: {}
      },
      {
        id: 'template-response-merger',
        type: 'merge_data',
        name: 'Collect Responses',
        x: 700,
        y: 200,
        width: 140,
        height: 80,
        color: '#8B5CF6',
        inputs: [
          { id: 'input1', type: 'main' as const, label: 'Claude', connected: true },
          { id: 'input2', type: 'main' as const, label: 'GPT-4', connected: true },
          { id: 'input3', type: 'main' as const, label: 'Gemini', connected: true }
        ],
        outputs: [{ id: 'main', type: 'main' as const, label: 'All Responses', connected: true }],
        parameters: {
          mergeStrategy: 'combine',
          mergeKey: 'model_name',
          notes: 'Collects all AI model responses for comparison'
        },
        data: {}
      },
      {
        id: 'template-evaluator',
        type: 'claude',
        name: 'Response Evaluator',
        x: 1000,
        y: 200,
        width: 140,
        height: 80,
        color: '#F59E0B',
        inputs: [{ id: 'main', type: 'main' as const, label: 'Input', connected: true }],
        outputs: [{ id: 'main', type: 'main' as const, label: 'Evaluation', connected: true }],
        parameters: {
          systemPrompt: 'You are an expert evaluator. Analyze and compare AI responses objectively across multiple criteria.',
          userPrompt: 'Evaluate these AI responses based on: creativity, emotional depth, narrative structure, and originality. Provide scores (1-10) and detailed feedback for each. Original prompt: {{input.original_prompt}}. Responses: {{input.responses}}',
          temperature: 0.3,
          maxTokens: 1500,
          notes: 'Objective evaluation of all responses with scoring'
        },
        data: {}
      },
      {
        id: 'template-report-generator',
        type: 'json_transform',
        name: 'Comparison Report',
        x: 1300,
        y: 200,
        width: 140,
        height: 80,
        color: '#6366F1',
        inputs: [{ id: 'main', type: 'main' as const, label: 'Input', connected: true }],
        outputs: [{ id: 'main', type: 'main' as const, label: 'Final Report', connected: false }],
        parameters: {
          expression: `{
  "comparison_id": "{{$uuid}}",
  "timestamp": "{{$now}}",
  "original_prompt": "{{input.prompt}}",
  "models_compared": ["Claude", "GPT-4", "Gemini"],
  "evaluation_results": "{{input.evaluation}}",
  "winner": "{{input.top_performer}}",
  "scores": {
    "claude": "{{input.claude_score}}",
    "gpt4": "{{input.gpt4_score}}",
    "gemini": "{{input.gemini_score}}"
  },
  "recommendations": "{{input.recommendations}}",
  "full_responses": "{{input.all_responses}}"
}`,
          outputFormat: 'json',
          notes: 'Generates comprehensive comparison report with rankings'
        },
        data: {}
      }
    ],
    connections: [
      {
        id: 'conn-comp-1',
        sourceNodeId: 'template-prompt-input',
        sourcePortId: 'main',
        targetNodeId: 'template-claude-response',
        targetPortId: 'main',
        type: 'main'
      },
      {
        id: 'conn-comp-2',
        sourceNodeId: 'template-prompt-input',
        sourcePortId: 'main',
        targetNodeId: 'template-gpt4-response',
        targetPortId: 'main',
        type: 'main'
      },
      {
        id: 'conn-comp-3',
        sourceNodeId: 'template-prompt-input',
        sourcePortId: 'main',
        targetNodeId: 'template-gemini-response',
        targetPortId: 'main',
        type: 'main'
      },
      {
        id: 'conn-comp-4',
        sourceNodeId: 'template-claude-response',
        sourcePortId: 'main',
        targetNodeId: 'template-response-merger',
        targetPortId: 'input1',
        type: 'main'
      },
      {
        id: 'conn-comp-5',
        sourceNodeId: 'template-gpt4-response',
        sourcePortId: 'main',
        targetNodeId: 'template-response-merger',
        targetPortId: 'input2',
        type: 'main'
      },
      {
        id: 'conn-comp-6',
        sourceNodeId: 'template-gemini-response',
        sourcePortId: 'main',
        targetNodeId: 'template-response-merger',
        targetPortId: 'input3',
        type: 'main'
      },
      {
        id: 'conn-comp-7',
        sourceNodeId: 'template-response-merger',
        sourcePortId: 'main',
        targetNodeId: 'template-evaluator',
        targetPortId: 'main',
        type: 'main'
      },
      {
        id: 'conn-comp-8',
        sourceNodeId: 'template-evaluator',
        sourcePortId: 'main',
        targetNodeId: 'template-report-generator',
        targetPortId: 'main',
        type: 'main'
      }
    ]
  }
];

export const getTemplatesByCategory = (category?: string) => {
  if (!category) return workflowTemplates;
  return workflowTemplates.filter(template => template.category === category);
};

export const getTemplateById = (id: string) => {
  return workflowTemplates.find(template => template.id === id);
};

export const getTemplateCategories = () => {
  return [...new Set(workflowTemplates.map(template => template.category))];
};