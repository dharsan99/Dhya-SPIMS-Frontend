import { useEffect, useState } from 'react';
import { getBrands, deleteBrand } from '../api/brands';
import Loader from '../components/Loader';
import BrandFormModal from '../components/BrandFormModal';

interface Brand {
  id: string;
  name: string;
  type: string;
  description: string;
}

const Brands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const fetchBrands = async () => {
    try {
      const response = await getBrands();
      setBrands(response.data);
    } catch (err) {
      console.error("Error fetching brands:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleAdd = () => {
    setSelectedBrand(null);
    setModalOpen(true);
  };

  const handleEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this brand?')) {
      try {
        await deleteBrand(id);
        fetchBrands();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-blue-600">Brands</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Brand
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="border-b text-sm text-gray-500">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id} className="border-b text-sm text-gray-700">
                <td className="px-4 py-2">{brand.name}</td>
                <td className="px-4 py-2">{brand.type}</td>
                <td className="px-4 py-2">{brand.description}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(brand)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(brand.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {brands.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-400">
                  No brands found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Brand Modal */}
      <BrandFormModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchBrands}
        initialData={selectedBrand}
      />
    </div>
  );
};

export default Brands;