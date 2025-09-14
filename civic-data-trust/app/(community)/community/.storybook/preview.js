import '../styles/globals.css'; // Adjust path to your global styles
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { workflowSlice } from '../../../store/workflowSlice';

// Create a mock store for Storybook
const mockStore = configureStore({
  reducer: {
    workflow: workflowSlice.reducer,
  },
  preloadedState: {
    workflow: {
      nodes: [],
      connections: [],
      viewport: { x: 0, y: 0 },
      zoom: 1,
    },
  },
});

// Global decorator for Redux Provider
export const decorators = [
  (Story) => (
    <Provider store={mockStore}>
      <div className="p-4">
        <Story />
      </div>
    </Provider>
  ),
];

// Storybook parameters
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: 'light',
    values: [
      {
        name: 'light',
        value: '#ffffff',
      },
      {
        name: 'dark',
        value: '#1f2937',
      },
    ],
  },
  docs: {
    source: {
      state: 'open',
    },
  },
  viewport: {
    viewports: {
      mobile: {
        name: 'Mobile',
        styles: {
          width: '375px',
          height: '667px',
        },
      },
      tablet: {
        name: 'Tablet',
        styles: {
          width: '768px',
          height: '1024px',
        },
      },
      desktop: {
        name: 'Desktop',
        styles: {
          width: '1200px',
          height: '800px',
        },
      },
    },
  },
};