import { NodeData, Connection } from '../store/workflowSlice';
import { toast } from 'react-hot-toast';

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  warningMessage?: string;
}

export interface NodeValidationService {
  validateConnection(connection: Connection, nodes: NodeData[], connections: Connection[]): ValidationResult;
  validateMergeNodeConnections(nodeId: string, nodes: NodeData[], connections: Connection[]): ValidationResult;
}

class NodeValidationServiceImpl implements NodeValidationService {
  /**
   * Validates a new connection before it's added to the workflow
   */
  validateConnection(connection: Connection, nodes: NodeData[], connections: Connection[]): ValidationResult {
    const targetNode = nodes.find(n => n.id === connection.targetNodeId);
    
    if (!targetNode) {
      return {
        isValid: false,
        errorMessage: 'Target node not found'
      };
    }

    // Special validation for merge nodes
    if (targetNode.type === 'merge') {
      return this.validateMergeNodeConnection(connection, targetNode, connections);
    }

    // Add other node type validations here as needed
    return { isValid: true };
  }

  /**
   * Validates connections specifically for merge nodes
   */
  private validateMergeNodeConnection(connection: Connection, mergeNode: NodeData, connections: Connection[]): ValidationResult {
    // Count existing connections to this merge node
    const existingConnections = connections.filter(
      c => c.targetNodeId === mergeNode.id
    );

    // Check if trying to connect to a port that already has a connection
    const portAlreadyConnected = existingConnections.some(
      c => c.targetPortId === connection.targetPortId
    );

    if (portAlreadyConnected) {
      return {
        isValid: false,
        errorMessage: `Input port '${connection.targetPortId}' is already connected`
      };
    }

    // Check if merge node already has 2 connections
    if (existingConnections.length >= 2) {
      return {
        isValid: false,
        errorMessage: 'Merge nodes can only have exactly 2 input connections. Remove an existing connection first.'
      };
    }

    // Validate that connections are going to the correct input ports
    const validInputPorts = ['input1', 'input2'];
    if (!validInputPorts.includes(connection.targetPortId)) {
      return {
        isValid: false,
        errorMessage: `Invalid input port '${connection.targetPortId}'. Merge nodes only accept connections to 'input1' and 'input2'.`
      };
    }

    return { isValid: true };
  }

  /**
   * Validates the current state of connections for a merge node
   */
  validateMergeNodeConnections(nodeId: string, nodes: NodeData[], connections: Connection[]): ValidationResult {
    const mergeNode = nodes.find(n => n.id === nodeId);
    
    if (!mergeNode || mergeNode.type !== 'merge') {
      return {
        isValid: false,
        errorMessage: 'Node is not a merge node'
      };
    }

    const nodeConnections = connections.filter(c => c.targetNodeId === nodeId);
    
    if (nodeConnections.length === 0) {
      return {
        isValid: false,
        errorMessage: 'Merge node requires exactly 2 input connections',
        warningMessage: 'Connect both input1 and input2 to proceed'
      };
    }

    if (nodeConnections.length === 1) {
      const connectedPort = nodeConnections[0].targetPortId;
      const missingPort = connectedPort === 'input1' ? 'input2' : 'input1';
      
      return {
        isValid: false,
        errorMessage: 'Merge node requires exactly 2 input connections',
        warningMessage: `Connect '${missingPort}' to complete the merge configuration`
      };
    }

    if (nodeConnections.length > 2) {
      return {
        isValid: false,
        errorMessage: 'Merge node has too many connections. Remove excess connections.'
      };
    }

    // Check that both required ports are connected
    const connectedPorts = nodeConnections.map(c => c.targetPortId);
    const hasInput1 = connectedPorts.includes('input1');
    const hasInput2 = connectedPorts.includes('input2');

    if (!hasInput1 || !hasInput2) {
      const missingPorts = [];
      if (!hasInput1) missingPorts.push('input1');
      if (!hasInput2) missingPorts.push('input2');
      
      return {
        isValid: false,
        errorMessage: `Missing connections to required ports: ${missingPorts.join(', ')}`
      };
    }

    return { isValid: true };
  }

  /**
   * Shows appropriate error messages using toast notifications
   */
  showValidationError(result: ValidationResult): void {
    if (!result.isValid && result.errorMessage) {
      toast.error(result.errorMessage);
    }
    
    if (result.warningMessage) {
      toast.error(result.warningMessage, {
        duration: 4000,
        icon: '⚠️'
      });
    }
  }

  /**
   * Validates all merge nodes in the workflow
   */
  validateAllMergeNodes(nodes: NodeData[], connections: Connection[]): ValidationResult[] {
    const mergeNodes = nodes.filter(n => n.type === 'merge');
    
    return mergeNodes.map(node => 
      this.validateMergeNodeConnections(node.id, nodes, connections)
    );
  }

  /**
   * Gets a summary of validation issues for the entire workflow
   */
  getWorkflowValidationSummary(nodes: NodeData[], connections: Connection[]): {
    isValid: boolean;
    issues: string[];
    warnings: string[];
  } {
    const mergeValidations = this.validateAllMergeNodes(nodes, connections);
    const issues: string[] = [];
    const warnings: string[] = [];

    mergeValidations.forEach((validation, index) => {
      if (!validation.isValid) {
        if (validation.errorMessage) {
          issues.push(`Merge Node ${index + 1}: ${validation.errorMessage}`);
        }
        if (validation.warningMessage) {
          warnings.push(`Merge Node ${index + 1}: ${validation.warningMessage}`);
        }
      }
    });

    return {
      isValid: issues.length === 0,
      issues,
      warnings
    };
  }
}

// Export singleton instance
export const nodeValidationService = new NodeValidationServiceImpl();

// Export utility functions for easy use
export const validateMergeConnection = (
  connection: Connection, 
  nodes: NodeData[], 
  connections: Connection[]
): ValidationResult => {
  return nodeValidationService.validateConnection(connection, nodes, connections);
};

export const validateMergeNode = (
  nodeId: string, 
  nodes: NodeData[], 
  connections: Connection[]
): ValidationResult => {
  return nodeValidationService.validateMergeNodeConnections(nodeId, nodes, connections);
};

export const showValidationError = (result: ValidationResult): void => {
  nodeValidationService.showValidationError(result);
};