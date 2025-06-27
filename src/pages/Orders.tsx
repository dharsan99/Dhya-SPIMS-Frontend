import { useEffect, useState } from 'react';
import { getAllOrders } from '../api/orders';
import { getBuyers } from '../api/buyers';
import { Order } from '../types/order';
import { Buyer } from '../types/buyer';

import Loader from '../components/Loader';
import OrdersTab from '../components/Orders/OrdersTab';
import BuyersTab from '../components/Orders/BuyersTab';
import PurchaseOrdersTab from '../components/Orders/PurchaseOrdersTab'; // make sure this exists
import TabHeader from '../components/Shared/TabHeader';

const Orders = () => {
  const [tab, setTab] = useState<'Purchase Order' | 'Sales Order' | 'buyer'>('Purchase Order');
  const [orders, setOrders] = useState<Order[]>([]);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const fetchBuyers = async () => {
    try {
      const data = await getBuyers();
      setBuyers(data);
    } catch (err) {
      console.error('Error fetching buyers:', err);
    }
  };

  useEffect(() => {
    Promise.all([fetchOrders(), fetchBuyers()]).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <TabHeader
        tabs={['Purchase Order', 'Sales Order', 'buyer'] as const}
        activeTab={tab}
        setActiveTab={setTab}
      />

      {tab === 'Purchase Order' ? (
        <PurchaseOrdersTab />
      ) : tab === 'Sales Order' ? (
        <OrdersTab orders={orders} onRefresh={fetchOrders} />
      ) : (
        <BuyersTab buyers={buyers} onRefresh={fetchBuyers} />
      )}
    </div>
  );
};

export default Orders;