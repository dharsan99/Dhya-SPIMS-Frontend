// src/pages/Dashboard.tsx
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { getAllOrders } from '../api/orders';
import { getLowStockFibres } from '../api/fibers';
import { Order } from '../types/order';
import { Fiber } from '../types/fiber';

import PendingOrdersCard from '../components/PendingOrdersCard';
import PendingFibersCard from '../components/PendingFibersCard';
import ProductionSummaryCard from '../components/ProductionSummaryCard';
import ReceivablesPayablesCard from '../components/ReceivablesPayablesCard';
import {
  computePendingFibres,
  convertSummaryToEntries,
} from '../utils/computePendingFibres';

const Dashboard = () => {
  const [] = useState(1);

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

  const summary = computePendingFibres(orders);
  const pendingFibres = convertSummaryToEntries(summary);
  const totalOrders = orders.length;
  const pendingDeliveries = orders.filter((o) => o.status === 'pending').length;
  const productionToday = 2450;

  if (loadingOrders || loadingFibres) return <div className="p-6">Loading...</div>;
  if (errorOrders || errorFibres)
    return <div className="p-6 text-red-600">Error loading dashboard data</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-blue-600 mb-6">Dashboard Overview</h2>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-4 border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <p className="text-2xl font-semibold">{totalOrders}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Production Today</p>
          <p className="text-2xl font-semibold">
            {productionToday.toLocaleString()} <span className="text-sm">kg</span>
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 border-l-4 border-yellow-500">
          <p className="text-gray-500 text-sm">Pending Deliveries</p>
          <p className="text-2xl font-semibold">{pendingDeliveries}</p>
        </div>
      </div>

      {/* Pending Orders */}
      <PendingOrdersCard data={orders} />

      {/* Pending Fibres */}
      <PendingFibersCard data={pendingFibres} />

      {/* Production Summary */}
      <ProductionSummaryCard />

      {/* Receivables / Payables */}
      <ReceivablesPayablesCard
        data={[
          {
            type: 'Receivable',
            party_name: 'Vishnu Textiles',
            amount: 12000,
            due_date: '2025-04-01',
            status: 'due',
          },
          {
            type: 'Payable',
            party_name: 'NSC Yarns',
            amount: 8000,
            due_date: '2025-04-15',
            status: 'overdue',
          },
        ]}
      />
    </div>
  );
};

export default Dashboard;