import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  SparklesIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

// Helper function to check if there are unread items
export const hasUnreadItems = (): boolean => {
  try {
    const readItems = JSON.parse(localStorage.getItem('spims-whatsnew-read-items') || '[]');
    const dismissedItems = JSON.parse(localStorage.getItem('spims-whatsnew-dismissed-items') || '[]');

    // Define all available items (this should match the items in WhatsNewPanel)
    const allItems = ['1', '2', '3', '4', '5'];

    // Check if there are any items that are neither read nor dismissed
    return allItems.some(id => !readItems.includes(id) && !dismissedItems.includes(id));
  } catch {
    return true; // If there's an error, show the panel
  }
};

// Enhanced Metric Card Component
export const MetricCard = ({
  title,
  value,
  trend,
  icon,
  color = 'blue',
  onClick,
  loading = false,
  trendLabel = 'vs last period',
  aiInsight,
  isGeneratingInsight,
  onGenerateInsight
}: {
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  onClick?: () => void;
  loading?: boolean;
  trendLabel?: string;
  aiInsight?: string;
  isGeneratingInsight?: boolean;
  onGenerateInsight?: () => void;
}) => {


  const iconClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 animate-pulse"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 cursor-pointer transition-all duration-200 hover:shadow-xl ${
        onClick ? 'hover:ring-2 hover:ring-blue-500/20' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
          {title}
        </h3>
        <div className={`p-2 rounded-lg ${iconClasses[color]}`}>
          {icon}
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div className="flex-1">
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {value}
          </p>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mb-1">
              {trend > 0 ? (
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
              ) : trend < 0 ? (
                <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
              ) : (
                <CheckCircleIcon className="w-4 h-4 text-gray-500" />
              )}
              <span className={`text-sm font-medium ${
                trend > 0 ? 'text-green-600 dark:text-green-400' :
                trend < 0 ? 'text-red-600 dark:text-red-400' :
                'text-gray-600 dark:text-gray-400'
              }`}>
                {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
              </span>
            </div>
          )}
          {trend !== undefined && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {trendLabel}
            </p>
          )}
        </div>
      </div>
      {/* AI Insights Section */}
      {aiInsight && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">AI Insight</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onGenerateInsight?.();
              }}
              disabled={isGeneratingInsight}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                isGeneratingInsight
                  ? 'bg-gray-100 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/30'
              }`}
            >
              {isGeneratingInsight ? (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 border border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <SparklesIcon className="w-2 h-2" />
                  Refresh
                </div>
              )}
            </button>
          </div>
          <TypingAnimation text={aiInsight} />
        </div>
      )}
      {/* Generate AI Insight Button (when no insight exists) */}
      {!aiInsight && onGenerateInsight && (
        <div className="mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onGenerateInsight();
            }}
            disabled={isGeneratingInsight}
            className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 ${
              isGeneratingInsight
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/30'
            }`}
          >
            {isGeneratingInsight ? (
              <>
                <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                Generating AI Insight...
              </>
            ) : (
              <>
                <SparklesIcon className="w-3 h-3" />
                Generate AI Insight
              </>
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
};

// Mobile-optimized Metric Card Component
export const MobileMetricCard = ({
  title,
  value,
  trend,
  icon,
  color = 'blue',
  onClick,
  loading = false
}: {
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  onClick?: () => void;
  loading?: boolean;
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-4 rounded-xl border-2 ${colorClasses[color]} ${
        onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
      } ${loading ? 'animate-pulse' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
          </div>
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-1">
            {trend > 0 ? (
              <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
            ) : trend < 0 ? (
              <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
            ) : (
              <CheckCircleIcon className="w-4 h-4 text-gray-500" />
            )}
            <span className={`text-xs font-medium ${
              trend > 0 ? 'text-green-600 dark:text-green-400' :
              trend < 0 ? 'text-red-600 dark:text-red-400' :
              'text-gray-600 dark:text-gray-400'
            }`}>
              {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Mobile Swipeable Section Component
export const MobileSwipeableSection = ({
  title,
  children,
  icon
}: {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 mb-6"
    >
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </motion.div>
  );
};

// AI Insights Typing Animation Component
export const TypingAnimation = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset animation when text changes
  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50); // Adjust speed here

      return () => clearTimeout(timer);
    } else if (onComplete && currentIndex > 0) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return (
    <span className="text-sm text-gray-600 dark:text-gray-400">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// Predictive Analytics Panel Component
export const PredictiveAnalyticsPanel = ({
  models,
  loading,
  onGeneratePrediction
}: {
  models: Array<{
    id: string;
    name: string;
    metric: string;
    accuracy: number;
    lastUpdated: Date;
    predictions: Array<{
      date: string;
      predicted: number;
      actual?: number;
      confidence: number;
    }>;
  }>;
  loading: boolean;
  onGeneratePrediction: (modelId: string) => void;
}) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4"></div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CpuChipIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Predictive Analytics
          </h3>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {models.length} models
        </span>
      </div>

      <div className="space-y-4">
        {models.map((model) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {model.name}
                  </h4>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                    {model.metric}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <span>Accuracy: {model.accuracy.toFixed(1)}%</span>
                  <span>Updated: {new Date(model.lastUpdated).toLocaleDateString()}</span>
                </div>
                {model.predictions.length > 0 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Latest prediction: {model.predictions[0].predicted.toFixed(2)} 
                    (confidence: {model.predictions[0].confidence.toFixed(1)}%)
                  </div>
                )}
              </div>
              <button
                onClick={() => onGeneratePrediction(model.id)}
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
              >
                Generate
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}; 