import { useState, useEffect, useRef, useCallback } from 'react';

interface PredictiveItem {
  id: string;
  priority: number;
  isPreloaded: boolean;
  isLoading: boolean;
  data: any;
  error: string | null;
}

interface PredictiveLoadingConfig {
  preloadThreshold: number; // Distance from viewport to start preloading
  maxPreloadItems: number; // Maximum items to preload
  preloadDelay: number; // Delay before starting preload
  priorityWeights: Record<string, number>; // Priority weights for different content types
}

export function usePredictiveLoading<T>(
  items: T[],
  getItemId: (item: T) => string,
  loadItem: (item: T) => Promise<any>,
  config: Partial<PredictiveLoadingConfig> = {}
) {
  const {
    preloadThreshold = 2, // Preload 2 items ahead
    maxPreloadItems = 5,
    preloadDelay = 100,
    priorityWeights = { default: 1, high: 2, low: 0.5 }
  } = config;

  const [predictiveItems, setPredictiveItems] = useState<Map<string, PredictiveItem>>(new Map());
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });
  const [isPredicting, setIsPredicting] = useState(false);
  const preloadTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const predictionQueueRef = useRef<Set<string>>(new Set());

  // Initialize predictive items
  useEffect(() => {
    const newItems = new Map<string, PredictiveItem>();
    items.forEach((item) => {
      const id = getItemId(item);
      newItems.set(id, {
        id,
        priority: priorityWeights.default,
        isPreloaded: false,
        isLoading: false,
        data: null,
        error: null
      });
    });
    setPredictiveItems(newItems);
  }, [items, getItemId, priorityWeights.default]);

  // Update visible range
  const updateVisibleRange = useCallback((start: number, end: number) => {
    setVisibleRange({ start, end });
  }, []);

  // Predict which items to preload
  const predictPreloadItems = useCallback(() => {
    if (isPredicting) return;

    setIsPredicting(true);
    
    // Clear existing timeout
    if (preloadTimeoutRef.current) {
      clearTimeout(preloadTimeoutRef.current);
    }

    // Delay prediction to avoid excessive preloading
    preloadTimeoutRef.current = setTimeout(() => {
      const itemsToPreload: string[] = [];
      
      // Calculate items that should be preloaded
      for (let i = visibleRange.end; i < Math.min(visibleRange.end + preloadThreshold, items.length); i++) {
        const item = items[i];
        const id = getItemId(item);
        const predictiveItem = predictiveItems.get(id);
        
        if (predictiveItem && !predictiveItem.isPreloaded && !predictiveItem.isLoading && !predictionQueueRef.current.has(id)) {
          itemsToPreload.push(id);
        }
      }

      // Limit preload items
      const limitedItems = itemsToPreload.slice(0, maxPreloadItems);
      
      // Add to prediction queue
      limitedItems.forEach(id => predictionQueueRef.current.add(id));
      
      // Start preloading
      limitedItems.forEach(id => {
        const item = items.find(item => getItemId(item) === id);
        if (item) {
          preloadItem(item);
        }
      });

      setIsPredicting(false);
    }, preloadDelay);
  }, [visibleRange, items, predictiveItems, preloadThreshold, maxPreloadItems, preloadDelay, getItemId, isPredicting]);

  // Preload a specific item
  const preloadItem = useCallback(async (item: T) => {
    const id = getItemId(item);
    const predictiveItem = predictiveItems.get(id);
    
    if (!predictiveItem || predictiveItem.isPreloaded || predictiveItem.isLoading) {
      return;
    }

    // Mark as loading
    setPredictiveItems(prev => {
      const newItems = new Map(prev);
      const existing = newItems.get(id);
      if (existing) {
        newItems.set(id, { ...existing, isLoading: true });
      }
      return newItems;
    });

    try {
      // Load the item data
      const data = await loadItem(item);
      
      // Mark as preloaded
      setPredictiveItems(prev => {
        const newItems = new Map(prev);
        const existing = newItems.get(id);
        if (existing) {
          newItems.set(id, { 
            ...existing, 
            isLoading: false, 
            isPreloaded: true, 
            data 
          });
        }
        return newItems;
      });
    } catch (error) {
      // Mark as error
      setPredictiveItems(prev => {
        const newItems = new Map(prev);
        const existing = newItems.get(id);
        if (existing) {
          newItems.set(id, { 
            ...existing, 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Failed to preload'
          });
        }
        return newItems;
      });
    } finally {
      // Remove from prediction queue
      predictionQueueRef.current.delete(id);
    }
  }, [predictiveItems, getItemId, loadItem]);

  // Get preloaded data for an item
  const getPreloadedData = useCallback((id: string) => {
    const item = predictiveItems.get(id);
    return item?.data || null;
  }, [predictiveItems]);

  // Check if item is preloaded
  const isItemPreloaded = useCallback((id: string) => {
    const item = predictiveItems.get(id);
    return item?.isPreloaded || false;
  }, [predictiveItems]);

  // Check if item is loading
  const isItemLoading = useCallback((id: string) => {
    const item = predictiveItems.get(id);
    return item?.isLoading || false;
  }, [predictiveItems]);

  // Get item error
  const getItemError = useCallback((id: string) => {
    const item = predictiveItems.get(id);
    return item?.error || null;
  }, [predictiveItems]);

  // Force preload specific items
  const forcePreload = useCallback((itemIds: string[]) => {
    itemIds.forEach(id => {
      const item = items.find(item => getItemId(item) === id);
      if (item) {
        preloadItem(item);
      }
    });
  }, [items, getItemId, preloadItem]);

  // Clear all preloaded data
  const clearPreloadedData = useCallback(() => {
    setPredictiveItems(prev => {
      const newItems = new Map();
      prev.forEach((item, id) => {
        newItems.set(id, { ...item, isPreloaded: false, data: null, error: null });
      });
      return newItems;
    });
    predictionQueueRef.current.clear();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current);
      }
    };
  }, []);

  return {
    updateVisibleRange,
    predictPreloadItems,
    getPreloadedData,
    isItemPreloaded,
    isItemLoading,
    getItemError,
    forcePreload,
    clearPreloadedData,
    visibleRange,
    isPredicting
  };
} 