import React, { useEffect, useState } from 'react';
import { DashboardSummary } from '../../types/dashboard';
import { fetchDashboardData } from '../../api/dashboard';
import TruncatedText from '../ui/TruncatedText';

interface OrdersSummaryModalProps {
  open: boolean;
  onClose: () => void;
}

const OrdersSummaryModal: React.FC<OrdersSummaryModalProps> = ({ open, onClose }) => {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    fetchDashboardData()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, [open]);

  if (!open) return null;
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/10 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100 flex items-center justify-center">
          <span className="text-gray-500">Loading...</span>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/10 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100 flex flex-col items-center justify-center">
          <span className="text-red-500 mb-4">{error}</span>
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm">Close</button>
        </div>
      </div>
    );
  }
  if (!data) return null;
  const orders = data.orders;
  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/10 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Orders Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl font-bold px-2" aria-label="Close">&times;</button>
        </div>
        <div className="text-gray-700 dark:text-gray-200 mb-6">
          <div className="space-y-4">
            <div className="text-2xl font-bold">{orders.totalOrders} Total Orders</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="text-sm text-yellow-700">Pending Orders</div>
                <div className="text-xl font-semibold">{orders.pendingOrders}</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="text-sm text-red-700">Overdue Orders</div>
                <div className="text-xl font-semibold">{orders.overdueOrders}</div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Order Status Breakdown</h3>
              <div className="space-y-2">
                {Object.entries(orders.statusBreakdown).map(([status, count]) => (
                  <div className="flex justify-between" key={status}>
                    <span>{status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Top Buyers</h3>
              <div className="space-y-2">
                {orders.topBuyers.slice(0, 2).map((buyer, idx) => (
                  <div className="flex justify-between" key={buyer.buyer_id || `${buyer.name}-${idx}`}>
                    <span className="max-w-[120px]">
                      <TruncatedText text={buyer.name} maxLength={6} />
                    </span>
                    <span className="text-gray-700 dark:text-gray-200 ml-2 whitespace-nowrap">
                      {buyer.order_count} orders / {buyer.total_quantity} kg
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm">Close</button>
        </div>
      </div>
    </div>
  );
};

export default OrdersSummaryModal; 