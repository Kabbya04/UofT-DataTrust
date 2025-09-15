import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNode, setViewport, setZoom } from '../../../store/workflowSlice';
import { WorkflowService } from '../services/workflowService';
import type { RootState } from '../../../store';
import type { WorkflowData, TabType } from '../types/workflow';

export const useWorkflow = () => {
  const dispatch = useDispatch();
  const workflowState = useSelector((state: RootState) => state.workflow);

  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [activeTab, setActiveTab] = useState<TabType>('data');

  const saveWorkflow = useCallback(async () => {
    try {
      await WorkflowService.saveWorkflow(workflowName, workflowState as any);
      return true;
    } catch (error) {
      console.error('Failed to save workflow:', error);
      alert('Failed to save workflow. Please try again.');
      return false;
    }
  }, [workflowName, workflowState]);

  const loadWorkflow = useCallback(async () => {
    try {
      const workflowData = await WorkflowService.loadWorkflow();
      if (!workflowData) return false; // User cancelled

      // Clear existing workflow
      const currentNodes = workflowState.nodes;
      currentNodes.forEach(node => {
        dispatch({ type: 'workflow/deleteNode', payload: node.id });
      });

      // Load new workflow data
      workflowData.nodes.forEach((node) => {
        dispatch(addNode(node));
      });

      workflowData.connections.forEach((connection) => {
        dispatch({ type: 'workflow/addConnection', payload: connection });
      });

      // Set viewport and zoom
      if (workflowData.viewport) {
        dispatch(setViewport(workflowData.viewport));
      }
      if (workflowData.zoom) {
        dispatch(setZoom(workflowData.zoom));
      }

      setWorkflowName(workflowData.name || 'Imported Workflow');
      return true;
    } catch (error) {
      console.error('Failed to load workflow:', error);
      alert(error instanceof Error ? error.message : 'Failed to load workflow');
      return false;
    }
  }, [dispatch, workflowState.nodes]);

  const clearWorkflow = useCallback(() => {
    const confirmClear = confirm('Are you sure you want to clear the entire workflow?');
    if (!confirmClear) return false;

    try {
      // Clear all nodes
      const currentNodes = workflowState.nodes;
      currentNodes.forEach(node => {
        dispatch({ type: 'workflow/deleteNode', payload: node.id });
      });

      // Reset viewport and zoom
      dispatch(setViewport({ x: 0, y: 0 }));
      dispatch(setZoom(1));

      setWorkflowName('Untitled Workflow');
      return true;
    } catch (error) {
      console.error('Failed to clear workflow:', error);
      return false;
    }
  }, [dispatch, workflowState.nodes]);

  const testWorkflow = useCallback(() => {
    const config = WorkflowService.generateWorkflowConfig(workflowState as any);
    const validation = WorkflowService.validateWorkflow(workflowState as any);

    console.log('Testing workflow with configuration:', config);
    console.log('Validation result:', validation);

    if (!validation.isValid) {
      alert(`Workflow validation failed:\n${validation.errors.join('\n')}`);
      return false;
    }

    alert('Test run initiated! Check console for workflow configuration.');
    return true;
  }, [workflowState]);

  const getWorkflowStats = useCallback(() => {
    return {
      nodeCount: workflowState.nodes.length,
      connectionCount: workflowState.connections.length,
      isValid: WorkflowService.validateWorkflow(workflowState as any).isValid
    };
  }, [workflowState]);

  return {
    // State
    workflowState,
    workflowName,
    activeTab,

    // Actions
    setWorkflowName,
    setActiveTab,
    saveWorkflow,
    loadWorkflow,
    clearWorkflow,
    testWorkflow,
    getWorkflowStats,

    // Redux dispatch for direct node operations
    dispatch
  };
};