import { FC } from 'react';

interface Order {
  id: string;
  order_number: string;
  buyer_name: string;
  quantity_kg: number;
  delivery_date: string;
}

interface OrderSelectPanelProps {
  orders: Order[];
  selectedOrderId: string;
  onSelect: (id: string) => void;
}

const OrderSelectPanel: FC<OrderSelectPanelProps> = ({
  orders,
  selectedOrderId,
  onSelect,
}) => {
  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  return (
    <div className="bg-white p-4 rounded shadow space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-blue-700 font-semibold">Select Order</h3>
        <select
  className="border p-2 rounded text-sm"
  value={selectedOrderId}
  onChange={(e) => onSelect(e.target.value)}
>
  <option value="" disabled>Select an order</option>
  {orders.map((order) => (
    <option key={order.id} value={order.id}>
      {order.order_number} – {order.buyer_name}
    </option>
  ))}
</select>
      </div>

      {selectedOrder && (
        <div className="text-sm text-gray-700 grid sm:grid-cols-2 gap-2">
          <p><strong>Order No:</strong> {selectedOrder.order_number}</p>
          <p><strong>Buyer:</strong> {selectedOrder.buyer_name}</p>
          <p><strong>Quantity:</strong> {selectedOrder.quantity_kg} kg</p>
          <p>
  <strong>Delivery Date:</strong>{' '}
  <span
    className={`px-2 py-1 rounded text-white text-xs ${
      new Date(selectedOrder.delivery_date) < new Date()
        ? 'bg-red-500'
        : 'bg-green-500'
    }`}
  >
    {new Date(selectedOrder.delivery_date).toLocaleDateString('en-GB')}
  </span>
</p>
        </div>
      )}
    </div>
  );
};

export default OrderSelectPanel;