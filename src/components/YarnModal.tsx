import { useEffect, useState } from 'react';
import useAuthStore from '../hooks/auth'
import { YarnForm } from '../types/yarns';
import { YarnType } from '../types/yarnTypes';
import { Blend } from '../types/blends';

interface YarnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: YarnForm, isEdit: boolean) => void;
  initialData?: YarnForm | null;
  yarnTypes: YarnType[];
  blends: Blend[];
}

const YarnModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  yarnTypes,
  blends,
}: YarnModalProps) => {
  const { user } = useAuthStore(); // assumes user object with tenant_id
  const [formData, setFormData] = useState<YarnForm>({
    tenant_id: user?.tenantId || '',
    yarn_type_id: '',
    blend_id: '',
    count_range: '',
    base_shade: '',
    special_effect: '',
    status: 'active',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        tenant_id: user?.tenantId || '',
        yarn_type_id: '',
        blend_id: '',
        count_range: '',
        base_shade: '',
        special_effect: '',
        status: 'active',
      });
    }
  }, [initialData, user?.tenantId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, !!initialData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? 'Edit Yarn' : 'Add New Yarn'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Count Range */}
          <div>
            <label className="block text-sm font-medium mb-1">Count Range</label>
            <input
              type="text"
              name="count_range"
              value={formData.count_range}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          {/* Base Shade */}
          <div>
            <label className="block text-sm font-medium mb-1">Base Shade</label>
            <input
              type="text"
              name="base_shade"
              value={formData.base_shade}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          {/* Yarn Type Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">Yarn Type</label>
            <select
              name="yarn_type_id"
              value={formData.yarn_type_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">-- Select Yarn Type --</option>
              {yarnTypes.map((yt) => (
                <option key={yt.id} value={yt.id}>
                  {yt.name} ({yt.category})
                </option>
              ))}
            </select>
          </div>

          {/* Blend Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">Blend</label>
            <select
              name="blend_id"
              value={formData.blend_id}
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

          {/* Special Effect (Optional) */}
          <div>
            <label className="block text-sm font-medium mb-1">Special Effect</label>
            <input
              type="text"
              name="special_effect"
              value={formData.special_effect}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {initialData ? 'Update Yarn' : 'Add Yarn'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default YarnModal;