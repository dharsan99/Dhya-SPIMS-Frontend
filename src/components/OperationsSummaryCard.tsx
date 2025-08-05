import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChartBarIcon, UserGroupIcon, TruckIcon, Cog6ToothIcon, ShoppingBagIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import OrdersSummaryModal from './OperationsSummaryModals/OrdersSummaryModal';
import ProductionSummaryModal from './OperationsSummaryModals/ProductionSummaryModal';
import InventorySummaryModal from './OperationsSummaryModals/InventorySummaryModal';
import FinancialsSummaryModal from './OperationsSummaryModals/FinancialsSummaryModal';
import WorkforceSummaryModal from './OperationsSummaryModals/WorkforceSummaryModal';
import MachinesSummaryModal from './OperationsSummaryModals/MachinesSummaryModal';
import { DashboardSummary } from '../types/dashboard';

interface OperationsSummaryCardProps {
  summary?: DashboardSummary;
}

const OperationsSummaryCard: React.FC<OperationsSummaryCardProps> = ({ summary }) => {
  const [modalSection, setModalSection] = useState<null | 'orders' | 'production' | 'inventory' | 'financials' | 'workforce' | 'machines'>(null);

  if (!summary) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full flex items-center justify-center py-12"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <ChartBarIcon className="w-8 h-8 text-gray-400" />
          </div>
        <span className="text-gray-500 dark:text-gray-300 text-lg">Loading summary...</span>
      </div>
      </motion.div>
    );
  }

  const sections = [
    {
      id: 'orders',
      title: 'Orders',
      icon: <ShoppingBagIcon className="w-6 h-6" />,
      color: 'yellow',
      value: summary.orders.totalOrders,
      subtitle: 'Total Orders',
      metrics: [
        { label: 'Pending', value: summary.orders.statusBreakdown.pending, color: 'yellow' },
        { label: 'In Progress', value: summary.orders.statusBreakdown.in_progress, color: 'blue' },
        { label: 'Completed', value: summary.orders.statusBreakdown.completed, color: 'green' },
        { label: 'Dispatched', value: summary.orders.statusBreakdown.dispatched, color: 'gray' },
      ],
      alerts: [
        { label: 'Pending', value: summary.orders.pendingOrders, color: 'yellow' },
        { label: 'Overdue', value: summary.orders.overdueOrders, color: 'red' },
      ],
      details: summary.orders.topBuyers?.slice(0, 2).map(buyer => ({
        label: buyer.name,
        value: `${buyer.order_count} orders / ${buyer.total_quantity} kg`
      })) || []
    },
    {
      id: 'production',
      title: 'Production',
      icon: <TruckIcon className="w-6 h-6" />,
      color: 'green',
      value: `${summary.production.totalProduction} kg`,
      subtitle: 'Total Production',
      metrics: [
        { label: 'Carding', value: `${summary.production.sectionProduction.carding} kg`, color: 'green' },
        { label: 'Drawing', value: `${summary.production.sectionProduction.drawing} kg`, color: 'blue' },
        { label: 'Framing', value: `${summary.production.sectionProduction.framing} kg`, color: 'purple' },
        { label: 'Simplex', value: `${summary.production.sectionProduction.simplex} kg`, color: 'yellow' },
        { label: 'Spinning', value: `${summary.production.sectionProduction.spinning} kg`, color: 'indigo' },
        { label: 'Autoconer', value: `${summary.production.sectionProduction.autoconer} kg`, color: 'pink' },
      ],
      alerts: [
        { label: 'Avg Efficiency', value: `${summary.production.machineMetrics[0]?.efficiency.average.toFixed(1)}%`, color: 'gray' },
        { label: 'Production Days', value: summary.production.productionDays, color: 'gray' },
        { label: 'Total Machines', value: summary.machines?.totalMachines, color: 'gray' },
      ],
      details: [
        { label: 'Quality Issues', value: summary.production.machineMetrics[0]?.quality_issues, color: 'green' },
        { label: 'Downtime', value: summary.production.machineMetrics[0]?.downtime_incidents, color: 'red' },
      ]
    },
    {
      id: 'inventory',
      title: 'Inventory',
      icon: <ShoppingBagIcon className="w-6 h-6" />,
      color: 'blue',
      value: `${summary.inventory?.lowStockItems} items`,
      subtitle: 'Low Stock Items',
      metrics: [
        { label: 'Low Stock', value: summary.inventory?.lowStockItems, color: 'red' },
        { label: 'Pending Shortages', value: summary.inventory?.pendingFiberShortages, color: 'yellow' },
      ],
      alerts: [],
      details: []
    },
    {
      id: 'workforce',
      title: 'Workforce',
      icon: <UserGroupIcon className="w-6 h-6" />,
      color: 'purple',
      value: `${summary.workforce?.totalEmployees} workers`,
      subtitle: 'Total Employees',
      metrics: [
        { label: 'Attendance Rate', value: `${summary.workforce?.attendanceRateToday}%`, color: 'green' },
        { label: 'Overtime', value: `${summary.workforce?.attendanceOvertimeToday}%`, color: 'blue' },
      ],
      alerts: [],
      details: []
    },
    {
      id: 'machines',
      title: 'Machines',
      icon: <Cog6ToothIcon className="w-6 h-6" />,
      color: 'gray',
      value: `${summary.machines?.runningMachines} running`,
      subtitle: 'Active Machines',
      metrics: [
        { label: 'Running', value: summary.machines?.runningMachines, color: 'green' },
        { label: 'Idle', value: summary.machines?.idleMachines, color: 'yellow' },
        { label: 'Maintenance', value: summary.machines?.maintenanceMachines, color: 'red' },
      ],
      alerts: [],
      details: []
    }
  ];

  const colorClasses = {
    yellow: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-800 dark:from-yellow-900/20 dark:to-yellow-800/20 dark:border-yellow-700 dark:text-yellow-300',
    green: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 text-green-800 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-700 dark:text-green-300',
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-800 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-700 dark:text-blue-300',
    purple: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 text-purple-800 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-700 dark:text-purple-300',
    gray: 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 text-gray-800 dark:from-gray-900/20 dark:to-gray-800/20 dark:border-gray-700 dark:text-gray-300',
    red: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 text-red-800 dark:from-red-900/20 dark:to-red-800/20 dark:border-red-700 dark:text-red-300',
    indigo: 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-800 dark:from-indigo-900/20 dark:to-indigo-800/20 dark:border-indigo-700 dark:text-indigo-300',
    pink: 'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 text-pink-800 dark:from-pink-900/20 dark:to-pink-800/20 dark:border-pink-700 dark:text-pink-300',
  };

  const iconColorClasses = {
    yellow: 'text-yellow-600 dark:text-yellow-400',
    green: 'text-green-600 dark:text-green-400',
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    gray: 'text-gray-600 dark:text-gray-400',
    red: 'text-red-600 dark:text-red-400',
    indigo: 'text-indigo-600 dark:text-indigo-400',
    pink: 'text-pink-600 dark:text-pink-400',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 mb-12 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 dark:from-blue-900/10 dark:to-indigo-900/10" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-3 text-gray-900 dark:text-white">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-white" />
          </div>
              Operations Summary
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive overview of your production facility performance
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.02, 
                y: -2,
                transition: { duration: 0.2 }
              }}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => setModalSection(section.id as any)}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconColorClasses[section.color as keyof typeof iconColorClasses]}`}>
                    {section.icon}
          </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {section.subtitle}
                    </p>
            </div>
          </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {section.value}
                  </p>
          </div>
        </div>

              {/* Metrics */}
              {section.metrics.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {section.metrics.map((metric, idx) => (
                      <span
                        key={idx}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colorClasses[metric.color as keyof typeof colorClasses]}`}
                      >
                        {metric.label}: {metric.value}
            </span>
                    ))}
          </div>
        </div>
              )}

              {/* Alerts */}
              {section.alerts.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {section.alerts.map((alert, idx) => (
                      <span
                        key={idx}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colorClasses[alert.color as keyof typeof colorClasses]}`}
                      >
                        {alert.label}: {alert.value}
            </span>
                    ))}
          </div>
        </div>
              )}

              {/* Details */}
              {section.details.length > 0 && (
                <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Top Performers
                  </h4>
                  <div className="space-y-2">
                    {section.details.map((detail, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400 truncate max-w-[120px]">
                          {detail.label}
            </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {detail.value}
            </span>
          </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Click Indicator */}
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Click for details</span>
                <ArrowTrendingUpIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Quick Insights
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Key performance indicators at a glance
              </p>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400">Efficiency</p>
                <p className="font-bold text-green-600 dark:text-green-400">
                  {summary.production.machineMetrics[0]?.efficiency.average.toFixed(1)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400">Attendance</p>
                <p className="font-bold text-blue-600 dark:text-blue-400">
                  {summary.workforce?.attendanceRateToday}%
                </p>
          </div>
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400">Production</p>
                <p className="font-bold text-purple-600 dark:text-purple-400">
                  {summary.production.totalProduction} kg
                </p>
          </div>
          </div>
          </div>
        </motion.div>
      </div>

             {/* Modals */}
       <AnimatePresence>
         {modalSection === 'orders' && (
      <OrdersSummaryModal 
             open={true}
        onClose={() => setModalSection(null)}
      />
         )}
         {modalSection === 'production' && (
      <ProductionSummaryModal 
             isOpen={true}
        onClose={() => setModalSection(null)}
        data={{
          totalProduction: summary.production.totalProduction,
          avgDailyProduction: 0,
               sectionProduction: summary.production.sectionProduction,
          sectionQuality: {},
          sectionDowntime: {},
          machineMetrics: summary.production.machineMetrics,
          productionTrend: [],
          productionDays: summary.production.productionDays,
        }}
      />
         )}
         {modalSection === 'inventory' && (
      <InventorySummaryModal 
             open={true}
        onClose={() => setModalSection(null)}
        data={{
          lowStockItems: summary.inventory?.lowStockItems ?? 0,
          pendingFiberShortages: summary.inventory?.pendingFiberShortages ?? 0,
               topBuyers: summary.orders.topBuyers.map(buyer => ({
                 buyer_id: buyer.buyer_id,
                 buyer_name: buyer.name,
                 total_order_qty: buyer.total_quantity,
               })),
               topSuppliers: [],
          }}
        />
      )}
      {modalSection === 'financials' && (
        <FinancialsSummaryModal
          open={true}
          onClose={() => setModalSection(null)}
          data={{
            totalRevenue: summary.financial?.receivables?.total ?? 0,
            totalExpenses: summary.financial?.payables?.total ?? 0,
            netProfit: (summary.financial?.receivables?.total ?? 0) - (summary.financial?.payables?.total ?? 0),
            profitMargin: ((summary.financial?.receivables?.total ?? 0) - (summary.financial?.payables?.total ?? 0)) / ((summary.financial?.receivables?.total ?? 0) || 1) * 100,
                 revenueTrend: 0,
                 expensesTrend: 0,
               }}
           />
         )}
         {modalSection === 'workforce' && (
           <WorkforceSummaryModal
             open={true}
             onClose={() => setModalSection(null)}
             data={{
               totalWorkers: summary.workforce?.totalEmployees ?? 0,
               presentWorkers: 0,
               absentWorkers: 0,
               attendanceRate: summary.workforce?.attendanceRateToday ?? 0,
               overtimeHours: summary.workforce?.attendanceOvertimeToday ?? 0,
               productivityScore: 0,
             }}
           />
         )}
         {modalSection === 'machines' && (
           <MachinesSummaryModal
             open={true}
             onClose={() => setModalSection(null)}
             data={{
               totalMachines: summary.machines?.totalMachines ?? 0,
               runningMachines: summary.machines?.runningMachines ?? 0,
               idleMachines: summary.machines?.idleMachines ?? 0,
               maintenanceMachines: summary.machines?.maintenanceMachines ?? 0,
               offlineMachines: summary.machines?.offlineMachines ?? 0,
               machineStatuses: summary.machines?.machineStatuses ?? [],
          }}
        />
      )}
       </AnimatePresence>
    </motion.div>
  );
};

export default OperationsSummaryCard; 