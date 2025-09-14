import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ComponentErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  componentName?: string;
}

interface ComponentErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ComponentErrorBoundary extends React.Component<
  ComponentErrorBoundaryProps,
  ComponentErrorBoundaryState
> {
  constructor(props: ComponentErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): Partial<ComponentErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error in ${this.props.componentName || 'Component'}:`, error);
    console.error('Error info:', errorInfo);

    // Report to error tracking service (e.g., Sentry)
    this.reportError(error, errorInfo);

    this.setState({
      error,
      errorInfo
    });
  }

  private reportError = (error: Error, errorInfo: React.ErrorInfo) => {
    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
      console.error('Production error reported:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
    }
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            {this.props.componentName || 'Component'} Error
          </h3>
          <p className="text-red-700 text-center mb-4">
            Something went wrong with this component. Please try again.
          </p>

          {/* Error details in development */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mb-4 p-4 bg-red-100 rounded border text-sm">
              <summary className="cursor-pointer font-medium text-red-800">
                Error Details
              </summary>
              <pre className="mt-2 text-red-700 whitespace-pre-wrap">
                {this.state.error.message}
              </pre>
              {this.state.error.stack && (
                <pre className="mt-2 text-red-600 text-xs whitespace-pre-wrap">
                  {this.state.error.stack}
                </pre>
              )}
            </details>
          )}

          <div className="flex gap-2">
            <button
              onClick={this.handleRetry}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={this.handleReload}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}