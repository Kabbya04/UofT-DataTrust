export interface WorkflowNode {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  inputs: WorkflowInput[];
  outputs: WorkflowOutput[];
  parameters?: Record<string, any>;
  data?: any;
}

export interface WorkflowInput {
  id: string;
  type: 'main' | 'data' | 'condition';
  label: string;
  connected: boolean;
}

export interface WorkflowOutput {
  id: string;
  type: 'main' | 'data' | 'condition';
  label: string;
  connected: boolean;
}

export interface WorkflowConnection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourceOutputId: string;
  targetInputId: string;
}

export interface WorkflowState {
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  viewport: { x: number; y: number };
  zoom: number;
}

export interface WorkflowData {
  name: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  viewport: { x: number; y: number };
  zoom: number;
  timestamp: string;
}

export type TabType = 'data' | 'templates' | 'info';