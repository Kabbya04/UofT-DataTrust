import React, { useState, useEffect } from 'react';
import { ComponentErrorBoundary } from './ComponentErrorBoundary';

interface AsyncErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  componentName?: string;
}

/**
 * Error boundary that also catches async errors and promise rejections
 */
export function AsyncErrorBoundary({ children, fallback, componentName }: AsyncErrorBoundaryProps) {
  const [asyncError, setAsyncError] = useState<Error | null>(null);

  useEffect(() => {
    // Catch unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection in', componentName, event.reason);
      setAsyncError(new Error(event.reason));
      event.preventDefault();
    };

    // Catch uncaught errors
    const handleError = (event: ErrorEvent) => {
      console.error('Uncaught error in', componentName, event.error);
      setAsyncError(event.error);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, [componentName]);

  // If we caught an async error, throw it to be caught by the error boundary
  if (asyncError) {
    throw asyncError;
  }

  return (
    <ComponentErrorBoundary fallback={fallback} componentName={componentName}>
      {children}
    </ComponentErrorBoundary>
  );
}

// Hook for handling async errors in components
export function useAsyncError() {
  const [, setError] = useState();

  return (error: Error) => {
    setError(() => {
      throw error;
    });
  };
}