import { useNavigate } from 'react-router-dom';
import Table from './Table';
import { OrderCreationCardProps } from '../types/dashboard';

const OrderCreationCard = ({
  orders,
  currentPage,
  itemsPerPage,
  onPageChange,
}: OrderCreationCardProps) => {
  const paginated = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const navigate = useNavigate();

  const handleGoToOrdersPage = () => {
    navigate('/orders');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Order Creation</h3>
        <div className="flex gap-2">
          <button
            onClick={handleGoToOrdersPage}
            className="bg-blue-500 text-white text-sm px-3 py-1 rounded shadow"
          >
            View All Orders
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i + 1)}
              className={`px-3 py-1 rounded border text-sm ${
                currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <Table
        headers={[
          'Date',
          'Delivery Date',
          'S/O No',
          'Buyer',
          'Shade Code',
          'Qty (kg)',
          'Status',
        ]}
        rows={paginated.map((order) => [
          new Date(order.created_at).toLocaleDateString('en-GB'),
          new Date(order.delivery_date).toLocaleDateString('en-GB'),
          order.order_number,
          order.buyer?.name || order.buyer_name || '-',
          order.shade?.shade_code || '-',
          order.quantity_kg?.toString() || '0',
          order.status,
        ])}
      />
    </div>
  );
};

export default OrderCreationCard;