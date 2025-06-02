import React from 'react';
import { Fiber } from '../../types/fiber';

interface FibersTableProps {
  fibers: Fiber[];
  onEdit: (fiber: Fiber) => void;
  onStockUpdate: (fiber: Fiber) => void;
  onDelete: (id: string) => void;
}

const FibersTable: React.FC<FibersTableProps> = ({ fibers, onEdit, onStockUpdate, onDelete }) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold">
          <tr>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Code</th>
            <th className="px-4 py-3 text-center">Stock</th>
            <th className="px-4 py-3 text-center">Closing</th>
            <th className="px-4 py-3 text-center">Inward</th>
            <th className="px-4 py-3 text-center">Outward</th>
            <th className="px-4 py-3 text-center">Consumed</th>
            <th className="px-4 py-3 text-left">Description</th>
            <th className="px-4 py-3 text-left">Category</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {fibers.length > 0 ? (
            fibers.map((fiber) => (
              <tr
                key={fiber.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <td className="px-4 py-3 text-gray-900 dark:text-white">{fiber.fibre_name}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{fiber.fibre_code}</td>
                <td className="px-4 py-3 text-center text-blue-700 dark:text-blue-400">
                  {Number(fiber.stock_kg || 0).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center">{Number(fiber.closing_stock || 0).toFixed(2)}</td>
                <td className="px-4 py-3 text-center">{Number(fiber.inward_stock || 0).toFixed(2)}</td>
                <td className="px-4 py-3 text-center">{Number(fiber.outward_stock || 0).toFixed(2)}</td>
                <td className="px-4 py-3 text-center">{Number(fiber.consumed_stock || 0).toFixed(2)}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {fiber.description || <span className="italic text-gray-400">–</span>}
                </td>
                <td className="px-4 py-3">
                  {fiber.category?.name || (
                    <span className="italic text-gray-400 dark:text-gray-500">Uncategorized</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEdit(fiber)}
                      title="Edit"
                      className="px-2 py-1 text-xs font-medium bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onStockUpdate(fiber)}
                      title="Update Stock"
                      className="px-2 py-1 text-xs font-medium bg-green-600 hover:bg-green-700 text-white rounded"
                    >
                      Stock
                    </button>
                    <button
                      onClick={() => onDelete(fiber.id)}
                      title="Delete"
                      className="px-2 py-1 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={10}
                className="text-center py-6 text-gray-500 italic dark:text-gray-400"
              >
                No fibers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FibersTable;