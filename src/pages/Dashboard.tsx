import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { getAllOrders } from '../api/orders';
import { getLowStockFibres } from '../api/fibers';
import {
  getPendingSupplierTransfers,
  updateFibreTransferReceive,
} from '../api/fibreTransfers';

import { Order } from '../types/order';
import { Fiber } from '../types/fiber';
import { FibreTransfer } from '../types/fibreTransfer';
import { DashboardSummary } from '../types/dashboard';

import PendingOrdersCard from '../components/PendingOrdersCard';
import PendingFibersCard from '../components/PendingFibersCard';
import ReceiveTransferModal from '../components/ReceiveTransferModal';
import { WhatsNewPanel } from '../components/WhatsNewPanel';
import { QuickActions } from '../components/QuickActions';
import { DashboardCard } from '../components/DashboardCard';
import OperationsSummaryCard from '../components/OperationsSummaryCard';

import { computePendingFibres, convertSummaryToEntries } from '../utils/computePendingFibres';
import useAuthStore from '../hooks/auth';
import { fetchDashboardData } from '../api/dashboard';

const Dashboard: React.FC = () => {
  const auth = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedTransferId, setSelectedTransferId] = useState<string | null>(null);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [] = useState<string | null>(null);
  const [showWhatsNew, setShowWhatsNew] = useState(true);

  const {
    data: orders = [],
    isLoading: loadingOrders,
  } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: () => getAllOrders({}),
  });

  const {
    isLoading: loadingFibres,
  } = useQuery<Fiber[]>({
    queryKey: ['lowStockFibres'],
    queryFn: getLowStockFibres,
  });

  const {
    isLoading: loadingTransfers,
  } = useQuery<FibreTransfer[]>({
    queryKey: ['pendingTransfers'],
    queryFn: getPendingSupplierTransfers,
  });

  const summary = computePendingFibres(orders);
  const pendingFibres = convertSummaryToEntries(summary);

  const receiveTransferMutation = useMutation({
    mutationFn: ({ id, received_qty, received_date, remarks }: {
      id: string;
      received_qty: number;
      received_date: string;
      remarks?: string;
    }) => updateFibreTransferReceive(id, { received_qty, received_date, remarks }),
    onSuccess: () => {
      toast.success('Supplier return updated');
      queryClient.invalidateQueries({ queryKey: ['pendingTransfers'] });
    },
    onError: () => toast.error('Failed to update return'),
  });

  const handleQuickAction = (actionId: string) => {
    // Handle quick actions
    console.log('Quick action:', actionId);
  };


  const { data: dashboardData, isLoading: loadingDashboardData } = useQuery<DashboardSummary>({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
  });

  if (loadingOrders || loadingFibres || loadingTransfers || loadingDashboardData)
    return <div className="p-6 text-gray-800 dark:text-white">Loading...</div>;

  if (auth.user?.email === 'orders@nscspinning.com') {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
        <h1 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">
          Welcome to SPIMS
        </h1>
        <p className="mb-8 text-lg text-center max-w-md">
          You are logged in as an <strong>Order Staff</strong>. Click below to manage orders.
        </p>
        <button
          onClick={() => navigate('/app/orders')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          Proceed to Add Orders
        </button>
      </div>
    );
  }

  if (summary) {
    console.log("Operations summary data:", summary);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="p-6">
     
        {/* What's New / Continue Setup Wizard */}
        <div className="my-6 flex flex-col items-center">
          <div className="mb-2 text-lg font-semibold text-blue-700">What's New?</div>
          <button
            onClick={() => navigate('/app/setup-wizard')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition shadow-md"
          >
            Continue Setup Wizard
          </button>
        </div>

        {/* Summary Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <DashboardCard
            title="Total Orders"
            value={dashboardData?.orders.totalOrders ?? '--'}
            trend={dashboardData?.orders.pendingOrders ?? 0}
            color="blue"
          />
          <DashboardCard
            title="Production Today"
            value={dashboardData?.production.totalProduction ?? '--'}
            trend={dashboardData?.production.avgDailyProduction ?? 0}
            color="green"
          />
          <DashboardCard
            title="Attendance Rate Today"
            value={dashboardData?.workforce?.attendanceRateToday ? `${dashboardData.workforce.attendanceRateToday}%` : '--'}
            trend={dashboardData?.workforce?.attendanceOvertimeToday ?? 0}
            color="blue"
          />
          <DashboardCard
            title="Machine Efficiency"
            value={dashboardData?.machines?.runningMachines ?? '--'}
            trend={dashboardData?.machines?.idleMachines ?? 0}
            color="yellow"
          />
        </div>

  

        {/* Rest of the components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PendingOrdersCard data={orders} />
          <PendingFibersCard data={pendingFibres} />
        </div>
              {/* Operations Summary */}
              <OperationsSummaryCard summary={dashboardData} />

        {/* Quick Actions */}
        <QuickActions onAction={handleQuickAction} />

        {/* What's New Panel */}
        {showWhatsNew && <WhatsNewPanel onClose={() => setShowWhatsNew(false)} />}
      </div>

      {/* Receive Transfer Modal */}
      {isReceiveModalOpen && selectedTransferId && (
        <ReceiveTransferModal
          isOpen={isReceiveModalOpen}
          onClose={() => {
            setIsReceiveModalOpen(false);
            setSelectedTransferId(null);
          }}
          onSubmit={({ returned_kg, return_date, remarks }) => {
            receiveTransferMutation.mutate({
              id: selectedTransferId,
              received_qty: returned_kg,
              received_date: return_date,
              remarks
            });
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;