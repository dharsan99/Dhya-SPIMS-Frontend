import { useEffect, useState } from 'react';
import { getAllPurchaseOrders } from '../../api/purchaseOrders';
import {
  PurchaseOrder,
} from '../../types/purchaseOrder';

import Loader from '../Loader';
import PurchaseOrderTable from './PurchaseOrderTable';
import UploadPurchaseOrderModal from './purchaseorders/UploadPurchaseOrderModal'; // ✅ Import

const PurchaseOrdersTab = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // ✅ modal state

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllPurchaseOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching purchase orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  if (loading) return <Loader />;

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

      <PurchaseOrderTable orders={orders} onRefresh={fetchPurchaseOrders} />

      <UploadPurchaseOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
          onParsed={fetchPurchaseOrders} // ✅ correct prop name
      />
    </div>
  );
};

export default PurchaseOrdersTab;