import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { getAllShades, createShade, updateShade, deleteShade } from '../api/shades';
import { getAllFibers } from '../api/fibers';
import { Shade, ShadeCreateInput, ShadeWithBlendDescription } from '../types/shade';
import { Fiber } from '../types/fiber';
import ShadeModal from '../components/ShadeModal';
import toast from 'react-hot-toast';
import Pagination from '../components/Pagination';
import useAuthStore from '@/hooks/auth';

const Shades = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [sortKey] = useState<keyof ShadeWithBlendDescription | null>(null);
  const [sortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shadeToEdit, setShadeToEdit] = useState<ShadeWithBlendDescription | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const hasPermission = useAuthStore((state) => state.hasPermission);

  const canAddShade = hasPermission('Shades', 'Add Shade');
  const canEditShade = hasPermission('Shades', 'Update Shade');
  const canDeleteShade = hasPermission('Shades', 'Delete Shade');

  const { data: shadesRaw } = useQuery({ queryKey: ['shades'], queryFn: getAllShades });
  const { data: fibres = [] } = useQuery<Fiber[]>({ queryKey: ['fibres'], queryFn: getAllFibers });

  const shades: ShadeWithBlendDescription[] = Array.isArray(shadesRaw) ? shadesRaw : [];

  const createMutation = useMutation({
    mutationFn: (data: ShadeCreateInput) => createShade(data),
    onSuccess: () => {
      toast.success('✅ Shade created!');
      queryClient.invalidateQueries({ queryKey: ['shades'] });
      setIsModalOpen(false);
    },
    onError: () => toast.error('❌ Failed to create shade'),
  });

  const updateMutation = useMutation({
    mutationFn: (shade: ShadeCreateInput & { id: string }) =>
      updateShade(shade.id, {
        shade_code: shade.shade_code,
        shade_name: shade.shade_name,
        percentage: shade.percentage ?? '100%',
        available_stock_kg: shade.available_stock_kg,
        blend_composition: shade.blend_composition,
        raw_cotton_composition: shade.raw_cotton_composition,
      }),
    onSuccess: () => {
      toast.success('✏️ Shade updated!');
      queryClient.invalidateQueries({ queryKey: ['shades'] });
      setIsModalOpen(false);
      setShadeToEdit(null);
    },
    onError: () => toast.error('❌ Failed to update shade'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteShade(id),
    onSuccess: () => {
      toast.success('🗑️ Shade deleted!');
      queryClient.invalidateQueries({ queryKey: ['shades'] });
    },
    onError: () => toast.error('❌ Failed to delete shade'),
  });

  const handleCreate = (shade: Omit<Shade, 'id'> & {
    blend_composition: { fibre_id: string; percentage: number }[];
    raw_cotton_composition?: { percentage: number } | { percentage: number }[];
  }) => {
    const payload: ShadeCreateInput = {
      shade_code: shade.shade_code,
      shade_name: shade.shade_name,
      percentage: shade.percentage ?? '100%',
      blend_composition: shade.blend_composition,
      raw_cotton_composition: Array.isArray(shade.raw_cotton_composition)
        ? shade.raw_cotton_composition
        : shade.raw_cotton_composition
        ? [shade.raw_cotton_composition]
        : [],
    };
    createMutation.mutate(payload);
  };

  const handleUpdate = (updated: ShadeCreateInput & { id: string }) => {
    const payload = {
      ...updated,
      raw_cotton_composition: Array.isArray(updated.raw_cotton_composition)
        ? updated.raw_cotton_composition
        : updated.raw_cotton_composition
        ? [updated.raw_cotton_composition]
        : [],
    };
    updateMutation.mutate(payload);
  };

  const filteredShades = useMemo(() => {
    return shades
      .filter((s) =>
        `${s.shade_code} ${s.shade_name}`.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (!sortKey) return 0;
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [shades, search, sortKey, sortOrder]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredShades.slice(start, start + rowsPerPage);
  }, [filteredShades, currentPage, rowsPerPage]);

  return (
    <div className="p-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">Shades</h2>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="Search shades..."
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded shadow-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
         {canAddShade && (
            <button
              onClick={() => {
                setIsModalOpen(true);
                setShadeToEdit(null);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              ➕ Add Shade
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="p-3 border">Shade Code</th>
              <th className="p-3 border">Shade Name</th>
              <th className="p-3 border">Composition</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((shade) => (
              <tr key={shade.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="p-3">{shade.shade_code}</td>
                <td className="p-3">{shade.shade_name}</td>
                <td className="p-3 text-xs text-gray-800 dark:text-gray-200">
                  {(shade.blend_composition || []).map((b, i) => (
                    <div key={b.fibre_id + i}>
                      <span className="font-medium">{b.fibre?.fibre_code || b.fibre_id}</span>{' '}
                      <span className="text-gray-500 dark:text-gray-400">
                        ({b.fibre?.fibre_name || ''} - {parseFloat(b.percentage as any).toFixed(1)}%)
                      </span>
                    </div>
                  ))}
                  {(shade.raw_cotton_composition || []).map((rc, idx) => (
                    <div key={`raw-${idx}`}>
                      <span className="font-medium">RAW COTTON</span>{' '}
                      <span className="text-gray-500 dark:text-gray-400">
                        ({rc.lot_number ?? 'default'} - {rc.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  ))}
                </td>
                <td className="p-3 space-x-2">
                  {canEditShade && (
                    <button
                      className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      onClick={() => {
                        setShadeToEdit(shade);
                        setIsModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                  )}
                  {canDeleteShade && (
                    <button
                      className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${shade.shade_code}?`)) {
                          deleteMutation.mutate(shade.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  )}
                </td>

              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500 dark:text-gray-400 italic">
                  No matching shades found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        page={currentPage}
        setPage={setCurrentPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        total={filteredShades.length}
        options={[5, 10, 20]}
      />

      {/* Modal */}
      <ShadeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setShadeToEdit(null);
        }}
        onCreate={handleCreate}
        onUpdate={(shade) =>
          handleUpdate({
            ...shade,
            id: shade.id,
            raw_cotton_composition: shade.raw_cotton_composition
              ? Array.isArray(shade.raw_cotton_composition)
                ? shade.raw_cotton_composition
                : [shade.raw_cotton_composition]
              : [],
          })
        }
        shadeToEdit={shadeToEdit}
        fibres={fibres}
      />
    </div>
  );
};

export default Shades;