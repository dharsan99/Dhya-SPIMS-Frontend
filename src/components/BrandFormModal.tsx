// src/components/BrandFormModal.tsx
import { useState, useEffect } from 'react';
import Modal from './Modal'; // Your generic Modal component if available
import { createBrand, updateBrand } from '../api/brands';

interface Brand {
  id?: string;
  name: string;
  type?: string;
  description?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Brand | null;
}

const BrandFormModal = ({ isOpen, onClose, onSuccess, initialData }: Props) => {
  const [form, setForm] = useState<Brand>({ name: '', type: '', description: '' });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({ name: '', type: '', description: '' });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (initialData?.id) {
        await updateBrand(initialData.id, form);
      } else {
        await createBrand(form);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Brand save error:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? 'Edit Brand' : 'Add Brand'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Brand Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Type"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {initialData ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BrandFormModal;