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
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedFiber, setSelectedFiber] = useState<Fiber | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginated = fibres.slice(startIndex, endIndex);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">🧵 Fibre Master</h3>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => {
            setSelectedFiber(null);
            setIsModalOpen(true);
          }}
        >
          + Add Fibre
        </button>
      </div>

      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Fibre Name</th>
            <th className="px-4 py-2 text-left">Fibre Code</th>
            <th className="px-4 py-2 text-left">Stock</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((fiber) => (
            <tr key={fiber.id} className="border-t">
              <td className="px-4 py-2">{fiber.fibre_name}</td>
              <td className="px-4 py-2">{fiber.fibre_code}</td>
              <td className="px-4 py-2">{fiber.stock_kg} kg</td>
              <td className="px-4 py-2">{fiber.category?.name || 'Uncategorized'}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => {
                    setSelectedFiber(fiber);
                    setIsModalOpen(true);
                  }}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Update Stock
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <Pagination
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          total={fibres.length}
          options={[5, 10, 20]}
        />
      </div>

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
