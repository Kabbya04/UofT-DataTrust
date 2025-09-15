import type {
  NonEmptyString,
  PositiveNumber
} from '../../types/strict';
import { createTimestamp } from '../../types/strict';
import type {
  StrictPerformanceMetric,
  StrictRenderPerformance
} from '../../types/enhanced';
import { analytics } from '../analytics/AnalyticsService';

interface PerformanceEntry {
  name: NonEmptyString;
  startTime: number;
  duration: number;
  entries: Record<string, unknown>;
}

interface MemoryUsage {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface NetworkInfo {
  effectiveType: string;
  downlink: number;
  rtt: number;
}

class PerformanceMonitor {
  private measurements = new Map<string, number>();
  private observers: PerformanceObserver[] = [];
  private memoryInterval: NodeJS.Timeout | null = null;
  private vitalsReported = false;

  initialize(): void {
    if (typeof window === 'undefined') return;

    this.setupPerformanceObservers();
    this.startMemoryMonitoring();
    this.trackWebVitals();
    this.setupUnloadHandler();
  }

  // Start measuring performance
  startMeasure(name: NonEmptyString): void {
    if (typeof performance !== 'undefined') {
      this.measurements.set(name, performance.now());
    }
  }

  // End measuring and optionally track
  endMeasure(name: NonEmptyString, autoTrack = true): number {
    const startTime = this.measurements.get(name);
    if (!startTime || typeof performance === 'undefined') return 0;

    const duration = performance.now() - startTime;
    this.measurements.delete(name);

    if (autoTrack) {
      this.trackMetric({
        name,
        value: duration as PositiveNumber,
        unit: 'ms',
        timestamp: createTimestamp(new Date().toISOString()),
        context: {},
      });
    }

    return duration;
  }

  // Measure async operations
  async measureAsync<T>(
    name: NonEmptyString,
    operation: () => Promise<T>,
    context: Record<string, unknown> = {}
  ): Promise<T> {
    const startTime = performance.now();

    try {
      const result = await operation();
      const duration = performance.now() - startTime;

      this.trackMetric({
        name,
        value: duration as PositiveNumber,
        unit: 'ms',
        timestamp: createTimestamp(new Date().toISOString()),
        context: { ...context, success: true },
      });

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;

      this.trackMetric({
        name,
        value: duration as PositiveNumber,
        unit: 'ms',
        timestamp: createTimestamp(new Date().toISOString()),
        context: { ...context, success: false, error: (error as Error).message },
      });

      throw error;
    }
  }

  // Track component render performance
  trackRenderPerformance(performance: StrictRenderPerformance): void {
    // Track in analytics
    analytics.trackRenderPerformance(performance);

    // Also track as metric
    this.trackMetric({
      name: `render_${performance.componentName}` as NonEmptyString,
      value: performance.renderTime,
      unit: 'ms',
      timestamp: performance.timestamp,
      context: {
        component: performance.componentName,
        updateCount: performance.updateCount,
      },
    });

    // Warn about slow renders in development
    if (process.env.NODE_ENV === 'development' && performance.renderTime > 100) {
      console.warn(
        `🐌 Slow render detected: ${performance.componentName} took ${performance.renderTime.toFixed(2)}ms`,
        { props: performance.props }
      );
    }
  }

  // Get current memory usage
  getMemoryUsage(): MemoryUsage | null {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      };
    }
    return null;
  }

  // Get network information
  getNetworkInfo(): NetworkInfo | null {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
      };
    }
    return null;
  }

  // Track performance metric
  private trackMetric(metric: StrictPerformanceMetric): void {
    analytics.trackPerformance(metric);

    // Log performance issues in development
    if (process.env.NODE_ENV === 'development') {
      if (metric.unit === 'ms' && metric.value > 100) {
        console.warn(`⚠️ Performance warning: ${metric.name} took ${metric.value}ms`);
      }
    }
  }

  private setupPerformanceObservers(): void {
    if (typeof PerformanceObserver === 'undefined') return;

    // Observe navigation timing
    try {
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.trackNavigationMetrics(navEntry);
          }
        }
      });
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);
    } catch (error) {
      console.warn('Failed to setup navigation observer:', error);
    }

    // Observe resource timing
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            this.trackResourceTiming(entry as PerformanceResourceTiming);
          }
        }
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    } catch (error) {
      console.warn('Failed to setup resource observer:', error);
    }

    // Observe long tasks
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.trackMetric({
            name: 'long_task' as NonEmptyString,
            value: entry.duration as PositiveNumber,
            unit: 'ms',
            timestamp: createTimestamp(new Date().toISOString()),
            context: {
              startTime: entry.startTime,
              name: entry.name,
            },
          });
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);
    } catch (error) {
      console.warn('Failed to setup long task observer:', error);
    }
  }

  private trackNavigationMetrics(entry: PerformanceNavigationTiming): void {
    const metrics = [
      { name: 'dns_lookup', value: entry.domainLookupEnd - entry.domainLookupStart },
      { name: 'tcp_connect', value: entry.connectEnd - entry.connectStart },
      { name: 'request_response', value: entry.responseEnd - entry.requestStart },
      { name: 'dom_processing', value: entry.domComplete - entry.domContentLoadedEventStart },
      { name: 'page_load', value: entry.loadEventEnd - entry.fetchStart },
    ];

    metrics.forEach(metric => {
      if (metric.value > 0) {
        this.trackMetric({
          name: metric.name as NonEmptyString,
          value: metric.value as PositiveNumber,
          unit: 'ms',
          timestamp: createTimestamp(new Date().toISOString()),
          context: { type: 'navigation' },
        });
      }
    });
  }

  private trackResourceTiming(entry: PerformanceResourceTiming): void {
    // Only track slow resources to avoid noise
    if (entry.duration > 1000) {
      this.trackMetric({
        name: 'slow_resource' as NonEmptyString,
        value: entry.duration as PositiveNumber,
        unit: 'ms',
        timestamp: createTimestamp(new Date().toISOString()),
        context: {
          url: entry.name,
          initiatorType: entry.initiatorType,
          transferSize: entry.transferSize,
        },
      });
    }
  }

  private startMemoryMonitoring(): void {
    if (typeof window === 'undefined' || !('memory' in performance)) return;

    this.memoryInterval = setInterval(() => {
      const memory = this.getMemoryUsage();
      if (memory) {
        this.trackMetric({
          name: 'memory_usage' as NonEmptyString,
          value: memory.usedJSHeapSize as PositiveNumber,
          unit: 'bytes',
          timestamp: createTimestamp(new Date().toISOString()),
          context: {
            totalHeapSize: memory.totalJSHeapSize,
            heapSizeLimit: memory.jsHeapSizeLimit,
            usagePercentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
          },
        });
      }
    }, 30000); // Every 30 seconds
  }

  private trackWebVitals(): void {
    if (this.vitalsReported || typeof window === 'undefined') return;

    // Track First Contentful Paint
    if ('getEntriesByName' in performance) {
      const fcpEntries = performance.getEntriesByName('first-contentful-paint');
      if (fcpEntries.length > 0) {
        this.trackMetric({
          name: 'first_contentful_paint' as NonEmptyString,
          value: fcpEntries[0].startTime as PositiveNumber,
          unit: 'ms',
          timestamp: createTimestamp(new Date().toISOString()),
          context: { vital: 'FCP' },
        });
      }
    }

    this.vitalsReported = true;
  }

  private setupUnloadHandler(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
  }

  cleanup(): void {
    // Clear observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];

    // Clear intervals
    if (this.memoryInterval) {
      clearInterval(this.memoryInterval);
      this.memoryInterval = null;
    }

    // Clear measurements
    this.measurements.clear();
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export function usePerformanceMonitor() {
  return {
    startMeasure: performanceMonitor.startMeasure.bind(performanceMonitor),
    endMeasure: performanceMonitor.endMeasure.bind(performanceMonitor),
    measureAsync: performanceMonitor.measureAsync.bind(performanceMonitor),
    trackRenderPerformance: performanceMonitor.trackRenderPerformance.bind(performanceMonitor),
    getMemoryUsage: performanceMonitor.getMemoryUsage.bind(performanceMonitor),
    getNetworkInfo: performanceMonitor.getNetworkInfo.bind(performanceMonitor),
  };
}

export default performanceMonitor;