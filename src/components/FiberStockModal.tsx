import { useQuery } from '@tanstack/react-query';
import { getFiberUsageTrend } from '../api/fibers';

interface Props {
  fibreId: string;
  fibreCode: string;
  requiredQty: string;
  availableQty: string;
  balanceAfter: string;
  onClose: () => void;
}

const FiberStockModal = ({
  fibreId,
  fibreCode,
  requiredQty,
  availableQty,
  balanceAfter,
  onClose,
}: Props) => {
  const { data: usageTrend = [], isLoading } = useQuery({
    queryKey: ['fiberTrend', fibreId],
    queryFn: () => getFiberUsageTrend(fibreId),
  });

  const required = parseFloat(requiredQty);
  const available = parseFloat(availableQty);
  const remaining = parseFloat(balanceAfter);
  const shortage = required > available;
  const usagePercentage = Math.min((required / (available || 1)) * 100, 100);

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/10 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">
          Fibre Stock Summary
        </h2>

        <div className="text-sm space-y-2 text-gray-700 dark:text-gray-200">
          <div><strong>Fibre Code:</strong> {fibreCode}</div>
          <div><strong>Required Quantity:</strong> {requiredQty} kg</div>
          <div><strong>Available Stock:</strong> {availableQty} kg</div>
          <div>
            <strong>Remaining After Order:</strong>{' '}
            <span className={shortage ? 'text-red-600 font-bold' : 'text-green-500 font-medium'}>
              {remaining.toFixed(2)} kg
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Usage</span>
            <span>{usagePercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-4 rounded-full transition-all duration-500 ease-in-out ${
                shortage ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        </div>

        {/* Usage Trend Section */}
        {!isLoading && usageTrend.length > 0 && (
          <div className="mt-5">
            <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
              📈 Usage History
            </h4>
            <ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
              {usageTrend.map((t: { date: string; usedKg: number }, idx: number) => (
                <li key={idx} className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>{new Date(t.date).toLocaleDateString('en-GB')}</span>
                  <span>{t.usedKg.toFixed(2)} kg</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiberStockModal;