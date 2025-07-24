import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VirtualScrollProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
  onScroll?: (scrollTop: number) => void;
  loading?: boolean;
  skeletonComponent?: React.ReactNode;
}

export function VirtualScroll<T>({
  items,
  height,
  itemHeight,
  renderItem,
  overscan = 5,
  className = '',
  onScroll,
  loading = false,
  skeletonComponent
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      start + Math.ceil(height / itemHeight) + overscan,
      items.length
    );
    return {
      start: Math.max(0, start - overscan),
      end
    };
  }, [scrollTop, height, itemHeight, overscan, items.length]);

  // Calculate total height
  const totalHeight = items.length * itemHeight;

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
    onScroll?.(newScrollTop);
  }, [onScroll]);



  // Get visible items
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({
      item,
      index: visibleRange.start + index
    }));
  }, [items, visibleRange]);

  // Calculate transform offset
  const transformOffset = visibleRange.start * itemHeight;

  return (
    <div className={`virtual-scroll ${className}`}>
      <div
        ref={containerRef}
        className="overflow-auto"
        style={{ height }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {loading ? (
            <div style={{ transform: `translateY(${transformOffset}px)` }}>
              {Array.from({ length: Math.ceil(height / itemHeight) + overscan * 2 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  style={{
                    height: itemHeight,
                    position: 'absolute',
                    top: index * itemHeight,
                    left: 0,
                    right: 0
                  }}
                >
                  {skeletonComponent}
                </div>
              ))}
            </div>
          ) : (
            <AnimatePresence>
              {visibleItems.map(({ item, index }) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    height: itemHeight,
                    position: 'absolute',
                    top: index * itemHeight,
                    left: 0,
                    right: 0
                  }}
                >
                  {renderItem(item, index)}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

// Hook for virtual scroll utilities
export function useVirtualScroll() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleScroll = useCallback((scrollTop: number) => {
    setScrollPosition(scrollTop);
    setIsScrolling(true);

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set timeout to mark scrolling as stopped
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, []);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    scrollPosition,
    isScrolling,
    handleScroll
  };
} 