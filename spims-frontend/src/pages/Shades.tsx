import { useEffect, useState } from 'react';
import {
  getAllShades,
  createShade,
  updateShade,
  deleteShade,
} from '../api/shades';
import { getAllBrands } from '../api/brands';
import { getAllBlends } from '../api/blends';

import Loader from '../components/Loader';
import ShadeModal from '../components/ShadeModal';

import { Brand } from '../types/brands';
import { Blend } from '../types/blends';
import { Shade } from '../types/shade';

const generateRandomShadeId = () => Math.floor(10000 + Math.random() * 90000).toString();

const Shades = () => {
  const [shades, setShades] = useState<Shade[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [blends, setBlends] = useState<Blend[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShade, setEditingShade] = useState<Shade | null>(null);

  const fetchShades = async () => {
    const res = await getAllShades();
    setShades(res.data);
  };

  const fetchDropdownData = async () => {
    const [brandRes, blendRes] = await Promise.all([getAllBrands(), getAllBlends()]);
    setBrands(brandRes.data);
    setBlends(blendRes.data);
  };

  const fetchData = async () => {
    try {
      await Promise.all([fetchShades(), fetchDropdownData()]);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this shade?')) return;
    try {
      setLoading(true);
      await deleteShade(id);
      await fetchShades();
    } catch {
      alert('Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveShade = async (
    data: Omit<Shade, 'id'>,
    isEdit: boolean
  ) => {
    try {
      if (isEdit && editingShade?.id) {
        // Exclude ID from update payload
        const { shade_code, shade_name, percentage, available_stock_kg, blend_id, brand_id } = data;
        await updateShade(editingShade.id, {
          shade_code,
          shade_name,
          percentage,
          available_stock_kg,
          blend_id,
          brand_id,
        });
      } else {
        const id = generateRandomShadeId();
        await createShade({ ...data, id });
      }
      await fetchShades();
      setIsModalOpen(false);
      setEditingShade(null);
    } catch (err) {
      alert('Error saving shade');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-blue-600">Shades</h1>
        <button
          onClick={() => {
            setEditingShade(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Shade
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="text-left px-4 py-2">Shade Code</th>
              <th className="text-left px-4 py-2">Shade Name</th>
              <th className="text-left px-4 py-2">Brand</th>
              <th className="text-left px-4 py-2">Blend</th>
              <th className="text-left px-4 py-2">Percentage</th>
              <th className="text-left px-4 py-2">Stock (kg)</th>
              <th className="text-left px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shades.map((shade) => {
              const brandName = brands.find((b) => b.id === shade.brand_id)?.name || 'N/A';
              const blendName = blends.find((b) => b.id === shade.blend_id)?.blend_code || 'N/A';

              return (
                <tr key={shade.id}>
                  <td className="px-4 py-2">{shade.shade_code}</td>
                  <td className="px-4 py-2">{shade.shade_name}</td>
                  <td className="px-4 py-2">{brandName}</td>
                  <td className="px-4 py-2">{blendName}</td>
                  <td className="px-4 py-2">{shade.percentage}</td>
                  <td className="px-4 py-2">{shade.available_stock_kg}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => {
                        setEditingShade(shade);
                        setIsModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(shade.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ShadeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingShade(null);
        }}
        onSave={handleSaveShade}
        initialData={editingShade || undefined}
        brands={brands}
        blends={blends}
      />
    </div>
  );
};

export default Shades;