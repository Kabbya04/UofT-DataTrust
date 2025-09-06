import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NodePort {
  id: string;
  type: 'main' | 'data' | 'condition';
  label?: string;
  connected?: boolean;
}

export interface NodeData {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  parameters?: Record<string, any>;
  inputs?: NodePort[];
  outputs?: NodePort[];
  data?: any;
}

export interface Connection {
  id: string;
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
  type: 'main' | 'data' | 'condition';
}

export interface WorkflowState {
  nodes: NodeData[];
  connections: Connection[];
  selectedNodeIds: string[];
  zoom: number;
  viewport: { x: number; y: number };
  isConnecting: boolean;
  connectingFrom: { nodeId: string; portId: string } | null;
  connectionLineStyle: 'solid' | 'dotted';
}

const initialState: WorkflowState = {
  nodes: [],
  connections: [],
  selectedNodeIds: [],
  zoom: 1,
  viewport: { x: 0, y: 0 },
  isConnecting: false,
  connectingFrom: null,
  connectionLineStyle: 'solid',
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    addNode: (state, action: PayloadAction<NodeData>) => {
      state.nodes.push(action.payload);
    },
    updateNode: (state, action: PayloadAction<{ id: string; updates: Partial<NodeData> }>) => {
      const node = state.nodes.find(n => n.id === action.payload.id);
      if (node) {
        Object.assign(node, action.payload.updates);
      }
    },
    deleteNode: (state, action: PayloadAction<string>) => {
      state.nodes = state.nodes.filter(n => n.id !== action.payload);
      state.connections = state.connections.filter(
        c => c.sourceNodeId !== action.payload && c.targetNodeId !== action.payload
      );
    },
    addConnection: (state, action: PayloadAction<Connection>) => {
      state.connections.push(action.payload);
      
      // Update port connection status
      const sourceNode = state.nodes.find(n => n.id === action.payload.sourceNodeId);
      const targetNode = state.nodes.find(n => n.id === action.payload.targetNodeId);
      
      if (sourceNode?.outputs) {
        const outputPort = sourceNode.outputs.find(p => p.id === action.payload.sourcePortId);
        if (outputPort) outputPort.connected = true;
      }
      
      if (targetNode?.inputs) {
        const inputPort = targetNode.inputs.find(p => p.id === action.payload.targetPortId);
        if (inputPort) inputPort.connected = true;
      }
    },
    deleteConnection: (state, action: PayloadAction<string>) => {
      const connection = state.connections.find(c => c.id === action.payload);
      if (connection) {
        // Update port connection status
        const sourceNode = state.nodes.find(n => n.id === connection.sourceNodeId);
        const targetNode = state.nodes.find(n => n.id === connection.targetNodeId);
        
        if (sourceNode?.outputs) {
          const outputPort = sourceNode.outputs.find(p => p.id === connection.sourcePortId);
          if (outputPort) {
            const hasOtherConnections = state.connections.some(
              c => c.id !== action.payload && 
                   c.sourceNodeId === connection.sourceNodeId && 
                   c.sourcePortId === connection.sourcePortId
            );
            if (!hasOtherConnections) outputPort.connected = false;
          }
        }
        
        if (targetNode?.inputs) {
          const inputPort = targetNode.inputs.find(p => p.id === connection.targetPortId);
          if (inputPort) {
            const hasOtherConnections = state.connections.some(
              c => c.id !== action.payload && 
                   c.targetNodeId === connection.targetNodeId && 
                   c.targetPortId === connection.targetPortId
            );
            if (!hasOtherConnections) inputPort.connected = false;
          }
        }
      }
      
      state.connections = state.connections.filter(c => c.id !== action.payload);
    },
    setSelectedNodes: (state, action: PayloadAction<string[]>) => {
      state.selectedNodeIds = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = Math.max(0.1, Math.min(2, action.payload));
    },
    setViewport: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.viewport = action.payload;
    },
    startConnecting: (state, action: PayloadAction<{ nodeId: string; portId: string }>) => {
      state.isConnecting = true;
      state.connectingFrom = action.payload;
    },
    endConnecting: (state) => {
      state.isConnecting = false;
      state.connectingFrom = null;
    },
    setConnectionLineStyle: (state, action: PayloadAction<'solid' | 'dotted'>) => {
      state.connectionLineStyle = action.payload;
    },
  },
});

export const {
  addNode,
  updateNode,
  deleteNode,
  addConnection,
  deleteConnection,
  setSelectedNodes,
  setZoom,
  setViewport,
  startConnecting,
  endConnecting,
  setConnectionLineStyle,
} = workflowSlice.actions;

export default workflowSlice.reducer;