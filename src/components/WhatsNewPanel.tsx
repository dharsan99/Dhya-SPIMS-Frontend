import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  const [isOpen, setIsOpen] = useState(true);
  const [dismissedItems, setDismissedItems] = useState<string[]>([]);

  const handleDismiss = (id: string) => {
    setDismissedItems([...dismissedItems, id]);
  };

  const visibleItems = whatsNewItems.filter(item => !dismissedItems.includes(item.id));

  if (!isOpen || visibleItems.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed bottom-4 right-4 z-50 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="p-4">
        {onClose && (
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-lg font-bold focus:outline-none"
            onClick={onClose}
            aria-label="Close What's New panel"
          >
            
          </button>
        )}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">What's New</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">{item.title}</h4>
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
  );
}; 