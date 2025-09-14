import { FILE_EXTENSIONS } from '../utils/constants';
import { FileService } from './fileService';
import type { WorkflowData, WorkflowState } from '../types/workflow';

export class WorkflowService {
  /**
   * Save workflow to JSON file
   */
  static async saveWorkflow(
    workflowName: string,
    workflowState: WorkflowState
  ): Promise<void> {
    try {
      const workflowData: WorkflowData = {
        name: workflowName,
        nodes: workflowState.nodes,
        connections: workflowState.connections,
        viewport: workflowState.viewport,
        zoom: workflowState.zoom,
        timestamp: new Date().toISOString()
      };

      const dataStr = JSON.stringify(workflowData, null, 2);
      const filename = `${workflowName.replace(/\s+/g, '_')}_workflow${FILE_EXTENSIONS.WORKFLOW}`;

      FileService.downloadFile(dataStr, filename, 'application/json');
    } catch (error) {
      console.error('Failed to save workflow:', error);
      throw new Error('Failed to save workflow');
    }
  }

  /**
   * Load workflow from JSON file
   */
  static async loadWorkflow(): Promise<WorkflowData | null> {
    try {
      const file = await FileService.openFilePicker(FILE_EXTENSIONS.WORKFLOW);
      if (!file) return null;

      const content = await FileService.readFileAsText(file);
      const workflowData: WorkflowData = JSON.parse(content);

      // Validate workflow data structure
      if (!this.isValidWorkflowData(workflowData)) {
        throw new Error('Invalid workflow file format');
      }

      return workflowData;
    } catch (error) {
      console.error('Failed to load workflow:', error);
      throw new Error('Failed to load workflow. Please check the file format.');
    }
  }

  /**
   * Validate workflow data structure
   */
  private static isValidWorkflowData(data: any): data is WorkflowData {
    return (
      data &&
      typeof data === 'object' &&
      Array.isArray(data.nodes) &&
      Array.isArray(data.connections) &&
      data.viewport &&
      typeof data.zoom === 'number'
    );
  }

  /**
   * Generate workflow export configuration
   */
  static generateWorkflowConfig(workflowState: WorkflowState): object {
    return {
      nodes: workflowState.nodes.length,
      connections: workflowState.connections.length,
      workflow: workflowState
    };
  }

  /**
   * Validate workflow before execution
   */
  static validateWorkflow(workflowState: WorkflowState): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (workflowState.nodes.length === 0) {
      errors.push('Workflow must contain at least one node');
    }

    // Check for disconnected required inputs
    const nodesWithRequiredInputs = workflowState.nodes.filter(node =>
      node.inputs.some(input => !input.connected)
    );

    if (nodesWithRequiredInputs.length > 0) {
      errors.push('Some nodes have unconnected required inputs');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}