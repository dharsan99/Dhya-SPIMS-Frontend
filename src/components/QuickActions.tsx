import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  DocumentTextIcon,
  TruckIcon,
  UserGroupIcon,
  CogIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
  shortcut?: string;
  needsConfirm?: boolean;
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
    },
    {
      id: 'production-entry',
      label: 'Production Entry',
      icon: <DocumentTextIcon className="h-6 w-6" />,
      onClick: () => handleAction('production-entry'),
      color: 'green',
      shortcut: 'P',
    },
    {
      id: 'delivery',
      label: 'Delivery',
      icon: <TruckIcon className="h-6 w-6" />,
      onClick: () => handleAction('delivery'),
      color: 'yellow',
      shortcut: 'D',
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: <UserGroupIcon className="h-6 w-6" />,
      onClick: () => handleAction('attendance'),
      color: 'purple',
      shortcut: 'A',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <CogIcon className="h-6 w-6" />,
      onClick: () => setConfirmAction(actions[4]),
      color: 'gray',
      shortcut: 'S',
      needsConfirm: true,
    },
    {
      id: 'refresh',
      label: 'Refresh',
      icon: <ArrowPathIcon className="h-6 w-6" />,
      onClick: () => setConfirmAction(actions[5]),
      color: 'indigo',
      shortcut: 'R',
      needsConfirm: true,
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
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    yellow: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    gray: 'bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400',
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 relative">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {actions.map(action => (
          <motion.button
            key={action.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.needsConfirm ? () => setConfirmAction(action) : action.onClick}
            className={`flex flex-col items-center justify-center p-3 rounded-lg ${colorClasses[action.color as keyof typeof colorClasses]} transition-colors duration-200 group relative`}
            tabIndex={0}
            aria-label={action.label + (action.shortcut ? ` (Shortcut: ${action.shortcut})` : '')}
            disabled={!!loadingAction}
          >
            {loadingAction === action.id ? (
              <svg className="animate-spin h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              action.icon
            )}
            <span className="mt-2 text-sm font-medium flex items-center gap-1">
              {action.label}
              {action.shortcut && (
                <kbd className="ml-1 px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
                  {action.shortcut}
                </kbd>
              )}
            </span>
          </motion.button>
        ))}
      </div>
      {/* Toast/snackbar */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}
      {/* Confirmation Dialog */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-xs flex flex-col items-center">
            <div className="mb-4 text-center">
              <div className="text-lg font-semibold mb-2">Are you sure?</div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">This action may affect your data.</div>
            </div>
            <div className="flex gap-3 mt-2">
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
                onClick={() => {
                  setConfirmAction(null);
                  handleAction(confirmAction.id);
                }}
                autoFocus
              >
                Confirm
              </button>
              <button
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
                onClick={() => setConfirmAction(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 