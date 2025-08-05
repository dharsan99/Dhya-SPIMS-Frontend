import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VirtualScroll } from './VirtualScroll';
import { SmartScrollDetector, useSmartScrollDetection } from './SmartScrollDetector';
import { usePredictiveLoading } from '../hooks/usePredictiveLoading';

interface VirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number, isPreloaded: boolean) => React.ReactNode;
  loadItem: (item: T) => Promise<any>;
  getItemId: (item: T) => string;
  overscan?: number;
  className?: string;
  skeletonComponent?: React.ReactNode;
  enablePrediction?: boolean;
  enableSmartScroll?: boolean;
}

export function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  loadItem,
  getItemId,
  overscan = 5,
  className = '',
  skeletonComponent,
  enablePrediction = true,
  enableSmartScroll = true
}: VirtualListProps<T>) {

  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Smart scroll detection
  const {
    currentPrediction,
    isScrolling,
    handleScrollPattern,
    handlePrediction,
    handleScrollStart,
    handleScrollEnd
  } = useSmartScrollDetection();

  // Predictive loading
  const {
    updateVisibleRange,
    predictPreloadItems,
    getPreloadedData,
    isItemPreloaded,
    isItemLoading,
    getItemError,
    forcePreload
  } = usePredictiveLoading(items, getItemId, loadItem, {
    preloadThreshold: currentPrediction?.willScrollDown ? 3 : 2,
    maxPreloadItems: (currentPrediction?.confidence ?? 0) > 0.8 ? 8 : 5,
    preloadDelay: isScrolling ? 50 : 200
  });

  // Enhanced visible range calculation with prediction
  const enhancedVisibleRange = useMemo(() => {
    let start = Math.floor(scrollTop / itemHeight);
    let end = Math.min(
      start + Math.ceil(height / itemHeight) + overscan,
      items.length
    );

    // Adjust range based on scroll prediction
    if (currentPrediction?.willScrollDown && currentPrediction.confidence > 0.7) {
      end = Math.min(end + 2, items.length);
    } else if (currentPrediction?.willScrollUp && currentPrediction.confidence > 0.7) {
      start = Math.max(0, start - 2);
    }

    return {
      start: Math.max(0, start - overscan),
      end
    };
  }, [scrollTop, height, itemHeight, overscan, items.length, currentPrediction]);

  // Update visible range and trigger prediction
  useEffect(() => {
    updateVisibleRange(enhancedVisibleRange.start, enhancedVisibleRange.end);
    
    if (enablePrediction) {
      predictPreloadItems();
    }
  }, [enhancedVisibleRange, updateVisibleRange, predictPreloadItems, enablePrediction]);

  // Handle scroll with enhanced tracking
  const handleScroll = useCallback((scrollTop: number) => {
    setScrollTop(scrollTop);
  }, []);

  // Get visible items with preload status
  const visibleItems = useMemo(() => {
    return items.slice(enhancedVisibleRange.start, enhancedVisibleRange.end).map((item, index) => {
      const actualIndex = enhancedVisibleRange.start + index;
      const id = getItemId(item);
      return {
        item,
        index: actualIndex,
        id,
        isPreloaded: isItemPreloaded(id),
        isLoading: isItemLoading(id),
        error: getItemError(id),
        preloadedData: getPreloadedData(id)
      };
    });
  }, [items, enhancedVisibleRange, getItemId, isItemPreloaded, isItemLoading, getItemError, getPreloadedData]);

  // Force preload based on prediction
  useEffect(() => {
    if (enablePrediction && currentPrediction) {
      const itemsToPreload: string[] = [];
      
      if (currentPrediction.willScrollDown) {
        // Preload items below current range
        for (let i = enhancedVisibleRange.end; i < Math.min(enhancedVisibleRange.end + 3, items.length); i++) {
          const id = getItemId(items[i]);
          if (!isItemPreloaded(id) && !isItemLoading(id)) {
            itemsToPreload.push(id);
          }
        }
      } else if (currentPrediction.willScrollUp) {
        // Preload items above current range
        for (let i = Math.max(0, enhancedVisibleRange.start - 3); i < enhancedVisibleRange.start; i++) {
          const id = getItemId(items[i]);
          if (!isItemPreloaded(id) && !isItemLoading(id)) {
            itemsToPreload.push(id);
          }
        }
      }

      if (itemsToPreload.length > 0) {
        forcePreload(itemsToPreload);
      }
    }
  }, [currentPrediction, enhancedVisibleRange, items, getItemId, isItemPreloaded, isItemLoading, forcePreload, enablePrediction]);

  // Render item with enhanced features
  const renderEnhancedItem = useCallback((item: T, index: number, isPreloaded: boolean) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ 
          duration: 0.3,
          delay: isPreloaded ? 0 : 0.1 * (index % 5) // Staggered animation for non-preloaded items
        }}
        className={`virtual-list-item ${isPreloaded ? 'preloaded' : ''}`}
      >
        {renderItem(item, index, isPreloaded)}
      </motion.div>
    );
  }, [renderItem]);

  // Calculate total height
  const totalHeight = items.length * itemHeight;

  return (
    <div className={`virtual-list ${className}`}>
      {enableSmartScroll ? (
        <SmartScrollDetector
          onScrollPattern={handleScrollPattern}
          onPrediction={handlePrediction}
          onScrollStart={handleScrollStart}
          onScrollEnd={handleScrollEnd}
        >
          <div
            ref={containerRef}
            className="overflow-auto"
            style={{ height }}
            onScroll={(e) => handleScroll(e.currentTarget.scrollTop)}
          >
            <div style={{ height: totalHeight, position: 'relative' }}>
              <AnimatePresence>
                {visibleItems.map(({ item, index, id, isPreloaded, isLoading, error }) => (
                  <motion.div
                    key={id}
                    style={{
                      height: itemHeight,
                      position: 'absolute',
                      top: index * itemHeight,
                      left: 0,
                      right: 0
                    }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        {skeletonComponent || (
                          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4 w-32"></div>
                        )}
                      </div>
                    ) : error ? (
                      <div className="flex items-center justify-center h-full text-red-500 text-sm">
                        Failed to load
                      </div>
                    ) : (
                      renderEnhancedItem(item, index, isPreloaded)
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </SmartScrollDetector>
      ) : (
        <VirtualScroll
          items={items}
          height={height}
          itemHeight={itemHeight}
          renderItem={(item, index) => renderEnhancedItem(item, index, isItemPreloaded(getItemId(item)))}
          overscan={overscan}
          className={className}
          onScroll={handleScroll}
          skeletonComponent={skeletonComponent}
        />
      )}

      {/* Debug info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs">
          <div>Items: {items.length}</div>
          <div>Visible: {visibleItems.length}</div>
          <div>Preloaded: {visibleItems.filter(v => v.isPreloaded).length}</div>
          <div>Loading: {visibleItems.filter(v => v.isLoading).length}</div>
          <div>Prediction: {currentPrediction?.willScrollDown ? 'Down' : currentPrediction?.willScrollUp ? 'Up' : 'Idle'}</div>
          <div>Confidence: {currentPrediction?.confidence.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
} 