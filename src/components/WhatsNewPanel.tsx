import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface WhatsNewItem {
  id: string;
  title: string;
  description: string;
  date: string;
}

const whatsNewItems: WhatsNewItem[] = [
  {
    id: '1',
    title: 'Enhanced Dashboard',
    description: 'New KPI cards with trends and sparklines for better data visualization.',
    date: '2024-03-20',
  },
  {
    id: '2',
    title: 'Global Search',
    description: 'Search across orders, production, and deliveries from anywhere in the app.',
    date: '2024-03-20',
  },
  {
    id: '3',
    title: 'Quick Actions',
    description: 'New quick action buttons for common tasks in the dashboard.',
    date: '2024-03-20',
  },
];

interface WhatsNewPanelProps {
  onClose?: () => void;
}

export const WhatsNewPanel: React.FC<WhatsNewPanelProps> = ({ onClose }) => {
  const [dismissedItems, setDismissedItems] = useState<string[]>([]);

  const handleDismiss = (id: string) => {
    setDismissedItems([...dismissedItems, id]);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const visibleItems = whatsNewItems.filter(item => !dismissedItems.includes(item.id));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-end bg-black/20 backdrop-blur-[1px] p-6"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SparklesIcon className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">What's New</h3>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {visibleItems.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="relative p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <button
                    onClick={() => handleDismiss(item.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1 pr-8">{item.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                  <span className="text-xs text-gray-400 mt-2 block">{item.date}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <a
                href="/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                View Documentation →
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}; 