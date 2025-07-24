import React, { useState, useEffect, useRef, useCallback } from 'react';

interface ScrollPattern {
  direction: 'up' | 'down' | 'idle';
  speed: number;
  acceleration: number;
  timestamp: number;
}

interface ScrollPrediction {
  willScrollDown: boolean;
  willScrollUp: boolean;
  expectedSpeed: number;
  confidence: number;
}

interface SmartScrollDetectorProps {
  onScrollPattern?: (pattern: ScrollPattern) => void;
  onPrediction?: (prediction: ScrollPrediction) => void;
  onScrollStart?: () => void;
  onScrollEnd?: () => void;
  predictionThreshold?: number;
  children: React.ReactNode;
}

export const SmartScrollDetector: React.FC<SmartScrollDetectorProps> = ({
  onScrollPattern,
  onPrediction,
  onScrollStart,
  onScrollEnd,
  predictionThreshold = 0.7,
  children
}) => {
  const [scrollPatterns, setScrollPatterns] = useState<ScrollPattern[]>([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastScrollTopRef = useRef(0);
  const lastScrollTimeRef = useRef(Date.now());

  // Analyze scroll patterns
  const analyzeScrollPattern = useCallback((scrollTop: number, timestamp: number): ScrollPattern => {
    const deltaY = scrollTop - lastScrollTopRef.current;
    const deltaTime = timestamp - lastScrollTimeRef.current;
    
    const speed = Math.abs(deltaY) / Math.max(deltaTime, 1);
    const direction = deltaY > 0 ? 'down' : deltaY < 0 ? 'up' : 'idle';
    
    // Calculate acceleration (change in speed)
    const previousPattern = scrollPatterns[scrollPatterns.length - 1];
    const acceleration = previousPattern ? (speed - previousPattern.speed) / Math.max(deltaTime, 1) : 0;

    return {
      direction,
      speed,
      acceleration,
      timestamp
    };
  }, [scrollPatterns]);

  // Predict future scroll behavior
  const predictScrollBehavior = useCallback((): ScrollPrediction => {
    if (scrollPatterns.length < 3) {
      return {
        willScrollDown: false,
        willScrollUp: false,
        expectedSpeed: 0,
        confidence: 0
      };
    }

    // Get recent patterns
    const recentPatterns = scrollPatterns.slice(-5);
    const downPatterns = recentPatterns.filter(p => p.direction === 'down');
    const upPatterns = recentPatterns.filter(p => p.direction === 'up');
    
    // Calculate average speeds
    const avgDownSpeed = downPatterns.length > 0 
      ? downPatterns.reduce((sum, p) => sum + p.speed, 0) / downPatterns.length 
      : 0;
    const avgUpSpeed = upPatterns.length > 0 
      ? upPatterns.reduce((sum, p) => sum + p.speed, 0) / upPatterns.length 
      : 0;

    // Calculate confidence based on pattern consistency
    const totalPatterns = recentPatterns.length;
    const downConfidence = downPatterns.length / totalPatterns;
    const upConfidence = upPatterns.length / totalPatterns;

    // Check for acceleration patterns
    const isAccelerating = recentPatterns.some(p => p.acceleration > 0);

    return {
      willScrollDown: downConfidence > predictionThreshold && (isAccelerating || avgDownSpeed > avgUpSpeed),
      willScrollUp: upConfidence > predictionThreshold && (isAccelerating || avgUpSpeed > avgDownSpeed),
      expectedSpeed: Math.max(avgDownSpeed, avgUpSpeed),
      confidence: Math.max(downConfidence, upConfidence)
    };
  }, [scrollPatterns, predictionThreshold]);

  // Handle scroll event
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const timestamp = Date.now();

    // Start scrolling
    if (!isScrolling) {
      setIsScrolling(true);
      onScrollStart?.();
    }

    // Clear scroll end timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Analyze scroll pattern
    const pattern = analyzeScrollPattern(scrollTop, timestamp);
    setScrollPatterns(prev => [...prev.slice(-10), pattern]); // Keep last 10 patterns

    // Update refs
    lastScrollTopRef.current = scrollTop;
    lastScrollTimeRef.current = timestamp;

    // Notify pattern
    onScrollPattern?.(pattern);

    // Set scroll end timeout
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
      onScrollEnd?.();
    }, 150);
  }, [isScrolling, analyzeScrollPattern, onScrollPattern, onScrollStart, onScrollEnd]);

  // Update prediction when patterns change
  useEffect(() => {
    const prediction = predictScrollBehavior();
    onPrediction?.(prediction);
  }, [scrollPatterns, predictScrollBehavior, onPrediction]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div onScroll={handleScroll} className="smart-scroll-detector">
      {children}
    </div>
  );
};

// Hook for accessing scroll detection data
export function useSmartScrollDetection() {
  const [scrollPatterns, setScrollPatterns] = useState<ScrollPattern[]>([]);
  const [currentPrediction, setCurrentPrediction] = useState<ScrollPrediction | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const handleScrollPattern = useCallback((pattern: ScrollPattern) => {
    setScrollPatterns(prev => [...prev.slice(-10), pattern]);
  }, []);

  const handlePrediction = useCallback((prediction: ScrollPrediction) => {
    setCurrentPrediction(prediction);
  }, []);

  const handleScrollStart = useCallback(() => {
    setIsScrolling(true);
  }, []);

  const handleScrollEnd = useCallback(() => {
    setIsScrolling(false);
  }, []);

  return {
    scrollPatterns,
    currentPrediction,
    isScrolling,
    handleScrollPattern,
    handlePrediction,
    handleScrollStart,
    handleScrollEnd
  };
} 