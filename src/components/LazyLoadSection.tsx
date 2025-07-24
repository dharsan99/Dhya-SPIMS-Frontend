import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LazyLoadSectionProps {
  children: React.ReactNode;
  threshold?: number;
  className?: string;
  skeleton?: React.ReactNode;
  delay?: number;
  animation?: 'fade' | 'slide' | 'scale' | 'slide-up' | 'slide-down';
}

const LazyLoadSection: React.FC<LazyLoadSectionProps> = ({
  children,
  threshold = 0.1,
  className = '',
  skeleton,
  delay = 0,
  animation = 'fade'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add a small delay for smooth animation
          setTimeout(() => setIsLoaded(true), delay);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, delay]);

  const getAnimationVariants = () => {
    switch (animation) {
      case 'slide':
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 }
        };
      case 'slide-up':
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 }
        };
      case 'slide-down':
        return {
          hidden: { opacity: 0, y: -50 },
          visible: { opacity: 1, y: 0 }
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 }
        };
      default: // fade
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        };
    }
  };

  return (
    <div ref={ref} className={className}>
      <AnimatePresence mode="wait">
        {!isLoaded ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {skeleton || <DefaultSkeleton />}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial="hidden"
            animate="visible"
            variants={getAnimationVariants()}
            transition={{ 
              duration: 0.6, 
              ease: "easeOut",
              staggerChildren: 0.1
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Default skeleton component
const DefaultSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
  </div>
);

export default LazyLoadSection; 