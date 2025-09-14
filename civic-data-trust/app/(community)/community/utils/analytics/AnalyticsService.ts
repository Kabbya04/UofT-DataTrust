import type {
  NonEmptyString,
  Timestamp,
  PositiveNumber,
  StrictPerformanceMetric,
  StrictRenderPerformance
} from '../../types/strict';

interface AnalyticsEvent {
  readonly name: NonEmptyString;
  readonly properties: Record<string, unknown>;
  readonly timestamp: Timestamp;
  readonly sessionId: NonEmptyString;
  readonly userId?: NonEmptyString;
}

interface AnalyticsConfig {
  readonly enabled: boolean;
  readonly apiKey?: NonEmptyString;
  readonly endpoint?: string;
  readonly sampleRate: number; // 0-1
  readonly flushInterval: PositiveNumber;
  readonly maxBatchSize: PositiveNumber;
}

class AnalyticsService {
  private config: AnalyticsConfig;
  private sessionId: NonEmptyString;
  private eventQueue: AnalyticsEvent[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private isInitialized = false;

  constructor() {
    this.config = {
      enabled: process.env.NODE_ENV === 'production',
      sampleRate: 1.0,
      flushInterval: 5000 as PositiveNumber,
      maxBatchSize: 50 as PositiveNumber,
    };
    this.sessionId = this.generateSessionId();
  }

  initialize(config: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...config };
    this.isInitialized = true;

    if (this.config.enabled) {
      this.startFlushTimer();
      this.trackPageView();
    }
  }

  // Track user interactions
  track(eventName: NonEmptyString, properties: Record<string, unknown> = {}): void {
    if (!this.shouldTrack()) return;

    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString() as Timestamp,
      },
      timestamp: new Date().toISOString() as Timestamp,
      sessionId: this.sessionId,
    };

    this.enqueueEvent(event);
  }

  // Track component usage
  trackComponentUsage(componentName: NonEmptyString, action: string, properties: Record<string, unknown> = {}): void {
    this.track(`component_${action}` as NonEmptyString, {
      component: componentName,
      ...properties,
    });
  }

  // Track performance metrics
  trackPerformance(metric: StrictPerformanceMetric): void {
    if (!this.shouldTrack()) return;

    this.track('performance_metric' as NonEmptyString, {
      metricName: metric.name,
      value: metric.value,
      unit: metric.unit,
      ...metric.context,
    });
  }

  // Track render performance
  trackRenderPerformance(performance: StrictRenderPerformance): void {
    if (!this.shouldTrack()) return;

    // Only track slow renders to avoid noise
    if (performance.renderTime > 16) { // 16ms = 60fps threshold
      this.track('slow_render' as NonEmptyString, {
        component: performance.componentName,
        renderTime: performance.renderTime,
        updateCount: performance.updateCount,
        propsKeys: Object.keys(performance.props),
      });
    }
  }

  // Track errors
  trackError(error: Error, context: Record<string, unknown> = {}): void {
    if (!this.shouldTrack()) return;

    this.track('error_occurred' as NonEmptyString, {
      errorMessage: error.message,
      errorStack: error.stack,
      errorName: error.name,
      ...context,
    });
  }

  // Track user flows
  trackFlow(flowName: NonEmptyString, step: NonEmptyString, properties: Record<string, unknown> = {}): void {
    this.track('flow_step' as NonEmptyString, {
      flow: flowName,
      step,
      ...properties,
    });
  }

  // Track feature usage
  trackFeatureUsage(featureName: NonEmptyString, action: 'enabled' | 'disabled' | 'used', properties: Record<string, unknown> = {}): void {
    this.track('feature_usage' as NonEmptyString, {
      feature: featureName,
      action,
      ...properties,
    });
  }

  // Track API calls
  trackApiCall(endpoint: string, method: string, duration: number, status: number): void {
    this.track('api_call' as NonEmptyString, {
      endpoint,
      method,
      duration,
      status,
      success: status >= 200 && status < 300,
    });
  }

  // Manually flush events
  flush(): Promise<void> {
    return this.flushEvents();
  }

  // Clean up resources
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flushEvents();
  }

  private shouldTrack(): boolean {
    return (
      this.isInitialized &&
      this.config.enabled &&
      Math.random() < this.config.sampleRate
    );
  }

  private generateSessionId(): NonEmptyString {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` as NonEmptyString;
  }

  private trackPageView(): void {
    this.track('page_view' as NonEmptyString, {
      path: window.location.pathname,
      referrer: document.referrer,
      title: document.title,
    });
  }

  private enqueueEvent(event: AnalyticsEvent): void {
    this.eventQueue.push(event);

    if (this.eventQueue.length >= this.config.maxBatchSize) {
      this.flushEvents();
    }
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flushEvents();
    }, this.config.flushInterval);
  }

  private async flushEvents(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const events = this.eventQueue.splice(0);

    try {
      await this.sendEvents(events);
    } catch (error) {
      console.warn('Failed to send analytics events:', error);
      // Re-queue events for retry (with limit to avoid infinite growth)
      if (this.eventQueue.length < 1000) {
        this.eventQueue.unshift(...events.slice(0, 100));
      }
    }
  }

  private async sendEvents(events: AnalyticsEvent[]): Promise<void> {
    if (!this.config.endpoint || !this.config.apiKey) {
      // In development, just log events
      if (process.env.NODE_ENV === 'development') {
        console.log('Analytics Events:', events);
      }
      return;
    }

    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        events,
        metadata: {
          sessionId: this.sessionId,
          timestamp: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Analytics API error: ${response.status}`);
    }
  }
}

// Create singleton instance
export const analytics = new AnalyticsService();

// React hook for component analytics
export function useAnalytics() {
  return {
    track: analytics.track.bind(analytics),
    trackComponentUsage: analytics.trackComponentUsage.bind(analytics),
    trackPerformance: analytics.trackPerformance.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackFlow: analytics.trackFlow.bind(analytics),
    trackFeatureUsage: analytics.trackFeatureUsage.bind(analytics),
  };
}

// HOC for automatic component tracking
export function withAnalytics<T extends React.ComponentType<any>>(
  Component: T,
  componentName: NonEmptyString
): T {
  const WrappedComponent = React.forwardRef<any, React.ComponentProps<T>>((props, ref) => {
    React.useEffect(() => {
      analytics.trackComponentUsage(componentName, 'mount');
      return () => {
        analytics.trackComponentUsage(componentName, 'unmount');
      };
    }, []);

    return <Component {...props} ref={ref} />;
  });

  WrappedComponent.displayName = `withAnalytics(${componentName})`;
  return WrappedComponent as T;
}

export default analytics;