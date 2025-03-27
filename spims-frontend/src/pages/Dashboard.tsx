import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { getAllOrders } from '../api/orders';
import { Order } from '../types/order';

import OrderCreationCard from '../components/OrderCreationCard';
import PendingOrdersCard from '../components/PendingOrdersCard';
import PendingFibersCard from '../components/PendingFibersCard';
import ProductionSummaryCard from '../components/ProductionSummaryCard';
import ReceivablesPayablesCard from '../components/ReceivablesPayablesCard';

const Dashboard = () => {
  const { data: ordersResponse, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: getAllOrders,
  });

  const orders: Order[] = ordersResponse?.data || [];
  const totalOrders = orders.length;
  const productionToday = 2450;
  const pendingDeliveries = orders.filter((o) => o.status === 'pending').length;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Dummy sample data for now
  const pendingFibers = [
    {
      date: '24/03/2025',
      supplier_name: 'ABC Fibers',
      type_name: 'Cotton',
      sub_type_name: 'Combed',
      total_qty: 1200,
    },
  ];

  const productionData = [
    {
      section: 'Carding',
      shift_1: 671,
      shift_2: 359,
      shift_3: 494,
      total: 1524,
    },
  ];

  const receivablesPayables = [
    {
      type: 'Receivable',
      party_name: 'Client A',
      amount: 10000,
      due_date: '2025-04-01',
      status: 'due',
    },
    {
      type: 'Payable',
      party_name: 'Supplier X',
      amount: 5000,
      due_date: '2025-03-28',
      status: 'overdue',
    },
  ];

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error loading orders</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-blue-600 mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-4 border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <p className="text-2xl font-semibold">{totalOrders}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Production Today</p>
          <p className="text-2xl font-semibold">{productionToday.toLocaleString()} <span className="text-sm">kg</span></p>
        </div>

        <div className="bg-white shadow rounded-lg p-4 border-l-4 border-yellow-500">
          <p className="text-gray-500 text-sm">Pending Deliveries</p>
          <p className="text-2xl font-semibold">{pendingDeliveries}</p>
        </div>
      </div>

      <OrderCreationCard
        orders={orders}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      <PendingOrdersCard
        data={orders.filter((o) => o.status === 'pending')}
      />

      <PendingFibersCard data={pendingFibers} />

      <ProductionSummaryCard data={productionData} />

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