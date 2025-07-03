import React, { useState, useEffect } from 'react';

export interface BuyerFormData {
  name: string;
  contact?: string;
  email?: string;
  address?: string;
}

interface BuyerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BuyerFormData) => void;
  initialData?: BuyerFormData;
}

const BuyerFormModal = ({ isOpen, onClose, onSubmit, initialData }: BuyerFormModalProps) => {
  const [formData, setFormData] = useState<BuyerFormData>({
    name: '',
    contact: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ name: '', contact: '', email: '', address: '' });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 dark:bg-black/50"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md transition-colors duration-300">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
          {initialData ? 'Edit Buyer' : 'Create Buyer'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Buyer Name"
            required
            autoFocus
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-2 rounded"
          />
          <input
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Contact Number"
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-2 rounded"
          />
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-2 rounded"
          />
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            rows={3}
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-2 rounded"
          />
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BuyerFormModal;