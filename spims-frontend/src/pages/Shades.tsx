import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { getAllShades, createShade, updateShade, deleteShade } from '../api/shades';
import { getAllFibers } from '../api/fibers';
import { ShadeCreateInput, ShadeWithBlendDescription } from '../types/shade';
import { Fiber } from '../types/fiber';
import ShadeModal from '../components/ShadeModal';
import toast from 'react-hot-toast';

const ITEMS_PER_PAGE = 5;

const Shades = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [sortKey] = useState<keyof ShadeWithBlendDescription | null>(null);
  const [sortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shadeToEdit, setShadeToEdit] = useState<ShadeWithBlendDescription | null>(null);

  const { data: shadesRaw } = useQuery({
    queryKey: ['shades'],
    queryFn: getAllShades,
  });

  const shades: ShadeWithBlendDescription[] = Array.isArray(shadesRaw) ? shadesRaw : [];

  const { data: fibres = [] } = useQuery<Fiber[]>({
    queryKey: ['fibres'],
    queryFn: getAllFibers,
  });

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
        percentage: shade.percentage,
        available_stock_kg: shade.available_stock_kg,
        blend_composition: shade.blend_composition,
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

  const handleCreate = (newShade: ShadeCreateInput) => {
    createMutation.mutate(newShade);
  };

  const handleUpdate = (updated: ShadeCreateInput & { id: string }) => {
    updateMutation.mutate(updated);
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
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredShades.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredShades, currentPage]);

  const totalPages = Math.ceil(filteredShades.length / ITEMS_PER_PAGE);


  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-blue-600">Shades</h2>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="Search shades..."
            className="px-3 py-2 border rounded shadow-sm w-64"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          <button
            onClick={() => {
              setIsModalOpen(true);
              setShadeToEdit(null);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ➕ Add Shade
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Shade Code</th>
              <th className="p-3 border">Shade Name</th>
              <th className="p-3 border">Composition</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((shade) => (
              <tr key={shade.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{shade.shade_code}</td>
                <td className="p-3">{shade.shade_name}</td>
                <td className="p-3 text-xs text-gray-800">
                  {shade.blend_composition?.length ? (
                    shade.blend_composition.map((b) => {
                      const label = b.fibre?.fibre_code || b.fibre_id;
                      const desc = b.fibre?.fibre_name || '';
                      const pct = typeof b.percentage === 'number'
                        ? b.percentage.toFixed(1)
                        : parseFloat(b.percentage).toFixed(1);

                      return (
                        <div key={b.fibre_id}>
                          <span className="font-medium">{label}</span>{' '}
                          <span className="text-gray-500">
                            ({desc} - {pct}%)
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <span className="text-gray-400 italic">No fibres</span>
                  )}
                </td>
                <td className="p-3 space-x-2">
                  <button
                    className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    onClick={() => {
                      setShadeToEdit(shade);
                      setIsModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => {
                      if (
                        window.confirm(`Are you sure you want to delete ${shade.shade_code}?`)
                      ) {
                        deleteMutation.mutate(shade.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No matching shades found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end mt-4 gap-2">
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 rounded border ${
                currentPage === idx + 1 ? 'bg-blue-600 text-white' : 'bg-white'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}

      <ShadeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setShadeToEdit(null);
        }}
        onCreate={handleCreate}
        onUpdate={(shade) => handleUpdate({ ...shade, id: shade.id })}
        shadeToEdit={shadeToEdit}
        fibres={fibres}
      />
    </div>
  );
};

export default Shades;