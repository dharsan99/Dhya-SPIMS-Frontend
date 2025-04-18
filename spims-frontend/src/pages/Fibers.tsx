// ✅ Updated Fiber page with FiberStockModal and inline editing support

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import {
  getAllFibers,
  createFiber,
  updateFiber,
  deleteFiber,
} from '../api/fibers';
import { getFibreCategories } from '../api/fibreCategories';
import { Fiber, FiberCategory } from '../types/fiber';
import FibreModal from '../components/FiberModal';
import FibreCategoriesTable from '../components/FibreCategoriesTable';
import FiberStockModal from '../components/FiberStockModal';
import toast from 'react-hot-toast';

const ITEMS_PER_PAGE = 5;

const Fibers = () => {
  const queryClient = useQueryClient();

  const [tab, setTab] = useState<'fibres' | 'categories'>('fibres');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fiberToEdit, setFiberToEdit] = useState<Fiber | null>(null);
  const [stockModalFibre, setStockModalFibre] = useState<Fiber | null>(null);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<keyof Fiber>('fibre_name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: fibres = [] } = useQuery({
    queryKey: ['fibres'],
    queryFn: getAllFibers,
  });

  const { data: categories = [] } = useQuery<FiberCategory[]>({
    queryKey: ['fibreCategories'],
    queryFn: getFibreCategories,
  });

  const createMutation = useMutation({
    mutationFn: createFiber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fibres'] });
      toast.success('✅ Fibre created successfully');
      setIsModalOpen(false);
      setFiberToEdit(null);
    },
    onError: () => toast.error('❌ Failed to create fibre'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Fiber> }) =>
      updateFiber(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fibres'] });
      toast.success('✏️ Fibre updated successfully');
    },
    onError: () => toast.error('❌ Failed to update fibre'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFiber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fibres'] });
      toast.success('🗑 Fibre deleted successfully');
    },
    onError: () => toast.error('❌ Failed to delete fibre'),
  });

  const handleCreate = (newFibre: Omit<Fiber, 'id'>) => createMutation.mutate(newFibre);
  const handleUpdate = (updatedFibre: Fiber) =>
    updateMutation.mutate({ id: updatedFibre.id, data: updatedFibre });

  const handleEditClick = (fiber: Fiber) => {
    setFiberToEdit(fiber);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this fibre?')) {
      deleteMutation.mutate(id);
    }
  };

  const toggleSort = (key: keyof Fiber) => {
    if (key === sortKey) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedFilteredFibers = useMemo(() => {
    const filtered = fibres.filter(
      (f) =>
        f.fibre_name.toLowerCase().includes(search.toLowerCase()) ||
        f.fibre_code.toLowerCase().includes(search.toLowerCase()) ||
        f.category?.name?.toLowerCase().includes(search.toLowerCase())
    );

    return filtered.sort((a, b) => {
      const valA = a[sortKey] ?? '';
      const valB = b[sortKey] ?? '';

      const normA = typeof valA === 'object' ? (valA as any)?.name ?? '' : valA;
      const normB = typeof valB === 'object' ? (valB as any)?.name ?? '' : valB;

      return sortOrder === 'asc'
        ? normA.localeCompare(normB)
        : normB.localeCompare(normA);
    });
  }, [fibres, search, sortKey, sortOrder]);

  const totalPages = Math.ceil(sortedFilteredFibers.length / ITEMS_PER_PAGE);
  const paginated = sortedFilteredFibers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6">
      <div className="flex border-b mb-4">
        <button
          onClick={() => setTab('fibres')}
          className={`px-4 py-2 border-b-2 font-medium ${
            tab === 'fibres'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-blue-600'
          }`}
        >
          Fibres
        </button>
        <button
          onClick={() => setTab('categories')}
          className={`px-4 py-2 border-b-2 font-medium ${
            tab === 'categories'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-blue-600'
          }`}
        >
          Categories
        </button>
      </div>

      {tab === 'categories' ? (
        <FibreCategoriesTable />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <input
              type="text"
              placeholder="Search name, code or category..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 px-3 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-72"
            />
            <button
              onClick={() => {
                setIsModalOpen(true);
                setFiberToEdit(null);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              ➕ Add Fibre
            </button>
          </div>

          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 border-b cursor-pointer" onClick={() => toggleSort('fibre_name')}>Name</th>
                  <th className="p-3 border-b cursor-pointer" onClick={() => toggleSort('fibre_code')}>Code</th>
                  <th className="p-3 border-b cursor-pointer" onClick={() => toggleSort('stock_kg')}>Stock (kg)</th>
                  <th className="p-3 border-b">Category</th>
                  <th className="p-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((fibre) => (
                  <tr key={fibre.id} className="hover:bg-gray-50 border-b">
                    <td className="p-3">{fibre.fibre_name}</td>
                    <td className="p-3">{fibre.fibre_code}</td>
                    <td className="p-3">{fibre.stock_kg}</td>
                    <td className="p-3">
                      {fibre.category?.name || <span className="text-gray-400 italic">Uncategorized</span>}
                    </td>
                    <td className="p-3 flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleEditClick(fibre)}
                        className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setStockModalFibre(fibre)}
                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                      >
                        Update Stock
                      </button>
                      <button
                        onClick={() => handleDelete(fibre.id)}
                        className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                      No matching fibres found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-end mt-4 gap-2 flex-wrap">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === idx + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border-gray-300'
                  } hover:bg-blue-100 transition`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <FibreModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFiberToEdit(null);
        }}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        fibreToEdit={fiberToEdit}
        categories={categories}
      />

      {stockModalFibre && (
        <FiberStockModal
          fibreId={stockModalFibre.id}
          fibreCode={stockModalFibre.fibre_code}
          requiredQty={"0.00"}
          availableQty={String(stockModalFibre.stock_kg)}
          balanceAfter={String(stockModalFibre.stock_kg)}
          onClose={() => setStockModalFibre(null)}
        />
      )}
    </div>
  );
};

export default Fibers;