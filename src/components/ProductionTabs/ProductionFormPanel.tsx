// src/components/ProductionTabs/ProductionFormPanel.tsx

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AddProductionPanel from './addproduction/AddProductionPanel';
import { getAllOrders } from '../../api/orders'; // ✅ Adjust path if needed
import { Order } from '../../types/order';
import Loader from '../Loader';

const ProductionFormPanel = () => {
  const [modalOpen, setModalOpen] = useState(false);

  // ✅ Fetch orders for the dropdown
  const {
    data: orders = [],
    isLoading: loadingOrders,
    isError,
  } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: () => getAllOrders({}),
  });

  if (isError) {
    return (
      <div className="bg-white p-6 rounded shadow text-red-600">
        ❌ Failed to load orders. Please try again.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-blue-700">➕ Add New Production</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Entry
        </button>
      </div>

      <p className="text-sm text-gray-500">
        Ensure continuity with last production entry.
      </p>

      {loadingOrders && <Loader />}

      <AddProductionPanel
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        orders={orders}
        loadingOrders={loadingOrders}
      />
    </div>
  );
};

export default ProductionFormPanel;