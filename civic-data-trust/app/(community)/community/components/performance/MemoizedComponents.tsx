import React from 'react';

// Performance optimized versions of our components with React.memo

// Memoized data source cards (prevent re-renders when data hasn't changed)
export const MemoizedImageDataCard = React.memo(
  React.lazy(() => import('../data-sources/ImageDataCard')),
  (prevProps, nextProps) => {
    return prevProps.isDarkMode === nextProps.isDarkMode;
  }
);

export const MemoizedJsonDataCard = React.memo(
  React.lazy(() => import('../data-sources/JsonDataCard')),
  (prevProps, nextProps) => {
    return prevProps.isDarkMode === nextProps.isDarkMode;
  }
);

export const MemoizedCsvDataCard = React.memo(
  React.lazy(() => import('../data-sources/CsvDataCard')),
  (prevProps, nextProps) => {
    return prevProps.isDarkMode === nextProps.isDarkMode;
  }
);

export const MemoizedDatabaseCard = React.memo(
  React.lazy(() => import('../data-sources/DatabaseCard'))
);

// Memoized workflow components
export const MemoizedWorkflowStats = React.memo(
  React.lazy(() => import('../workflow/WorkflowStats'))
);

export const MemoizedWorkflowManagement = React.memo(
  React.lazy(() => import('../workflow/WorkflowManagement'))
);

// Memoized notebook components
export const MemoizedNotebookView = React.memo(
  React.lazy(() => import('../notebook/NotebookView')),
  (prevProps, nextProps) => {
    return (
      prevProps.loading === nextProps.loading &&
      prevProps.url === nextProps.url
    );
  }
);

// Custom hook for performance monitoring
export function usePerformanceMonitor(componentName: string) {
  React.useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      if (renderTime > 100) { // Log slow renders
        console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }

      // In production, you might want to send this to analytics
      if (process.env.NODE_ENV === 'production' && renderTime > 200) {
        // Analytics.track('slow_component_render', {
        //   component: componentName,
        //   renderTime: renderTime
        // });
      }
    };
  });
}

// Higher-order component for performance monitoring
export function withPerformanceMonitoring<T extends React.ComponentType<any>>(
  Component: T,
  componentName: string
): T {
  const WrappedComponent = React.forwardRef<any, React.ComponentProps<T>>((props, ref) => {
    usePerformanceMonitor(componentName);
    return <Component {...props} ref={ref} />;
  });

  WrappedComponent.displayName = `withPerformanceMonitoring(${componentName})`;

  return WrappedComponent as T;
}