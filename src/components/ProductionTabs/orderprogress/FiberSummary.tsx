import React from 'react';

export interface FiberUsageSummary {
    fibre_name: string;
    required_qty: number;
    consumed_qty: number;
    available_stock: number;
  }
  
  export interface FiberSummaryProps {
    data: FiberUsageSummary[];
  }

  const getStockStatusColor = (available = 0, required = 0) => {
    if (available >= required) return 'bg-green-100 text-green-800';
    if (available >= required * 0.75) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

const FiberSummary: React.FC<FiberSummaryProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-lg font-semibold text-blue-700 mb-2">
        Fiber Consumption Summary
      </h2>

      {data.length === 0 ? (
        <p className="text-sm text-gray-500">No fiber data available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2">Fiber Name</th>
                <th className="p-2">Required Qty (kg)</th>
                <th className="p-2">Consumed Qty (kg)</th>
                <th className="p-2">Available Stock (kg)</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((fiber) => {
                const statusColor = getStockStatusColor(fiber.available_stock, fiber.required_qty);
                const balance = fiber.available_stock - fiber.required_qty;

                return (
                  <tr key={fiber.fibre_name} className="border-t hover:bg-gray-50">
                    <td className="p-2">{fiber.fibre_name}</td>
                    <td className="p-2">
  {typeof fiber.required_qty === 'number' ? fiber.required_qty.toFixed(2) : '—'}
</td>
<td className="p-2">
  {typeof fiber.consumed_qty === 'number' ? fiber.consumed_qty.toFixed(2) : '0.00'}
</td>
<td className="p-2">
  {typeof fiber.available_stock === 'number' ? fiber.available_stock.toFixed(2) : '0.00'}
</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                        {balance >= 0 ? '🟢 Good' : '🔴 Low'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FiberSummary;