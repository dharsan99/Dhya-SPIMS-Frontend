import { useEffect, useState } from 'react';
import { YarnMappingForm } from '../types/yarnMapping';

interface YarnMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: YarnMappingForm, isEdit: boolean) => void;
  initialData?: YarnMappingForm | null;
  yarns: {
    id: string;
    count_range: string;
    base_shade: string;
    special_effect: string;
    yarn_type_id: string;
    blend_id: string;
    tenant_id: string;
  }[];
  shades: { id: string; shade_name: string; shade_code: string }[];
  blends: { id: string; blend_code: string; description?: string }[];
}

const YarnMappingModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  yarns,
  shades,
  blends,
}: YarnMappingModalProps) => {
  const [form, setForm] = useState<YarnMappingForm>({
    yarn_code: '',
    yarn_id: '',
    shade_id: '',
    tenant_id: '',
    yarn_type_id: '',
    blend_id: '',
    count_range: '',
    base_shade: '',
    special_effect: '',
  });

  // 🧠 Ensure dependent yarn fields are loaded if initialData is provided
  useEffect(() => {
    if (initialData) {
      const selectedYarn = yarns.find(y => y.id === initialData.yarn_id);
      if (selectedYarn) {
        setForm({
          yarn_code: initialData.yarn_code,
          yarn_id: selectedYarn.id,
          shade_id: initialData.shade_id,
          tenant_id: selectedYarn.tenant_id,
          yarn_type_id: selectedYarn.yarn_type_id,
          blend_id: selectedYarn.blend_id,
          count_range: selectedYarn.count_range,
          base_shade: selectedYarn.base_shade,
          special_effect: selectedYarn.special_effect,
        });
      } else {
        setForm(initialData);
      }
    } else {
      setForm({
        yarn_code: '',
        yarn_id: '',
        shade_id: '',
        tenant_id: '',
        yarn_type_id: '',
        blend_id: '',
        count_range: '',
        base_shade: '',
        special_effect: '',
      });
    }
  }, [initialData, yarns]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'yarn_id') {
      const selectedYarn = yarns.find((yarn) => yarn.id === value);
      if (selectedYarn) {
        setForm((prev) => ({
          ...prev,
          yarn_id: selectedYarn.id,
          tenant_id: selectedYarn.tenant_id,
          yarn_type_id: selectedYarn.yarn_type_id,
          blend_id: selectedYarn.blend_id,
          count_range: selectedYarn.count_range,
          base_shade: selectedYarn.base_shade,
          special_effect: selectedYarn.special_effect,
        }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form, !!initialData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">
          {initialData ? 'Edit Yarn Mapping' : 'Add Yarn Mapping'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Yarn Dropdown */}
          <div>
            <label className="block text-sm mb-1">Yarn</label>
            <select
              name="yarn_id"
              value={form.yarn_id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">-- Select Yarn --</option>
              {yarns.map((yarn) => (
                <option key={yarn.id} value={yarn.id}>
                  {yarn.count_range} - {yarn.base_shade}
                </option>
              ))}
            </select>
          </div>

          {/* Shade Dropdown */}
          <div>
            <label className="block text-sm mb-1">Shade</label>
            <select
              name="shade_id"
              value={form.shade_id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">-- Select Shade --</option>
              {shades.map((shade) => (
                <option key={shade.id} value={shade.id}>
                  {shade.shade_code} - {shade.shade_name}
                </option>
              ))}
            </select>
          </div>

          {/* Yarn Code Input */}
          <div>
            <label className="block text-sm mb-1">Yarn Code</label>
            <input
              name="yarn_code"
              value={form.yarn_code}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          {/* Footer */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default YarnMappingModal;