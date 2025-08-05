import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  DocumentTextIcon,
  TruckIcon,
  UserGroupIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  BellIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
  shortcut?: string;
  needsConfirm?: boolean;
  description?: string;
  badge?: string;
}

interface QuickActionsProps {
  onAction: (actionId: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const [toast, setToast] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<QuickAction | null>(null);

  function handleAction(actionId: string) {
    setLoadingAction(actionId);
    setTimeout(() => {
      onAction(actionId);
      setToast(`Action: ${actions.find(a => a.id === actionId)?.label || actionId}`);
      setLoadingAction(null);
      setTimeout(() => setToast(null), 2000);
    }, 800);
  }

  const actions: QuickAction[] = [
    {
      id: 'new-order',
      label: 'New Order',
      icon: <PlusIcon className="h-6 w-6" />,
      onClick: () => handleAction('new-order'),
      color: 'blue',
      shortcut: 'N',
      description: 'Create a new production order',
      badge: 'Popular'
    },
    {
      id: 'production-entry',
      label: 'Production Entry',
      icon: <DocumentTextIcon className="h-6 w-6" />,
      onClick: () => handleAction('production-entry'),
      color: 'green',
      shortcut: 'P',
      description: 'Record daily production data'
    },
    {
      id: 'delivery',
      label: 'Delivery',
      icon: <TruckIcon className="h-6 w-6" />,
      onClick: () => handleAction('delivery'),
      color: 'yellow',
      shortcut: 'D',
      description: 'Manage order deliveries'
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: <UserGroupIcon className="h-6 w-6" />,
      onClick: () => handleAction('attendance'),
      color: 'purple',
      shortcut: 'A',
      description: 'Track employee attendance'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <ChartBarIcon className="h-6 w-6" />,
      onClick: () => handleAction('analytics'),
      color: 'indigo',
      shortcut: 'T',
      description: 'View detailed analytics'
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: <ShoppingBagIcon className="h-6 w-6" />,
      onClick: () => handleAction('inventory'),
      color: 'emerald',
      shortcut: 'I',
      description: 'Manage fiber inventory'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <BellIcon className="h-6 w-6" />,
      onClick: () => handleAction('notifications'),
      color: 'orange',
      shortcut: 'O',
      description: 'View system notifications'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Cog6ToothIcon className="h-6 w-6" />,
      onClick: () => setConfirmAction(actions[7]),
      color: 'gray',
      shortcut: 'S',
      needsConfirm: true,
      description: 'Configure system settings'
    },
  ];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toUpperCase();
      const action = actions.find(a => a.shortcut === key);
      if (action) {
        e.preventDefault();
        if (action.needsConfirm) setConfirmAction(action);
        else action.onClick();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 border-blue-200 hover:from-blue-100 hover:to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:text-blue-300 dark:border-blue-700',
    green: 'bg-gradient-to-br from-green-50 to-green-100 text-green-700 border-green-200 hover:from-green-100 hover:to-green-200 dark:from-green-900/20 dark:to-green-800/20 dark:text-green-300 dark:border-green-700',
    yellow: 'bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-700 border-yellow-200 hover:from-yellow-100 hover:to-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/20 dark:text-yellow-300 dark:border-yellow-700',
    purple: 'bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700 border-purple-200 hover:from-purple-100 hover:to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 dark:text-purple-300 dark:border-purple-700',
    gray: 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 border-gray-200 hover:from-gray-100 hover:to-gray-200 dark:from-gray-900/20 dark:to-gray-800/20 dark:text-gray-300 dark:border-gray-700',
    indigo: 'bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-700 border-indigo-200 hover:from-indigo-100 hover:to-indigo-200 dark:from-indigo-900/20 dark:to-indigo-800/20 dark:text-indigo-300 dark:border-indigo-700',
    emerald: 'bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200 hover:from-emerald-100 hover:to-emerald-200 dark:from-emerald-900/20 dark:to-emerald-800/20 dark:text-emerald-300 dark:border-emerald-700',
    orange: 'bg-gradient-to-br from-orange-50 to-orange-100 text-orange-700 border-orange-200 hover:from-orange-100 hover:to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 dark:text-orange-300 dark:border-orange-700',
  };

  const iconColorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    purple: 'text-purple-600 dark:text-purple-400',
    gray: 'text-gray-600 dark:text-gray-400',
    indigo: 'text-indigo-600 dark:text-indigo-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    orange: 'text-orange-600 dark:text-orange-400',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 dark:from-blue-900/10 dark:to-indigo-900/10" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Quick Actions
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Access frequently used features and shortcuts
            </p>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
            {actions.length} actions
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05, 
                y: -2,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              onClick={action.needsConfirm ? () => setConfirmAction(action) : action.onClick}
              className={`relative group p-4 rounded-xl border transition-all duration-200 ${colorClasses[action.color as keyof typeof colorClasses]} focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
              tabIndex={0}
              aria-label={action.label + (action.shortcut ? ` (Shortcut: ${action.shortcut})` : '')}
              disabled={!!loadingAction}
            >
              {/* Badge */}
              {action.badge && (
                <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  {action.badge}
                </div>
              )}

              {/* Loading State */}
              {loadingAction === action.id ? (
                <div className="flex flex-col items-center justify-center">
                  <svg className="animate-spin h-6 w-6 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  <span className="text-xs text-gray-500">Loading...</span>
                </div>
              ) : (
                <>
                  {/* Icon */}
                  <div className={`flex items-center justify-center w-12 h-12 rounded-lg bg-white/50 dark:bg-gray-800/50 mb-3 group-hover:scale-110 transition-transform duration-200 ${iconColorClasses[action.color as keyof typeof iconColorClasses]}`}>
                    {action.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="text-center">
                    <span className="block text-sm font-semibold mb-1 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      {action.label}
                    </span>
                    {action.description && (
                      <span className="block text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {action.description}
                      </span>
                    )}
                    {action.shortcut && (
                      <kbd className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
                        {action.shortcut}
                      </kbd>
                    )}
                  </div>
                </>
              )}
            </motion.button>
          ))}
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                💡 Keyboard Shortcuts
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Press keys to quick access
            </div>
          </div>
        </div>
      </div>

      {/* Toast/snackbar */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2"
          >
            <CheckCircleIcon className="w-5 h-5 text-green-400" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {confirmAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Confirm Action
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                  Are you sure you want to proceed with <strong>{confirmAction.label}</strong>? 
                  This action may affect your data.
                </p>
                <div className="flex gap-3">
                  <button
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                    onClick={() => setConfirmAction(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    onClick={() => {
                      setConfirmAction(null);
                      handleAction(confirmAction.id);
                    }}
                    autoFocus
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}; 