import React from 'react';
import { motion } from 'framer-motion';

// Metric Card Skeleton
export const MetricCardSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 animate-pulse"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
  </motion.div>
);

// Chart Card Skeleton
export const ChartCardSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 animate-pulse"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
    <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
  </motion.div>
);

// Header Skeleton
export const HeaderSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-6 animate-pulse"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  </motion.div>
);

// Alerts Skeleton
export const AlertsSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="space-y-4 animate-pulse"
  >
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      </div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
    </div>
  </motion.div>
);

// Operations Summary Skeleton
export const OperationsSummarySkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 animate-pulse"
  >
    <div className="flex items-center justify-between mb-6">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="text-center">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto"></div>
        </div>
      ))}
    </div>
  </motion.div>
);

// Quick Actions Skeleton
export const QuickActionsSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 animate-pulse"
  >
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto"></div>
        </div>
      ))}
    </div>
  </motion.div>
);

// Mobile View Skeleton
export const MobileViewSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="space-y-4 animate-pulse"
  >
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-gray-200 dark:bg-gray-600 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
            </div>
            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

// AI Insights Skeleton
export const AIInsightsSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 animate-pulse"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  </motion.div>
);

// Staggered loading animation for multiple skeletons
export const StaggeredSkeleton: React.FC<{ count: number; SkeletonComponent: React.FC }> = ({ 
  count, 
  SkeletonComponent 
}) => (
  <div className="space-y-6">
    {Array.from({ length: count }).map((_, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <SkeletonComponent />
      </motion.div>
    ))}
  </div>
); 