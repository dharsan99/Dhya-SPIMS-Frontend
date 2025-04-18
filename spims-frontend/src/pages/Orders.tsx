import { useState, useEffect } from 'react';
import { getAllOrders, createOrder, updateOrder, deleteOrder } from '../api/orders';
import { getBuyers, createBuyer } from '../api/buyers';
import Loader from '../components/Loader';
import OrderFormModal, { OrderFormData } from '../components/OrderFormModal';
import BuyerFormModal from '../components/BuyerFormModal';
import { Order } from '../types/order';
import { Buyer, BuyerFormData } from '../types/buyer';
import useAuthStore from '../hooks/auth';
import clsx from 'clsx';

const Orders = () => {
  const auth = useAuthStore();
  const [tab, setTab] = useState<'order' | 'buyer'>('order');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [buyerModalOpen, setBuyerModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderFormData | null>(null);
  const [buyers, setBuyers] = useState<Buyer[]>([]);

  const fetchBuyers = async () => {
    try {
      const buyersList = await getBuyers();
      setBuyers(buyersList);
    } catch (error) {
      console.error('Error fetching buyers:', error);
    }
  };
  const fetchOrders = async () => {
    try {
      const data = await getAllOrders(); // ✅ renamed from `response`
      setOrders(data); // ✅ directly use the data
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchBuyers();
  }, []);

  const handleCreateOrder = () => {
    setEditingOrder(null);
    setModalOpen(true);
  };

  const handleEdit = (order: Order) => {
    setEditingOrder({
      id: order.id,
      buyer_id: order.buyer_id,
      shade_id: order.shade_id,
      tenant_id: order.tenant_id,
      order_number: order.order_number,
      quantity_kg: Number(order.quantity_kg),
      delivery_date: order.delivery_date.split('T')[0],
      status: (order.status || 'pending') as OrderFormData['status'],
      created_by: order.created_by || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOrder(id);
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleSubmitOrder = async (data: Omit<OrderFormData, 'order_number'>) => {
    try {
      const sanitizedData = {
        ...data,
        status: (data.status === 'dispatched' ? 'completed' : data.status) as
          | 'pending'
          | 'in_progress'
          | 'completed',
      };
  
      if (editingOrder?.id) {
        await updateOrder(editingOrder.id, sanitizedData);
      } else {
        await createOrder(sanitizedData);
      }
  
      setModalOpen(false);
      fetchOrders();
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  const handleSubmitBuyer = async (data: Omit<BuyerFormData, 'tenant_id' | 'created_by'>) => {
    try {
      const user = auth.user;
      if (!user) return;
      await createBuyer(data);
      setBuyerModalOpen(false);
      fetchBuyers();
    } catch (error) {
      console.error('Error submitting buyer:', error);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <div className="flex border-b mb-6">
        {['order', 'buyer'].map((type) => (
          <button
            key={type}
            onClick={() => setTab(type as 'order' | 'buyer')}
            className={`px-4 py-2 border-b-2 font-medium ${
              tab === type
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-blue-600'
            }`}
          >
            {type === 'order' ? '🧾 Orders' : '👤 Buyers'}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        {tab === 'order' ? (
          <>
            <h2 className="text-xl font-semibold text-blue-600 mb-4">Create/Edit Order</h2>
            <button
              onClick={handleCreateOrder}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              ➕ Add Order
            </button>
            <OrderFormModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              onSubmit={handleSubmitOrder}
              initialData={editingOrder || undefined}
            />
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-blue-600 mb-4">Create Buyer</h2>
            <button
              onClick={() => setBuyerModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              ➕ Add Buyer
            </button>
            <BuyerFormModal
              isOpen={buyerModalOpen}
              onClose={() => setBuyerModalOpen(false)}
              onSubmit={handleSubmitBuyer}
            />
          </>
        )}
      </div>

      {tab === 'order' ? (
        <div className="overflow-x-auto bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Order List</h2>
          <table className="table-auto w-full text-sm">
            <thead>
              <tr>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Delivery</th>
                <th className="border px-4 py-2">S/O No</th>
                <th className="border px-4 py-2">Buyer</th>
                <th className="border px-4 py-2">Shade</th>
                <th className="border px-4 py-2">Qty (kg)</th>
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
                  <td className="border px-4 py-2">{order.buyer?.name || '-'}</td>
                  <td className="border px-4 py-2">{order.shade?.shade_code || '-'}</td>
                  <td className="border px-4 py-2">{order.quantity_kg}</td>
                  <td className="border px-4 py-2">
                    <span
                      className={clsx(
                        'px-2 py-1 rounded text-sm font-medium',
                        order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      )}
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
              {orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500 italic">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Buyer List</h2>
          <table className="table-auto w-full text-sm">
            <thead>
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Contact</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Address</th>
              </tr>
            </thead>
            <tbody>
              {buyers.map((buyer) => (
                <tr key={buyer.id}>
                  <td className="border px-4 py-2">{buyer.name}</td>
                  <td className="border px-4 py-2">{buyer.contact || '-'}</td>
                  <td className="border px-4 py-2">{buyer.email || '-'}</td>
                  <td className="border px-4 py-2">{buyer.address || '-'}</td>
                </tr>
              ))}
              {buyers.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500 italic">
                    No buyers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;