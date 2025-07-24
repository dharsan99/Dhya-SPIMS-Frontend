import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  SparklesIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowRightIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface WhatsNewItem {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'feature' | 'improvement' | 'bugfix' | 'announcement';
  priority: 'high' | 'medium' | 'low';
  read?: boolean;
}

const whatsNewItems: WhatsNewItem[] = [
  {
    id: '1',
    title: 'Enhanced Dashboard Analytics',
    description: 'New KPI cards with real-time trends, sparklines, and predictive analytics for better decision making.',
    date: '2024-01-15',
    type: 'feature',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Global Search & Navigation',
    description: 'Powerful search across orders, production, deliveries, and customer data with intelligent suggestions.',
    date: '2024-01-10',
    type: 'feature',
    priority: 'high'
  },
  {
    id: '3',
    title: 'Smart Notifications',
    description: 'Intelligent notification system with priority-based alerts and customizable preferences.',
    date: '2024-01-08',
    type: 'improvement',
    priority: 'medium'
  },
  {
    id: '4',
    title: 'Performance Optimizations',
    description: 'Faster loading times and improved responsiveness across all modules.',
    date: '2024-01-05',
    type: 'improvement',
    priority: 'medium'
  },
  {
    id: '5',
    title: 'Mobile Experience Enhanced',
    description: 'Better touch interactions and responsive design for mobile devices.',
    date: '2024-01-03',
    type: 'improvement',
    priority: 'low'
  }
];

interface WhatsNewPanelProps {
  onClose?: () => void;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'feature':
      return <SparklesIcon className="w-4 h-4 text-blue-500" />;
    case 'improvement':
      return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
    case 'bugfix':
      return <ExclamationTriangleIcon className="w-4 h-4 text-orange-500" />;
    case 'announcement':
      return <InformationCircleIcon className="w-4 h-4 text-purple-500" />;
    default:
      return <SparklesIcon className="w-4 h-4 text-blue-500" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

// Helper functions for localStorage
const getStoredReadItems = (): string[] => {
  try {
    const stored = localStorage.getItem('spims-whatsnew-read-items');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const getStoredDismissedItems = (): string[] => {
  try {
    const stored = localStorage.getItem('spims-whatsnew-dismissed-items');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const setStoredReadItems = (items: string[]) => {
  try {
    localStorage.setItem('spims-whatsnew-read-items', JSON.stringify(items));
  } catch (error) {
    console.warn('Failed to save read items to localStorage:', error);
  }
};

const setStoredDismissedItems = (items: string[]) => {
  try {
    localStorage.setItem('spims-whatsnew-dismissed-items', JSON.stringify(items));
  } catch (error) {
    console.warn('Failed to save dismissed items to localStorage:', error);
  }
};

export const WhatsNewPanel: React.FC<WhatsNewPanelProps> = ({ onClose }) => {
  const [dismissedItems, setDismissedItems] = useState<string[]>([]);
  const [readItems, setReadItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'features' | 'improvements'>('all');

  // Load persisted state on component mount
  useEffect(() => {
    setReadItems(getStoredReadItems());
    setDismissedItems(getStoredDismissedItems());
  }, []);

  const handleDismiss = (id: string) => {
    const newDismissedItems = [...dismissedItems, id];
    setDismissedItems(newDismissedItems);
    setStoredDismissedItems(newDismissedItems);
  };

  const handleRead = (id: string) => {
    const newReadItems = [...readItems, id];
    setReadItems(newReadItems);
    setStoredReadItems(newReadItems);
  };

  const handleMarkAllAsRead = () => {
    const allItemIds = visibleItems.map(item => item.id);
    setReadItems(allItemIds);
    setStoredReadItems(allItemIds);
  };

  const visibleItems = whatsNewItems.filter(item => !dismissedItems.includes(item.id));
  
  const filteredItems = visibleItems.filter(item => {
    if (activeTab === 'features') return item.type === 'feature';
    if (activeTab === 'improvements') return item.type === 'improvement';
    return true;
  });

  const unreadCount = visibleItems.filter(item => !readItems.includes(item.id)).length;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose?.()}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-2xl mx-4 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <SparklesIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">What's New</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {unreadCount > 0 ? `${unreadCount} new updates` : 'All caught up!'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close What's New panel"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {[
              { key: 'all', label: 'All Updates', count: visibleItems.length },
              { key: 'features', label: 'Features', count: visibleItems.filter(i => i.type === 'feature').length },
              { key: 'improvements', label: 'Improvements', count: visibleItems.filter(i => i.type === 'improvement').length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {tab.label}
                <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded-full">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            <div className="p-6 space-y-4">
              <AnimatePresence>
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`relative p-4 rounded-lg border transition-all duration-200 ${
                      readItems.includes(item.id)
                        ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                        : 'bg-white dark:bg-gray-900 border-blue-200 dark:border-blue-700 shadow-sm'
                    }`}
                  >
                    {/* Priority Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                    </div>

                    {/* Type Icon */}
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getTypeIcon(item.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {item.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(item.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <div className="flex items-center gap-2">
                            {!readItems.includes(item.id) && (
                              <button
                                onClick={() => handleRead(item.id)}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                              >
                                Mark as read
                              </button>
                            )}
                            <button
                              onClick={() => handleDismiss(item.id)}
                              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredItems.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <StarIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No updates to show</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <a
                  href="/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center gap-1"
                >
                  View Documentation
                  <ArrowRightIcon className="w-4 h-4" />
                </a>
                <a
                  href="/changelog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Full Changelog
                </a>
              </div>
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Mark all as read
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}; 