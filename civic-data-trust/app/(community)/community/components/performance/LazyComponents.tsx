import React, { Suspense } from 'react';
import { ComponentErrorBoundary } from '../error-boundaries';

// Lazy load heavy components
export const LazyWorkflowCanvas = React.lazy(() =>
  import('../WorkflowCanvas').then(module => ({ default: module.default }))
);

export const LazyPluginLibrary = React.lazy(() =>
  import('../PluginLibrary').then(module => ({ default: module.default }))
);

export const LazyTemplatePanel = React.lazy(() =>
  import('../TemplatePanel').then(module => ({ default: module.default }))
);

export const LazyEDAResultsModal = React.lazy(() =>
  import('../EDAResultsModal').then(module => ({ default: module.default }))
);

export const LazyNodeConfigPanel = React.lazy(() =>
  import('../NodeConfigPanel').then(module => ({ default: module.default }))
);

// Loading component for Suspense
export function ComponentLoader({ name = 'component' }: { name?: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading {name}...</p>
      </div>
    </div>
  );
}

// HOC for wrapping lazy components with error boundary and suspense
export function withLazyLoading<T extends React.ComponentType<any>>(
  Component: React.LazyExoticComponent<T>,
  componentName: string,
  fallback?: React.ReactNode
) {
  return React.forwardRef<any, React.ComponentProps<T>>((props, ref) => (
    <ComponentErrorBoundary componentName={componentName}>
      <Suspense fallback={fallback || <ComponentLoader name={componentName} />}>
        <Component {...props} ref={ref} />
      </Suspense>
    </ComponentErrorBoundary>
  ));
}

// Pre-wrapped lazy components ready to use
export const WorkflowCanvas = withLazyLoading(LazyWorkflowCanvas, 'WorkflowCanvas');
export const PluginLibrary = withLazyLoading(LazyPluginLibrary, 'PluginLibrary');
export const TemplatePanel = withLazyLoading(LazyTemplatePanel, 'TemplatePanel');
export const EDAResultsModal = withLazyLoading(LazyEDAResultsModal, 'EDAResultsModal');
export const NodeConfigPanel = withLazyLoading(LazyNodeConfigPanel, 'NodeConfigPanel');