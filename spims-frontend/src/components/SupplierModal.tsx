import React, { useEffect, useState } from 'react';
import type { Supplier } from '../types/supplier'; // Adjust the path accordingly

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Supplier>, isEdit: boolean) => void;
  initialData?: Supplier | null;
}

const SupplierModal = ({ isOpen, onClose, onSave, initialData }: SupplierModalProps) => {
  const [formData, setFormData] = useState<Partial<Supplier>>({});

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, !!initialData); // true = edit mode
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? 'Edit Supplier' : 'Add New Supplier'}
        </h2>
        <form onSubmit={handleSubmit}>
          {['name', 'contact', 'email', 'address'].map((field) => (
            <div className="mb-4" key={field}>
              <label className="block text-sm font-medium mb-1 capitalize">{field}</label>
              <input
                type="text"
                name={field}
                value={formData[field as keyof Supplier] || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required={field === 'name'}
              />
            </div>
          ))}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {initialData ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierModal;