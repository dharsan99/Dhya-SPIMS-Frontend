import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface PerformanceMetrics {
  renderTime: number;
  scrollFPS: number;
  preloadHitRate: number;
  memoryUsage: number;
  cacheSize: number;
  predictionAccuracy: number;
}

interface PerformanceMonitorProps {
  isVisible?: boolean;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  className?: string;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  isVisible = false,
  onMetricsUpdate,
  className = ''
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    scrollFPS: 0,
    preloadHitRate: 0,
    memoryUsage: 0,
    cacheSize: 0,
    predictionAccuracy: 0
  });



  // Measure memory usage
  const measureMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setMetrics(prev => ({
        ...prev,
        memoryUsage: memory.usedJSHeapSize / 1024 / 1024 // Convert to MB
      }));
    }
  }, []);

  // Notify parent of metrics update
  useEffect(() => {
    onMetricsUpdate?.(metrics);
  }, [metrics, onMetricsUpdate]);

  // Periodic memory measurement
  useEffect(() => {
    const interval = setInterval(measureMemoryUsage, 5000);
    return () => clearInterval(interval);
  }, [measureMemoryUsage]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 bg-black/90 text-white p-4 rounded-lg shadow-lg z-50 ${className}`}
    >
      <h3 className="text-sm font-semibold mb-3">Performance Monitor</h3>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span>Render Time:</span>
          <span className={metrics.renderTime > 16 ? 'text-red-400' : 'text-green-400'}>
            {metrics.renderTime.toFixed(2)}ms
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Scroll FPS:</span>
          <span className={metrics.scrollFPS < 30 ? 'text-red-400' : 'text-green-400'}>
            {metrics.scrollFPS}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Preload Hit Rate:</span>
          <span className={metrics.preloadHitRate < 50 ? 'text-red-400' : 'text-green-400'}>
            {metrics.preloadHitRate.toFixed(1)}%
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Memory Usage:</span>
          <span className={metrics.memoryUsage > 100 ? 'text-red-400' : 'text-green-400'}>
            {metrics.memoryUsage.toFixed(1)}MB
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Cache Size:</span>
          <span className="text-blue-400">
            {metrics.cacheSize}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Prediction Accuracy:</span>
          <span className={metrics.predictionAccuracy < 70 ? 'text-red-400' : 'text-green-400'}>
            {metrics.predictionAccuracy.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Performance indicators */}
      <div className="mt-3 space-y-1">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            metrics.renderTime <= 16 ? 'bg-green-400' : 'bg-red-400'
          }`} />
          <span className="text-xs">Render Performance</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            metrics.scrollFPS >= 30 ? 'bg-green-400' : 'bg-red-400'
          }`} />
          <span className="text-xs">Scroll Performance</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            metrics.preloadHitRate >= 50 ? 'bg-green-400' : 'bg-red-400'
          }`} />
          <span className="text-xs">Preload Efficiency</span>
        </div>
      </div>
    </motion.div>
  );
};

// Hook for performance monitoring
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    scrollFPS: 0,
    preloadHitRate: 0,
    memoryUsage: 0,
    cacheSize: 0,
    predictionAccuracy: 0
  });

  const measureRenderTime = useCallback(() => {
    const start = performance.now();
    return () => {
      const end = performance.now();
      setMetrics(prev => ({
        ...prev,
        renderTime: end - start
      }));
    };
  }, []);

  const trackPreloadHit = useCallback((_hit: boolean) => {
    // Implementation for tracking preload hits
  }, []);

  const trackPrediction = useCallback((_predicted: boolean, _actual: boolean) => {
    // Implementation for tracking predictions
  }, []);

  return {
    metrics,
    measureRenderTime,
    trackPreloadHit,
    trackPrediction
  };
} 