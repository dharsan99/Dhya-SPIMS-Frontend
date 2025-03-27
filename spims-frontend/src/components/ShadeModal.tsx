// components/ShadeModal.tsx
import { useEffect, useState } from 'react';
import { Brand } from '../types/brands';
import { Blend } from '../types/blends';
import { ShadeFormData } from '../types/shade';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ShadeFormData, isEdit: boolean) => void;
  initialData?: ShadeFormData | null;
  brands: Brand[];
  blends: Blend[];
}

const ShadeModal = ({ isOpen, onClose, onSave, initialData, brands, blends }: Props) => {
  const [form, setForm] = useState<ShadeFormData>({
    shade_code: '',
    shade_name: '',
    brand_id: '',
    blend_id: '',
    percentage: '',
    available_stock_kg: 0,
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
    else
      setForm({
        shade_code: '',
        shade_name: '',
        brand_id: '',
        blend_id: '',
        percentage: '',
        available_stock_kg: 0,
      });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'available_stock_kg' ? +value : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form, !!initialData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-lg font-semibold text-blue-600 mb-4">
          {initialData ? 'Edit Shade' : 'Add New Shade'}
        </h2>
        <form onSubmit={handleSubmit}>
          {[
            { name: 'shade_code', label: 'Shade Code' },
            { name: 'shade_name', label: 'Shade Name' },
            { name: 'percentage', label: 'Percentage' },
          ].map(({ name, label }) => (
            <div className="mb-4" key={name}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <input
                type="text"
                name={name}
                value={(form as any)[name]}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
          ))}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Brand</label>
            <select
              name="brand_id"
              value={form.brand_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">-- Select Brand --</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Blend</label>
            <select
              name="blend_id"
              value={form.blend_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">-- Select Blend --</option>
              {blends.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.blend_code}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Available Stock (kg)</label>
            <input
              type="number"
              name="available_stock_kg"
              value={form.available_stock_kg}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              {initialData ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShadeModal;