import { nodeValidationService } from '../nodeValidation';
import { NodeData, Connection } from '../../store/workflowSlice';

// Mock toast to avoid dependency issues in tests
jest.mock('react-hot-toast', () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe('NodeValidationService', () => {
  const mockMergeNode: NodeData = {
    id: 'merge-1',
    type: 'merge',
    name: 'Merge Node',
    x: 100,
    y: 100,
    width: 140,
    height: 80,
    inputs: [
      { id: 'input1', type: 'data', label: 'CSV Input 1' },
      { id: 'input2', type: 'data', label: 'CSV Input 2' }
    ],
    outputs: [
      { id: 'output', type: 'data', label: 'Merged CSV' }
    ]
  };

  const mockSourceNode: NodeData = {
    id: 'source-1',
    type: 'csv_input',
    name: 'CSV Source',
    x: 50,
    y: 50,
    width: 140,
    height: 80,
    outputs: [
      { id: 'output', type: 'data', label: 'CSV Data' }
    ]
  };

  describe('validateConnection', () => {
    it('should allow valid connection to merge node input1', () => {
      const connection: Connection = {
        id: 'conn-1',
        sourceNodeId: 'source-1',
        sourcePortId: 'output',
        targetNodeId: 'merge-1',
        targetPortId: 'input1',
        type: 'data'
      };

      const result = nodeValidationService.validateConnection(
        connection,
        [mockMergeNode, mockSourceNode],
        []
      );

      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBeUndefined();
    });

    it('should allow valid connection to merge node input2', () => {
      const connection: Connection = {
        id: 'conn-2',
        sourceNodeId: 'source-1',
        sourcePortId: 'output',
        targetNodeId: 'merge-1',
        targetPortId: 'input2',
        type: 'data'
      };

      const result = nodeValidationService.validateConnection(
        connection,
        [mockMergeNode, mockSourceNode],
        []
      );

      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBeUndefined();
    });

    it('should reject connection to invalid port', () => {
      const connection: Connection = {
        id: 'conn-invalid',
        sourceNodeId: 'source-1',
        sourcePortId: 'output',
        targetNodeId: 'merge-1',
        targetPortId: 'invalid-port',
        type: 'data'
      };

      const result = nodeValidationService.validateConnection(
        connection,
        [mockMergeNode, mockSourceNode],
        []
      );

      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('Invalid input port');
    });

    it('should reject third connection to merge node', () => {
      const existingConnections: Connection[] = [
        {
          id: 'conn-1',
          sourceNodeId: 'source-1',
          sourcePortId: 'output',
          targetNodeId: 'merge-1',
          targetPortId: 'input1',
          type: 'data'
        },
        {
          id: 'conn-2',
          sourceNodeId: 'source-1',
          sourcePortId: 'output',
          targetNodeId: 'merge-1',
          targetPortId: 'input2',
          type: 'data'
        }
      ];

      const newConnection: Connection = {
        id: 'conn-3',
        sourceNodeId: 'source-1',
        sourcePortId: 'output',
        targetNodeId: 'merge-1',
        targetPortId: 'input1',
        type: 'data'
      };

      const result = nodeValidationService.validateConnection(
        newConnection,
        [mockMergeNode, mockSourceNode],
        existingConnections
      );

      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('can only have exactly 2 input connections');
    });

    it('should reject connection to already connected port', () => {
      const existingConnections: Connection[] = [
        {
          id: 'conn-1',
          sourceNodeId: 'source-1',
          sourcePortId: 'output',
          targetNodeId: 'merge-1',
          targetPortId: 'input1',
          type: 'data'
        }
      ];

      const newConnection: Connection = {
        id: 'conn-2',
        sourceNodeId: 'source-1',
        sourcePortId: 'output',
        targetNodeId: 'merge-1',
        targetPortId: 'input1',
        type: 'data'
      };

      const result = nodeValidationService.validateConnection(
        newConnection,
        [mockMergeNode, mockSourceNode],
        existingConnections
      );

      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('already connected');
    });
  });

  describe('validateMergeNodeConnections', () => {
    it('should validate merge node with no connections', () => {
      const result = nodeValidationService.validateMergeNodeConnections(
        'merge-1',
        [mockMergeNode],
        []
      );

      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('requires exactly 2 input connections');
    });

    it('should validate merge node with one connection', () => {
      const connections: Connection[] = [
        {
          id: 'conn-1',
          sourceNodeId: 'source-1',
          sourcePortId: 'output',
          targetNodeId: 'merge-1',
          targetPortId: 'input1',
          type: 'data'
        }
      ];

      const result = nodeValidationService.validateMergeNodeConnections(
        'merge-1',
        [mockMergeNode],
        connections
      );

      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('requires exactly 2 input connections');
      expect(result.warningMessage).toContain('Connect \'input2\'');
    });

    it('should validate merge node with correct connections', () => {
      const connections: Connection[] = [
        {
          id: 'conn-1',
          sourceNodeId: 'source-1',
          sourcePortId: 'output',
          targetNodeId: 'merge-1',
          targetPortId: 'input1',
          type: 'data'
        },
        {
          id: 'conn-2',
          sourceNodeId: 'source-1',
          sourcePortId: 'output',
          targetNodeId: 'merge-1',
          targetPortId: 'input2',
          type: 'data'
        }
      ];

      const result = nodeValidationService.validateMergeNodeConnections(
        'merge-1',
        [mockMergeNode],
        connections
      );

      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBeUndefined();
    });

    it('should validate merge node with too many connections', () => {
      const connections: Connection[] = [
        {
          id: 'conn-1',
          sourceNodeId: 'source-1',
          sourcePortId: 'output',
          targetNodeId: 'merge-1',
          targetPortId: 'input1',
          type: 'data'
        },
        {
          id: 'conn-2',
          sourceNodeId: 'source-1',
          sourcePortId: 'output',
          targetNodeId: 'merge-1',
          targetPortId: 'input2',
          type: 'data'
        },
        {
          id: 'conn-3',
          sourceNodeId: 'source-1',
          sourcePortId: 'output',
          targetNodeId: 'merge-1',
          targetPortId: 'input1',
          type: 'data'
        }
      ];

      const result = nodeValidationService.validateMergeNodeConnections(
        'merge-1',
        [mockMergeNode],
        connections
      );

      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('too many connections');
    });
  });

  describe('getWorkflowValidationSummary', () => {
    it('should return valid summary for properly connected merge nodes', () => {
      const connections: Connection[] = [
        {
          id: 'conn-1',
          sourceNodeId: 'source-1',
          sourcePortId: 'output',
          targetNodeId: 'merge-1',
          targetPortId: 'input1',
          type: 'data'
        },
        {
          id: 'conn-2',
          sourceNodeId: 'source-1',
          sourcePortId: 'output',
          targetNodeId: 'merge-1',
          targetPortId: 'input2',
          type: 'data'
        }
      ];

      const summary = nodeValidationService.getWorkflowValidationSummary(
        [mockMergeNode, mockSourceNode],
        connections
      );

      expect(summary.isValid).toBe(true);
      expect(summary.issues).toHaveLength(0);
      expect(summary.warnings).toHaveLength(0);
    });

    it('should return invalid summary for improperly connected merge nodes', () => {
      const summary = nodeValidationService.getWorkflowValidationSummary(
        [mockMergeNode, mockSourceNode],
        []
      );

      expect(summary.isValid).toBe(false);
      expect(summary.issues.length).toBeGreaterThan(0);
      expect(summary.issues[0]).toContain('Merge Node 1');
    });
  });
});