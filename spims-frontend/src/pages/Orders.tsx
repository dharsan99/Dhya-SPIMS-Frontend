import React, { useState, useEffect } from 'react';
import { getAllOrders, createOrder, updateOrder, deleteOrder } from '../api/orders';
import Loader from '../components/Loader';
import OrderFormModal, { OrderFormData } from '../components/OrderFormModal';

interface Order extends OrderFormData {
  created_at: string | number | Date;
  yarns: any;
  id: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreate = () => {
    setEditingOrder(null);
    setModalOpen(true);
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setModalOpen(true);
  };

  const handleSubmit = async (data: OrderFormData) => {
    try {
      if (editingOrder) {
        await updateOrder(editingOrder.id, { ...data }); // This can include status
      } else {
        const { status, ...cleanData } = data; // ❌ Remove status for POST
        await createOrder(cleanData);
      }
      fetchOrders();
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOrder(id);
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-blue-600 mb-4">Orders</h1>
      <button onClick={handleCreate} className="bg-blue-600 text-white py-2 px-4 rounded mb-6">+ Create Order</button>

      <OrderFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingOrder || undefined}
      />

      <div className="overflow-x-auto">
      <table className="table-auto w-full">
  <thead>
    <tr>
      <th className="border px-4 py-2">Date</th>
      <th className="border px-4 py-2">Delivery Date</th>
      <th className="border px-4 py-2">S/O No</th>
      <th className="border px-4 py-2">Buyer Name</th>
      <th className="border px-4 py-2">Count</th>
      <th className="border px-4 py-2">Shade No</th>
      <th className="border px-4 py-2">Blend</th>
      <th className="border px-4 py-2">Qty (Kgs)</th>
      
      <th className="border px-4 py-2">Status</th>
      <th className="border px-4 py-2">Actions</th>
    </tr>
  </thead>
  <tbody>
    {orders.map((order) => (
      <tr key={order.id}>
        <td className="border px-4 py-2">
  {new Date(order.created_at).toLocaleDateString('en-GB')}
</td>
<td className="border px-4 py-2">
          {new Date(order.delivery_date).toLocaleDateString('en-GB')}
        </td>
        <td className="border px-4 py-2">{order.order_number}</td>
        <td className="border px-4 py-2">{order.buyer_name}</td>
        <td className="border px-4 py-2">{order.yarns?.count_range || '-'}</td>
        <td className="border px-4 py-2">{order.yarns?.base_shade || '-'}</td>
        <td className="border px-4 py-2">
          {order.yarns?.blend_id?.substring(0, 8) || '-'}
        </td>
        <td className="border px-4 py-2">{order.quantity_kg}</td>
        
        <td className="border px-4 py-2 text-sm font-medium">
          <span
            className={`px-2 py-1 rounded ${
              order.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : order.status === 'in_progress'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {order.status}
          </span>
        </td>
        <td className="border px-4 py-2 space-x-2">
          <button
            onClick={() => handleEdit(order)}
            className="bg-yellow-500 text-white px-2 py-1 rounded"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(order.id)}
            className="bg-red-600 text-white px-2 py-1 rounded"
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
      </div>
    </div>
  );
};

export default Orders;