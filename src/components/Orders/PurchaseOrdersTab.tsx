import { useState } from 'react';
import { getAllPurchaseOrders } from '../../api/purchaseOrders';
import {
  PurchaseOrder,
} from '../../types/purchaseOrder';

import Loader from '../Loader';
import PurchaseOrderTable from './PurchaseOrderTable';
import UploadPurchaseOrderModal from './purchaseorders/UploadPurchaseOrderModal'; // ✅ Import
import { useQuery } from '@tanstack/react-query';

const PurchaseOrdersTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

 const {
    data: orders = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<PurchaseOrder[]>({
    queryKey: ['purchaseOrders'],
    queryFn: getAllPurchaseOrders,
  });

  if (isLoading) return <Loader />;
  if (isError) return <div className="text-red-500">Error loading purchase orders.</div>;


  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Purchase Orders</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Purchase Order
        </button>
      </div>

      <PurchaseOrderTable orders={orders} onRefresh={refetch} />

      <UploadPurchaseOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
          onParsed={refetch} // ✅ correct prop name
      />
    </div>
  );
};

export default PurchaseOrdersTab;