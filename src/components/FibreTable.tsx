// src/components/FibreTable.tsx

import { useState } from 'react';
import { Fiber } from '../types/fiber';
import FibreModal from './FiberModal';
import Pagination from './Pagination';

interface FibreTableProps {
  fibres: Fiber[];
  onUpdate: (fiber: Fiber) => void;
  onCreate: (fiber: Omit<Fiber, 'id'>) => void;
  categories: any[];
}

const FibreTable = ({ fibres, onUpdate, onCreate, categories }: FibreTableProps) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedFiber, setSelectedFiber] = useState<Fiber | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginated = fibres.slice(startIndex, endIndex);

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow overflow-x-auto transition-colors">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h3 className="text-lg font-bold text-gray-700 dark:text-white">🧵 Fibre Master</h3>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          onClick={() => {
            setSelectedFiber(null);
            setIsModalOpen(true);
          }}
        >
          + Add Fibre
        </button>
      </div>

      {/* Fibre Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 bg-gray-100 dark:bg-gray-800 z-10">
            <tr>
              <th className="px-4 py-2 text-left border">Fibre Name</th>
              <th className="px-4 py-2 text-left border">Fibre Code</th>
              <th className="px-4 py-2 text-left border">Stock (kg)</th>
              <th className="px-4 py-2 text-left border">Closing Stock (kg)</th>
              <th className="px-4 py-2 text-left border">Category</th>
              <th className="px-4 py-2 text-center border">Actions</th>
            </tr>
          </thead>
          <tbody>
  {paginated.map((fiber) => (
    <tr key={fiber.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b dark:border-gray-700 text-sm">
      {/* Fibre Name */}
      <td className="px-3 py-2 whitespace-nowrap">{fiber.fibre_name}</td>

      {/* Fibre Code */}
      <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{fiber.fibre_code}</td>

      {/* Stock (kg) */}
      <td className="px-3 py-2 text-center">{fiber.stock_kg?.toFixed(2) ?? '-'}</td>

      {/* Closing Stock (kg) */}
      <td className="px-3 py-2 text-center">{fiber.closing_stock ? Number(fiber.closing_stock).toFixed(2) : '-'}</td>

      {/* Inward */}
      <td className="px-3 py-2 text-center">{fiber.inward_stock ?? '0'}</td>

      {/* Outward */}
      <td className="px-3 py-2 text-center">{fiber.outward_stock ?? '0'}</td>

      {/* Consumed */}
      <td className="px-3 py-2 text-center">{fiber.consumed_stock ?? '0'}</td>

      {/* Description */}
      <td className="px-3 py-2">{fiber.description || '-'}</td>

      {/* Category */}
      <td className="px-3 py-2">{fiber.category?.name || <span className="text-gray-400 italic">Uncategorized</span>}</td>

      {/* Actions */}
      <td className="px-3 py-2 text-center">
        <div className="flex items-center justify-center gap-2">
          {/* ✏️ Edit Icon */}
          <button
            onClick={() => {
              setSelectedFiber(fiber);
              setIsModalOpen(true);
            }}
            title="Edit"
            className="text-blue-600 hover:text-blue-800"
          >
            ✏️
          </button>

          {/* 🗑️ Delete Icon */}
          {/* Uncomment if you want delete feature */}
          {/* <button
            onClick={() => handleDelete(fiber.id)}
            title="Delete"
            className="text-red-600 hover:text-red-800"
          >
            🗑️
          </button> */}
        </div>
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6">
        <Pagination
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          total={fibres.length}
          options={[5, 10, 20, 50]}
        />
      </div>

      {/* Fibre Modal */}
      <FibreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={onCreate}
        onUpdate={onUpdate}
        fibreToEdit={selectedFiber}
        categories={categories}
      />
    </div>
  );
};

export default FibreTable;