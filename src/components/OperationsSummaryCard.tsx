import React, { useState } from 'react';
import { ChartBarIcon, UserGroupIcon, CurrencyRupeeIcon, TruckIcon, Cog6ToothIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
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
      <div className="w-full flex items-center justify-center py-12">
        <span className="text-gray-500 dark:text-gray-300 text-lg">Loading summary...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-800 mb-12">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
        <ChartBarIcon className="w-7 h-7 text-blue-500" /> Operations Summary
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {/* Orders Section */}
        <div
          className="rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm flex flex-col gap-4 min-w-[220px] cursor-pointer"
          tabIndex={0}
          aria-label="View Orders Details"
          onClick={() => setModalSection('orders')}
        >
          <div className="flex items-center gap-2">
            <ShoppingBagIcon className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold text-lg text-gray-900 dark:text-white">Orders</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{summary.orders.totalOrders}</div>
          <div className="flex gap-2 flex-wrap">
            <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium">
              Pending: {summary.orders.statusBreakdown.pending}
            </span>
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">
              In Progress: {summary.orders.statusBreakdown.in_progress}
            </span>
            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium">
              Completed: {summary.orders.statusBreakdown.completed}
            </span>
            <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-medium">
              Dispatched: {summary.orders.statusBreakdown.dispatched}
            </span>
          </div>
          <div className="flex gap-4 mt-1">
            <span className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded text-xs font-medium">
              Pending: {summary.orders.pendingOrders}
            </span>
            <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs font-medium">
              Overdue: {summary.orders.overdueOrders}
            </span>
          </div>
          <div className="mt-2">
            <ul className="space-y-1">
              {summary.orders.topBuyers?.slice(0, 2).map((buyer, idx) => (
                <li key={buyer.buyer_id || `${buyer.name}-${idx}`} className="flex justify-between text-sm">
                  <span className="truncate max-w-[120px]">
                    {buyer.name.length > 15 ? buyer.name.slice(0, 15) + '…' : buyer.name}
                  </span>
                  <span className="text-gray-700 dark:text-gray-200 ml-2 whitespace-nowrap">
                    {buyer.order_count} orders / {buyer.total_quantity} kg
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Production Section */}
        <div
          className="rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm flex flex-col gap-4 min-w-[220px] cursor-pointer"
          tabIndex={0}
          aria-label="View Production Details"
          onClick={() => setModalSection('production')}
        >
          <div className="flex items-center gap-2">
            <TruckIcon className="w-5 h-5 text-green-500" />
            <span className="font-semibold text-lg text-gray-900 dark:text-white">Production</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{summary.production.totalProduction} kg</div>
          
          {/* Section Production Overview */}
          <div className="flex gap-2 flex-wrap">
            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium">
              Carding: {summary.production.sectionProduction.carding} kg
            </span>
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">
              Drawing: {summary.production.sectionProduction.drawing} kg
            </span>
            <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs font-medium">
              Framing: {summary.production.sectionProduction.framing} kg
            </span>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium">
              Simplex: {summary.production.sectionProduction.simplex} kg
            </span>
            <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs font-medium">
              Spinning: {summary.production.sectionProduction.spinning} kg
            </span>
            <span className="bg-pink-100 text-pink-800 px-2 py-0.5 rounded text-xs font-medium">
              Autoconer: {summary.production.sectionProduction.autoconer} kg
            </span>
          </div>

          {/* Machine Metrics Summary */}
          <div className="mt-2">
            <div className="flex gap-2 flex-wrap">
              <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-medium">
                Avg Efficiency: {summary.production.machineMetrics[0]?.efficiency.average.toFixed(1)}%
              </span>
              <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-medium">
                Production Days: {summary.production.productionDays}
              </span>
              <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-medium">
                Total Machines: {summary.machines?.totalMachines}
              </span>
            </div>
          </div>

          {/* Quality & Downtime Summary */}
          <div className="mt-2">
            <div className="flex gap-2 flex-wrap">
              <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                Quality Issues: {summary.production.machineMetrics[0]?.quality_issues}
              </span>
              <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs font-medium">
                Downtime: {summary.production.machineMetrics[0]?.downtime_incidents}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="col-span-full border-t border-gray-200 dark:border-gray-700 my-2" />

        {/* Inventory & Supply Chain Section */}
        <div
          className="rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm flex flex-col gap-4 min-w-[220px] cursor-pointer"
          tabIndex={0}
          aria-label="View Inventory Details"
          onClick={() => setModalSection('inventory')}
        >
          <div className="flex items-center gap-2">
            <ShoppingBagIcon className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-lg text-gray-900 dark:text-white">Inventory</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{summary.inventory?.lowStockItems} items</div>
          <div className="flex gap-2 flex-wrap">
            <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-medium">
              Low Stock: {summary.inventory?.lowStockItems}
            </span>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium">
              Pending Shortages: {summary.inventory?.pendingFiberShortages}
            </span>
          </div>
        </div>

        {/* Workforce Section */}
        <div
          className="rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm flex flex-col gap-4 min-w-[220px] cursor-pointer"
          tabIndex={0}
          aria-label="View Workforce Details"
          onClick={() => setModalSection('workforce')}
        >
          <div className="flex items-center gap-2">
            <UserGroupIcon className="w-5 h-5 text-purple-500" />
            <span className="font-semibold text-lg text-gray-900 dark:text-white">Workforce</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{summary.workforce?.totalEmployees} workers</div>
          <div className="flex gap-2 flex-wrap">
            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium">
              Attendance Rate: {summary.workforce?.attendanceRateToday}%
            </span>
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">
              Overtime: {summary.workforce?.attendanceOvertimeToday}%
            </span>
          </div>
        </div>

        {/* Machines Section */}
        <div
          className="rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm flex flex-col gap-4 min-w-[220px] cursor-pointer"
          tabIndex={0}
          aria-label="View Machines Details"
          onClick={() => setModalSection('machines')}
        >
          <div className="flex items-center gap-2">
            <Cog6ToothIcon className="w-5 h-5 text-gray-500" />
            <span className="font-semibold text-lg text-gray-900 dark:text-white">Machines</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{summary.machines?.totalMachines}</div>
          <div className="flex gap-2 flex-wrap">
            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium">
              Running: {summary.machines?.runningMachines}
            </span>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium">
              Idle: {summary.machines?.idleMachines}
            </span>
            <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-medium">
              Maintenance: {summary.machines?.maintenanceMachines}
            </span>
            <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-medium">
              Offline: {summary.machines?.offlineMachines}
            </span>
          </div>
        </div>

        {/* Financials Section */}
        <div
          className="rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm flex flex-col gap-4 min-w-[220px] cursor-pointer"
          tabIndex={0}
          aria-label="View Financials Details"
          onClick={() => setModalSection('financials')}
        >
          <div className="flex items-center gap-2">
            <CurrencyRupeeIcon className="w-5 h-5 text-green-500" />
            <span className="font-semibold text-lg text-gray-900 dark:text-white">Financials</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            ₹{summary.financial?.receivables?.total?.toLocaleString() ?? '0'}
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium">
              Receivables: ₹{summary.financial?.receivables?.total?.toLocaleString() ?? '0'}
            </span>
            <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-medium">
              Overdue: ₹{summary.financial?.receivables?.overdue?.toLocaleString() ?? '0'}
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">
              Payables: ₹{summary.financial?.payables?.total?.toLocaleString() ?? '0'}
            </span>
            <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-xs font-medium">
              Overdue: ₹{summary.financial?.payables?.overdue?.toLocaleString() ?? '0'}
            </span>
          </div>
        </div>
      </div>

      {/* Modal Components */}
      <OrdersSummaryModal 
        open={modalSection === 'orders'} 
        onClose={() => setModalSection(null)}
      />
      <ProductionSummaryModal 
        isOpen={modalSection === 'production'} 
        onClose={() => setModalSection(null)}
        data={{
          totalProduction: summary.production.totalProduction,
          avgDailyProduction: 0,
          sectionProduction: {
            blow_room: summary.production.totalProduction,
            carding: summary.production.sectionProduction.carding,
            drawing: summary.production.sectionProduction.drawing,
            framing: summary.production.sectionProduction.framing,
            simplex: summary.production.sectionProduction.simplex,
            spinning: summary.production.sectionProduction.spinning,
            autoconer: summary.production.sectionProduction.autoconer,
          },
          sectionQuality: {},
          sectionDowntime: {},
          machineMetrics: summary.production.machineMetrics,
          productionTrend: [],
          productionDays: summary.production.productionDays,
        }}
      />
      <InventorySummaryModal 
        open={modalSection === 'inventory'} 
        onClose={() => setModalSection(null)}
        data={{
          lowStockItems: summary.inventory?.lowStockItems ?? 0,
          pendingFiberShortages: summary.inventory?.pendingFiberShortages ?? 0,
          topBuyers: summary.orders.topBuyers.map(b => ({
            buyer_id: b.buyer_id,
            buyer_name: b.name,
            total_order_qty: b.total_quantity,
          })),
          topSuppliers: [], // TODO: Map from summary.topSuppliers if available
        }}
      />
      {modalSection === 'machines' && summary.machines && (
        <MachinesSummaryModal
          open={true}
          onClose={() => setModalSection(null)}
          data={{
            totalMachines: summary.machines.totalMachines ?? 0,
            runningMachines: summary.machines.runningMachines ?? 0,
            idleMachines: summary.machines.idleMachines ?? 0,
            maintenanceMachines: summary.machines.maintenanceMachines ?? 0,
            offlineMachines: summary.machines.offlineMachines ?? 0,
            machineStatuses: summary.machines.machineStatuses ?? []
          }}
        />
      )}
      {modalSection === 'workforce' && summary.workforce && (
        <WorkforceSummaryModal
          open={true}
          onClose={() => setModalSection(null)}
          data={{
            totalWorkers: summary.workforce.totalEmployees ?? 0,
            presentWorkers: 0, // TODO: Map from summary.machineStatuses if available
            absentWorkers: 0, // TODO: Map from summary.machineStatuses if available
            attendanceRate: summary.workforce.attendanceRateToday ?? 0,
            overtimeHours: summary.workforce.attendanceOvertimeToday ?? 0,
            productivityScore: 0 // TODO: Map from summary.machineStatuses if available
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
            revenueTrend: 0, // TODO: Add when available in API
            expensesTrend: 0 // TODO: Add when available in API
          }}
        />
      )}
    </div>
  );
};

export default OperationsSummaryCard; 