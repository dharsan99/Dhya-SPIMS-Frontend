import React, { useState } from 'react';
import {
  PurchaseOrder,
  PurchaseOrderFormValues,
} from '../../types/purchaseOrder';
import PurchaseOrderModal from './purchaseorders/PurchaseOrderModal';
import { updatePurchaseOrder } from '../../api/purchaseOrders';

interface Props {
  orders?: PurchaseOrder[];
  onRefresh: () => void;
}

const PurchaseOrderTable: React.FC<Props> = ({ orders = [], onRefresh }) => {
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');

  const openModal = (order: PurchaseOrder, mode: 'view' | 'edit') => {
    setSelectedOrder(order);
    setModalMode(mode);
    setIsReviewOpen(true);
  };

  const closeReviewModal = () => {
    setSelectedOrder(null);
    setIsReviewOpen(false);
  };

  // 🔧 Add this function to handle saving updated order

const handleSave = async (data: PurchaseOrderFormValues, orderId: string) => {
  try {
    await updatePurchaseOrder(orderId, data);
    onRefresh();
    setIsReviewOpen(false);
    setSelectedOrder(null);
  } catch (error) {
    console.error('❌ Failed to update order:', error);
  }
};

  const isEmpty = !orders.length;

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <>
      <div className="border rounded overflow-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white">
            <tr>
              <th className="px-4 py-2">PO NO</th>
              <th className="px-4 py-2">Buyer</th>
              <th className="px-4 py-2">Shade</th>
              <th className="px-4 py-2">Qty (KG)</th>
              <th className="px-4 py-2">Order Date</th>
              <th className="px-4 py-2">Delivery</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {isEmpty ? (
              <tr>
                <td colSpan={8} className="text-center text-gray-500 py-8">
                  No purchase orders available.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td
                    className="px-4 py-2 text-blue-600 font-medium cursor-pointer hover:underline"
                    onClick={() => openModal(order, 'view')}
                  >
                    PO-{order.po_number ?? 'N/A'}
                  </td>
                  <td className="px-4 py-2">{order.buyer_name ?? 'N/A'}</td>
                  <td className="px-4 py-2">{order.shade_code ?? '—'}</td>
                  <td className="px-4 py-2">
                    {(order.quantity_kg ?? 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-2">{formatDate(order.po_date)}</td>
                  <td className="px-4 py-2">{formatDate(order.delivery_date)}</td>
                  <td className="px-4 py-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {order.status ?? 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                      onClick={() => openModal(order, 'edit')}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

     <PurchaseOrderModal
  isOpen={isReviewOpen}
  order={selectedOrder}
  onClose={closeReviewModal}
  mode={modalMode}
  onSave={handleSave}
/>
    </>
  );
};

export default PurchaseOrderTable;