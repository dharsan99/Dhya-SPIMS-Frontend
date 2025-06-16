import React from 'react';
import { SectionProgress } from '../utils/sectionProgress';
import { Order } from '../types/order';
import { updateOrderStatus } from '../api/orders';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

interface Props {
  order: Order;
  sectionProgress: SectionProgress[];
  onStatusChange?: () => void;
}

const SectionProgressPanel: React.FC<Props> = ({ order, sectionProgress, onStatusChange }) => {
  const queryClient = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: (status: 'completed' | 'dispatched') => updateOrderStatus(order.id, status),
    onSuccess: (_, status) => {
      toast.success(`Order marked as ${status}`);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      onStatusChange?.();
    },
    onError: () => toast.error('Failed to update order status'),
  });

  const isCompleted = order.status === 'completed';
  const isDispatched = order.status === 'dispatched';
  const canComplete = order.status === 'in_progress' && sectionProgress.every(sp => sp.percent >= 100);
  const canDispatch = order.status === 'completed';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Production Progress</h3>
        <div className="space-x-2">
          {canComplete && (
            <button
              onClick={() => updateStatus.mutate('completed')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Mark as Completed
            </button>
          )}
          {canDispatch && (
            <button
              onClick={() => updateStatus.mutate('dispatched')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Mark as Dispatched
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {sectionProgress.map((sp) => (
          <div key={sp.section} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">{sp.section}</span>
              <span className="text-gray-600 dark:text-gray-400">
                {sp.produced.toFixed(2)} / {sp.required.toFixed(2)} kg
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  sp.percent >= 100
                    ? 'bg-green-500'
                    : sp.percent >= 75
                    ? 'bg-blue-500'
                    : sp.percent >= 50
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${sp.percent}%` }}
              />
            </div>
            <div className="text-xs text-right text-gray-500 dark:text-gray-400">
              {sp.percent.toFixed(1)}% Complete
            </div>
          </div>
        ))}
      </div>

      {isCompleted && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
          <p className="text-green-700 dark:text-green-400 text-sm">
            ✓ Production completed. Ready for dispatch.
          </p>
        </div>
      )}

      {isDispatched && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <p className="text-blue-700 dark:text-blue-400 text-sm">
            ✓ Order has been dispatched.
          </p>
        </div>
      )}
    </div>
  );
};

export default SectionProgressPanel; 