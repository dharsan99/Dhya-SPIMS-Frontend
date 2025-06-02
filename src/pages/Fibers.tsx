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
import FibreCategoriesPanel from '../components/Fibers/FibreCategoriesPanel';
import FiberStockModal from '../components/FiberStockModal';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';
import Pagination from '../components/Pagination';
import FibreSuppliersPanel from '../components/Fibers/FibreSuppliersPanel';
import FibreTransfersPanel from '../components/Fibers/FibreTransfersPanel';
import FibersToolbar from '../components/Fibers/FibersToolbar';
import FibersTable from '../components/Fibers/FibersTable';
import { CreateFibreTransfer, FibreTransfer } from '../types/fibreTransfer';

const Fibers = () => {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<'fibres' | 'categories' | 'suppliers' | 'transfers'>('fibres');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fiberToEdit, setFiberToEdit] = useState<Fiber | null>(null);
  const [stockModalFibre, setStockModalFibre] = useState<Fiber | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { data: fibres = [], isLoading: loadingFibres } = useQuery<Fiber[]>({
    queryKey: ['fibres'],
    queryFn: getAllFibers,
  });

  const { data: categories = [], isLoading: loadingCategories } = useQuery<FiberCategory[]>({
    queryKey: ['fibreCategories'],
    queryFn: getFibreCategories,
  });

  const createMutation = useMutation({
    mutationFn: createFiber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fibres'] });
      toast.success('Fibre created');
      setIsModalOpen(false);
      setFiberToEdit(null);
    },
    onError: () => toast.error('Failed to create fibre'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Fiber> }) => updateFiber(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fibres'] });
      toast.success('Fibre updated');
    },
    onError: () => toast.error('Failed to update fibre'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFiber,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fibres'] });
      toast.success('Fibre deleted');
    },
    onError: () => toast.error('Failed to delete fibre'),
  });

  const handleSearchChange = debounce((text: string) => {
    setSearch(text);
    setCurrentPage(1);
  }, 300);

  const sortedFilteredFibers = useMemo(() => {
    const filtered = fibres
      .filter((f) => !f.is_dynamic)
      .filter(
        (f) =>
          f.fibre_name?.toLowerCase().includes(search.toLowerCase()) ||
          f.fibre_code?.toLowerCase().includes(search.toLowerCase()) ||
          f.category?.name?.toLowerCase().includes(search.toLowerCase())
      );

    return filtered.sort((a, b) => a.fibre_name.localeCompare(b.fibre_name));
  }, [fibres, search]);

  const totalPages = Math.ceil(sortedFilteredFibers.length / rowsPerPage);
  const paginated = sortedFilteredFibers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleTransferSave = (data: CreateFibreTransfer | FibreTransfer) => {
    console.log('Transfer saved:', data);
    toast.success('Transfer saved (not implemented)');
  };

  const handleCreate = (newFibre: Omit<Fiber, 'id'>) => createMutation.mutate(newFibre);
  const handleUpdate = (updatedFibre: Fiber) =>
    updateMutation.mutate({ id: updatedFibre.id, data: updatedFibre });
  const handleDelete = (fiberId: string) => {
    if (confirm('Are you sure you want to delete this fiber?')) {
      deleteMutation.mutate(fiberId);
    }
  };

  if (loadingFibres || loadingCategories) {
    return (
      <div className="p-8 text-center text-gray-600 dark:text-gray-300">
        Loading fibres...
      </div>
    );
  }

  return (
    <div className="p-6 transition-colors duration-300">
      {/* Tab Buttons */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
        {(['fibres', 'categories', 'suppliers', 'transfers'] as const).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 border-b-2 font-medium transition ${
              tab === key
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-blue-600'
            }`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="relative">
        {tab === 'categories' && <FibreCategoriesPanel />}
        {tab === 'suppliers' && <FibreSuppliersPanel />}
        {tab === 'transfers' && (
          <FibreTransfersPanel
            fibres={fibres}
            onSave={handleTransferSave}
          />
        )}
        {tab === 'fibres' && (
          <>
            <FibersToolbar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSearchChange={handleSearchChange}
              onAddClick={() => {
                setIsModalOpen(true);
                setFiberToEdit(null);
              }}
            />

            <FibersTable
              fibers={paginated}
              onEdit={(f) => {
                setFiberToEdit(f);
                setIsModalOpen(true);
              }}
              onStockUpdate={(f) => setStockModalFibre(f)}
              onDelete={handleDelete}
            />

            {totalPages > 1 && (
              <Pagination
                page={currentPage}
                setPage={setCurrentPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                total={sortedFilteredFibers.length}
                options={[5, 10, 20, 50]}
              />
            )}
          </>
        )}
      </div>

      {/* Modals */}
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
          requiredQty="0.00"
          availableQty={String(stockModalFibre.stock_kg)}
          balanceAfter={String(stockModalFibre.stock_kg)}
          onClose={() => setStockModalFibre(null)}
        />
      )}
    </div>
  );
};

export default Fibers;