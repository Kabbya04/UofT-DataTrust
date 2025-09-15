export enum NodeTypes {
  // AI Models
  CLAUDE = 'claude',
  GPT4 = 'gpt4',
  GEMINI = 'gemini',
  MISTRAL = 'mistral',
  LLAMA = 'llama',
  
  // Data Transformation
  JSON_TRANSFORM = 'json_transform',
  MERGE_DATA = 'merge_data',
  SPLIT_DATA = 'split_data',
  FILTER = 'filter',
  
  // API
  HTTP_REQUEST = 'http_request',
  WEBHOOK = 'webhook',
  
  // Logic
  IF_CONDITION = 'if_condition',
  IF_BRANCH = 'if_branch',
  SWITCH = 'switch',
  LOOP = 'loop',
  SPLIT = 'split',
  MERGE = 'merge',
  
  // Utility
  IMAGE_INPUT = 'image_input',
  TEXT_INPUT = 'text_input',
  OUTPUT = 'output',
}

export type PortType = 'csv' | 'json' | 'image' | 'any' | 'control';

export interface NodeData {
  status: 'idle' | 'processing' | 'success' | 'error';
  error?: string;
  outputData?: string;
}

export interface NodeDefinition {
  type: NodeTypes;
  name: string;
  icon: React.ReactNode;
  color: string;
  category: 'ai' | 'data' | 'api' | 'logic' | 'utility';
  inputs: PortDefinition[];
  outputs: PortDefinition[];
  parameters?: ParameterDefinition[];
}

export interface NodePort {
  id: string;
  type: PortType;
  label: string;
  multiple?: boolean;
}

export interface PortDefinition {
  id: string;
  type: 'main' | 'data' | 'condition';
  label: string;
  multiple?: boolean;
}

export interface ParameterDefinition {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'json';
  defaultValue?: any;
  options?: { label: string; value: any }[];
}