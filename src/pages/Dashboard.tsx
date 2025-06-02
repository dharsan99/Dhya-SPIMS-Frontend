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

import PendingOrdersCard from '../components/PendingOrdersCard';
import PendingFibersCard from '../components/PendingFibersCard';
import PendingSuppliersCard from '../components/PendingSuppliersCard';
import ReceiveTransferModal from '../components/ReceiveTransferModal';

import { computePendingFibres, convertSummaryToEntries } from '../utils/computePendingFibres';
import useAuthStore from '../hooks/auth';

const Dashboard = () => {
  const auth = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedTransferId, setSelectedTransferId] = useState<string | null>(null);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);

  const {
    data: orders = [],
    isLoading: loadingOrders,
    error: errorOrders,
  } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: getAllOrders,
  });

  const {
    isLoading: loadingFibres,
    error: errorFibres,
  } = useQuery<Fiber[]>({
    queryKey: ['lowStockFibres'],
    queryFn: getLowStockFibres,
  });

  const {
    data: pendingTransfers = [],
    isLoading: loadingTransfers,
    error: errorTransfers,
  } = useQuery<FibreTransfer[]>({
    queryKey: ['pendingTransfers'],
    queryFn: getPendingSupplierTransfers,
  });

  const summary = computePendingFibres(orders);
  const pendingFibres = convertSummaryToEntries(summary);
  const totalOrders = orders.length;
  const pendingDeliveries = orders.filter((o) => o.status === 'pending').length;
  const today = new Date().toISOString().split('T')[0];
const productionToday = orders
  .filter(o => o.status === 'pending' && o.created_at.startsWith(today))
  .reduce((sum, o) => sum + Number(o.quantity_kg || 0), 0);

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

  const handleReceiveUpdate = (id: string) => {
    setSelectedTransferId(id);
    setIsReceiveModalOpen(true);
  };


  if (loadingOrders || loadingFibres || loadingTransfers)
    return <div className="p-6 text-gray-800 dark:text-white">Loading...</div>;

  if (errorOrders || errorFibres || errorTransfers) {
    console.error('Dashboard load error:', { errorOrders, errorFibres, errorTransfers });
    return <div className="p-6 text-red-600 dark:text-red-400">Error loading dashboard data</div>;
  }

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

  return (
    <div className="p-6 transition-colors duration-300 dark:bg-gray-900 dark:text-white min-h-screen">
      <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border-l-4 border-blue-500">
          <p className="text-gray-500 dark:text-gray-300 text-sm">Total Orders</p>
          <p className="text-2xl font-semibold">{totalOrders}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border-l-4 border-green-500">
          <p className="text-gray-500 dark:text-gray-300 text-sm">Production Today</p>
          <p className="text-2xl font-semibold">{productionToday.toLocaleString()} <span className="text-sm">kg</span></p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border-l-4 border-yellow-500">
          <p className="text-gray-500 dark:text-gray-300 text-sm">Pending Deliveries</p>
          <p className="text-2xl font-semibold">{pendingDeliveries}</p>
        </div>
      </div>

      <PendingOrdersCard data={orders} />
      <PendingFibersCard data={pendingFibres} />
      <PendingSuppliersCard data={pendingTransfers} onUpdate={handleReceiveUpdate} />

      <ReceiveTransferModal
  isOpen={isReceiveModalOpen}
  onClose={() => {
    setIsReceiveModalOpen(false);
    setSelectedTransferId(null);
  }}
  onSubmit={({ returned_kg, return_date, remarks }) => {
    if (!selectedTransferId) return;

    receiveTransferMutation.mutate({
      id: selectedTransferId,
      received_qty: returned_kg,
      received_date: return_date,
      remarks,
    });

    setIsReceiveModalOpen(false);
    setSelectedTransferId(null);
  }}
/>
    </div>
  );
};

export default Dashboard;