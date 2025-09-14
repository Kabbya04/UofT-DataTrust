import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { workflowSlice } from '../../../store/workflowSlice';

// Create a test store
function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      workflow: workflowSlice.reducer,
    },
    preloadedState,
  });
}

// Custom render function with Redux provider
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: any;
  store?: ReturnType<typeof createTestStore>;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

// Mock API responses
export const mockApiResponses = {
  notebook: {
    start: {
      status: 'started',
      url: 'http://localhost:8888/lab',
    },
    checkFiles: {
      has_files: false,
      file_count: 0,
    },
    cleanup: {
      status: 'success',
      files_removed: 0,
    },
  },
  csv: {
    upload: {
      success: true,
      shape: [100, 5] as [number, number],
      columns: ['col1', 'col2', 'col3', 'col4', 'col5'],
      summary: { mean: 10, std: 5 },
    },
  },
};

// Mock workflow data
export const mockWorkflowData = {
  nodes: [
    {
      id: 'node-1',
      type: 'csv_input',
      name: 'CSV Input',
      x: 100,
      y: 100,
      width: 140,
      height: 80,
      color: '#8B5CF6',
      inputs: [],
      outputs: [{ id: 'main', type: 'main', label: 'CSV Data', connected: false }],
      parameters: {},
      data: {},
    },
  ],
  connections: [],
  viewport: { x: 0, y: 0 },
  zoom: 1,
};

// Test data generators
export const createMockNode = (overrides = {}) => ({
  id: `node-${Date.now()}`,
  type: 'test_node',
  name: 'Test Node',
  x: 100,
  y: 100,
  width: 140,
  height: 80,
  color: '#000000',
  inputs: [],
  outputs: [],
  parameters: {},
  data: {},
  ...overrides,
});

export const createMockWorkflowState = (overrides = {}) => ({
  nodes: [],
  connections: [],
  viewport: { x: 0, y: 0 },
  zoom: 1,
  ...overrides,
});

// Helper to wait for async operations
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock file for testing file upload
export const createMockFile = (name: string, content: string, type: string = 'text/plain') => {
  const file = new File([content], name, { type });
  Object.defineProperty(file, 'size', { value: content.length });
  return file;
};

// Helper to simulate user file selection
export const simulateFileUpload = (input: HTMLInputElement, file: File) => {
  Object.defineProperty(input, 'files', {
    value: [file],
    writable: false,
  });

  const event = new Event('change', { bubbles: true });
  input.dispatchEvent(event);
};

export * from '@testing-library/react';
export { renderWithProviders as render };