import { useEffect, useState } from 'react';
import type { YarnTypeForm, YarnType } from '../types/yarnTypes';

interface YarnTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: YarnTypeForm, isEdit: boolean) => void;
  initialData?: YarnType | null;
}

const YarnTypeModal = ({ isOpen, onClose, onSave, initialData }: YarnTypeModalProps) => {
  const [formData, setFormData] = useState<YarnTypeForm>({ name: '', category: '' });

  useEffect(() => {
    if (initialData) {
      setFormData({ name: initialData.name, category: initialData.category || '' });
    } else {
      setFormData({ name: '', category: '' });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) return alert('All fields required');
    onSave(formData, !!initialData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold text-blue-600 mb-4">
          {initialData ? 'Edit Yarn Type' : 'Add New Yarn Type'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-sm">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-sm">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="flex justify-between mt-6">
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
              {initialData ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default YarnTypeModal;