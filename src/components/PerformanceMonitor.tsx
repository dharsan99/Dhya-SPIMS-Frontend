import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development or when explicitly enabled
    if (process.env.NODE_ENV === 'development' || localStorage.getItem('showPerformance') === 'true') {
      setIsVisible(true);
    }

    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcp = entries[entries.length - 1];
        if (fcp) {
          setMetrics(prev => ({ ...prev, fcp: fcp.startTime }));
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcp = entries[entries.length - 1];
        if (lcp) {
          setMetrics(prev => ({ ...prev, lcp: lcp.startTime }));
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fid = entries[entries.length - 1];
        // Type guard for PerformanceEventTiming
        if (fid && 'processingStart' in fid && typeof (fid as any).processingStart === 'number') {
          setMetrics(prev => ({ ...prev, fid: ((fid as any).processingStart - fid.startTime) }));
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          // Type guard for LayoutShift
          if ('hadRecentInput' in entry && !(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        setMetrics(prev => ({ ...prev, cls: clsValue }));
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Time to First Byte
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        setMetrics(prev => ({ ...prev, ttfb: navigationEntry.responseStart - navigationEntry.requestStart }));
      }

      return () => {
        fcpObserver.disconnect();
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    }
  }, []);

  if (!isVisible) return null;

  const getScore = (metric: keyof PerformanceMetrics, value: number): string => {
    const thresholds: Record<keyof PerformanceMetrics, { good: number; needsImprovement: number }> = {
      fcp: { good: 1800, needsImprovement: 3000 },
      lcp: { good: 2500, needsImprovement: 4000 },
      fid: { good: 100, needsImprovement: 300 },
      cls: { good: 0.1, needsImprovement: 0.25 },
      ttfb: { good: 800, needsImprovement: 1800 },
    };

    const threshold = thresholds[metric];
    if (value <= threshold.good) return '🟢 Good';
    if (value <= threshold.needsImprovement) return '🟡 Needs Improvement';
    return '🔴 Poor';
  };

  const formatMetric = (metric: keyof PerformanceMetrics, value: number): string => {
    if (metric === 'cls') return value.toFixed(3);
    return `${Math.round(value)}ms`;
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-w-xs">
      <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">
        Performance Metrics
      </h3>
      {Object.keys(metrics).length > 0 ? (
        <div className="space-y-1 text-xs">
          {Object.entries(metrics).map(([key, value]) => (
            value !== undefined && (
              <div key={key} className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 uppercase font-medium">
                  {key}:
                </span>
                <div className="text-right">
                  <div className="text-gray-900 dark:text-white font-mono">
                    {formatMetric(key as keyof PerformanceMetrics, value)}
                  </div>
                  <div className="text-xs">
                    {getScore(key as keyof PerformanceMetrics, value)}
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      ) : (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Loading metrics...
        </div>
      )}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
      >
        ×
      </button>
    </div>
  );
};

export default PerformanceMonitor; 