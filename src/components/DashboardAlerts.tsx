import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HighPriorityTaskAlert } from './HighPriorityTaskAlert';
import { WhatsNewPanel } from './WhatsNewPanel';

// Alert Component
const AlertCard = ({ 
  type = 'info', 
  title, 
  message, 
  action 
}: {
  type?: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  action?: { label: string; onClick: () => void };
}) => {
  const alertStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300',
    error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300',
    success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg border ${alertStyles[type]} shadow-sm`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm mt-1 opacity-90">{message}</p>
        </div>
        {action && (
          <button
            onClick={action.onClick}
            className="ml-4 px-3 py-1 text-xs font-medium bg-white dark:bg-gray-800 rounded-md border border-current hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {action.label}
          </button>
        )}
      </div>
    </motion.div>
  );
};

interface DashboardAlertsProps {
  dashboardData: any;
  showWhatsNew: boolean;
  setShowWhatsNew: (show: boolean) => void;
}

const DashboardAlerts: React.FC<DashboardAlertsProps> = ({
  dashboardData,
  showWhatsNew,
  setShowWhatsNew
}) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Alerts Section */}
      <AnimatePresence>
        {(dashboardData?.orders?.overdueOrders ?? 0) > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <AlertCard
              type="warning"
              title="Overdue Orders"
              message={`You have ${dashboardData?.orders?.overdueOrders} overdue orders that require immediate attention.`}
              action={{
                label: "View Orders",
                onClick: () => navigate('/app/orders')
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* High Priority Growth Task Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <HighPriorityTaskAlert 
          maxTasks={3}
          showDismissButton={true}
        />
      </motion.div>

      {/* What's New Panel */}
      <AnimatePresence>
        {showWhatsNew && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: 0.6 }}
          >
            <WhatsNewPanel onClose={() => setShowWhatsNew(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardAlerts; 