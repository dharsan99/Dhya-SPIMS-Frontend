
import { StockItem } from '@/types/stock';
import { formatValue } from '@/utils/stock';
import React from 'react';

interface StockTableProps {
  stock: StockItem[];
  onEditClick: (item: StockItem) => void;
  onViewLogsClick: (id: string) => void;
}


const StockTable: React.FC<StockTableProps> = ({ stock , onEditClick, onViewLogsClick}) => {


  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 mt-4">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold">
          <tr>
            <th className="px-4 py-3 text-left">Fibre</th>
            <th className="px-4 py-3 text-left">Category</th>
            <th className="px-4 py-3 text-center">Stock (kg)</th>
            <th className="px-4 py-3 text-center">Threshold (kg)</th>
            <th className="px-4 py-3 text-center">Last Updated</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {stock.length > 0 ? (
            stock.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
               <td className="px-4 py-3">{formatValue(item.fibre_name)}</td>
            <td className="px-4 py-3">{formatValue(item.category)}</td>
            <td className="px-4 py-3 text-center">{formatValue(item.stock_kg, 2)}</td>
            <td
              className={`px-4 py-3 text-center ${
                item.stock_kg < item.threshold_kg ? 'text-red-600 font-semibold' : ''
              }`}
            >
              {formatValue(item.threshold_kg, 2)}
            </td>
            <td className="px-4 py-3 text-center">{formatValue(item.last_updated)}</td>
                <td className="px-4 py-3 text-center space-x-2">
                <div className='flex flex-col lg:flex-row gap-3'>
                <button
                  onClick={() => onEditClick(item)}
                  className="px-2 py-1 text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onViewLogsClick(item.id)}
                  className="px-2 py-1 text-xs font-medium bg-gray-500 hover:bg-gray-600 text-white rounded"
                >
                  View Logs
                </button>
                </div>
              </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-6 text-gray-500 italic">
                No stock data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
