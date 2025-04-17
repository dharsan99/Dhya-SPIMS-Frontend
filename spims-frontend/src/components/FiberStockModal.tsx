
interface Props {
  fibreCode: string;
  requiredQty: string;
  availableQty: string;
  balanceAfter: string; // ✅ add this line
  onClose: () => void;
}

const FiberStockModal = ({ fibreCode, requiredQty, availableQty, onClose }: Props) => {
  const required = parseFloat(requiredQty);
  const available = parseFloat(availableQty);
  const remaining = (available - required).toFixed(2);
  const shortage = required > available;
  const usagePercentage = Math.min((required / available) * 100, 100);

  return (
<div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/10 flex items-center justify-center">      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-800">📦 Fibre Stock Details</h2>

        <div className="text-sm space-y-2">
          <div>
            <strong>Fibre Code:</strong> {fibreCode}
          </div>
          <div>
            <strong>Required Quantity:</strong> {requiredQty} kg
          </div>
          <div>
            <strong>Available Stock:</strong>{' '}
            <span className={shortage ? 'text-red-600 font-bold' : 'text-green-700 font-medium'}>
              {availableQty} kg
            </span>
          </div>
          <div>
            <strong>Remaining After Order:</strong>{' '}
            <span className={shortage ? 'text-red-600 font-bold' : 'text-green-700 font-medium'}>
              {remaining} kg
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Usage</span>
            <span>{usagePercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-4 rounded-full transition-all duration-500 ease-in-out ${
                shortage ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        </div>

        {shortage && (
          <div className="text-red-500 text-sm mt-3">
            ⚠️ This order requires more stock than available.
          </div>
        )}

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiberStockModal;