import React, { useEffect, useMemo, useState } from 'react';
import { Order } from '../../types/order';
import Pagination from '../Pagination';

interface OrdersTableProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onEdit, onDelete }) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // default 5 rows

  useEffect(() => {
    setPage(1);
  }, [orders]);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return orders.slice(start, start + rowsPerPage);
  }, [orders, page, rowsPerPage]);

  const statusBadge = (status: string) => {
    const base = 'px-2 py-1 rounded text-xs font-semibold';
    switch (status) {
      case 'pending':
        return <span className={`${base} bg-yellow-100 text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-300`}>Pending</span>;
      case 'in_progress':
        return <span className={`${base} bg-blue-100 text-blue-700 dark:bg-blue-700/20 dark:text-blue-300`}>In Progress</span>;
      case 'completed':
        return <span className={`${base} bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-300`}>Completed</span>;
      default:
        return <span className={`${base} bg-gray-200 text-gray-700 dark:bg-gray-600/30 dark:text-gray-300`}>{status}</span>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Order No</th>
              <th className="px-4 py-3">Buyer</th>
              <th className="px-4 py-3">Shade</th>
              <th className="px-4 py-3 text-right">Qty (kg)</th>
              <th className="px-4 py-3">Count</th>
              <th className="px-4 py-3">Order Date</th>
              <th className="px-4 py-3">Delivery</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="px-4 py-2 font-medium text-blue-700 dark:text-blue-400">
                    {order.order_number}
                  </td>
                  <td className="px-4 py-2">{order.buyer?.name || <i className="text-gray-400">—</i>}</td>
                  <td className="px-4 py-2">{order.shade?.shade_code || <i className="text-gray-400">—</i>}</td>
                  <td className="px-4 py-2 text-right">{Number(order.quantity_kg).toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">{order.count ?? <i className="text-gray-400">—</i>}</td>
                  <td className="px-4 py-2">{new Date(order.created_at).toLocaleDateString('en-GB')}</td>
                  <td className="px-4 py-2">{new Date(order.delivery_date).toLocaleDateString('en-GB')}</td>
                  <td className="px-4 py-2">{statusBadge(order.status)}</td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(order)}
                        className="px-3 py-1 text-xs font-medium bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(order.id)}
                        className="px-3 py-1 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-6 text-center text-gray-500 italic dark:text-gray-400">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        total={orders.length}
        options={[5, 10, 20, 50]}
      />
    </div>
  );
};

export default OrdersTable;