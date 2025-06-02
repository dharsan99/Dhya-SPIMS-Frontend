import React, { useEffect, useState } from 'react';
import { Order } from '../../types/order';
import OrderFormModal, { OrderFormData } from '../OrderFormModal';
import OrdersTable from './OrdersTable';
import Pagination from '../Pagination';
import { createOrder, updateOrder, deleteOrder } from '../../api/orders';
import useAuthStore from '../../hooks/auth';

interface OrdersTabProps {
  orders: Order[];
  onRefresh: () => Promise<void>;
}

const OrdersTab: React.FC<OrdersTabProps> = ({ orders, onRefresh }) => {
  const auth = useAuthStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderFormData | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setPage(1); // Reset pagination when orders change
  }, [orders]);


  const handleSubmit = async (data: Omit<OrderFormData, 'order_number' | 'order_date'>) => {
    try {
      const sanitized = {
        ...data,
        tenant_id: auth.user?.tenant_id || '',
        created_by: auth.user?.id || '',
        status: data.status === 'dispatched' ? 'completed' : data.status,
      };

      if (editingOrder?.id) {
        await updateOrder(editingOrder.id, sanitized);
      } else {
        await createOrder(sanitized);
      }

      setModalOpen(false);
      setEditingOrder(null);
      await onRefresh();
    } catch (error) {
      console.error('Failed to submit order:', error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">Orders</h2>
        <button
          onClick={() => {
            setEditingOrder(null); // Reset form for new order
            setModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Order
        </button>
      </div>

      <OrdersTable
  orders={orders} // full list
  onEdit={(order) => {
    const orderDate = new Date(order.created_at).toISOString().split('T')[0];
    setEditingOrder({
      id: order.id,
      buyer_id: order.buyer_id,
      shade_id: order.shade_id,
      tenant_id: order.tenant_id,
      order_number: order.order_number,
      quantity_kg: Number(order.quantity_kg),
      order_date: orderDate,
      delivery_date: order.delivery_date.split('T')[0],
      status: order.status as OrderFormData['status'],
      created_by: order.created_by,
      count: order.count || undefined,
    });
    setModalOpen(true);
  }}
  onDelete={(id) => setConfirmDeleteId(id)}
/>

      {orders.length > rowsPerPage && (
        <Pagination
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          total={orders.length}
          options={[5, 10, 20, 50]}
        />
      )}

      <OrderFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingOrder || undefined}
      />

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Confirm Deletion
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this order? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    if (confirmDeleteId) {
                      await deleteOrder(confirmDeleteId);
                      await onRefresh();
                    }
                    setConfirmDeleteId(null);
                  } catch (error) {
                    console.error('Failed to delete order:', error);
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrdersTab;