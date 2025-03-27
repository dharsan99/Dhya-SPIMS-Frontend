// src/components/PendingOrdersCard.tsx
import Table from './Table';
import { Order } from '../types/order';

interface PendingOrdersCardProps {
  data: Order[];
}

const PendingOrdersCard = ({ data }: PendingOrdersCardProps) => {
  const pendingOrders = data.filter(order => order.status === 'pending');

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Pending Orders</h3>
      </div>

      <Table
        headers={['Date', 'S/O No', 'Shade No', 'Blend ID', 'Qty (Kgs)', 'Delivery Date', 'Status']}
        rows={pendingOrders.map((order) => [
          new Date(order.created_at).toLocaleDateString(),
          order.order_number,
          order.yarns?.base_shade ?? '-',
          order.yarns?.blend_id?.slice(0, 8) ?? '-', // You can replace this with blend name if available
          order.quantity_kg?.toString() ?? '0',
          new Date(order.delivery_date).toLocaleDateString(),
          order.status,
        ])}
      />
    </div>
  );
};

export default PendingOrdersCard;