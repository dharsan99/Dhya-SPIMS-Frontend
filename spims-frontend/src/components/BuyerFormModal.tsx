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
<div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/10 flex items-center justify-center">      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">{initialData ? 'Edit Buyer' : 'Create Buyer'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Buyer Name"
            required
            className="w-full border p-2 rounded"
          />
          <input
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Contact Number"
            className="w-full border p-2 rounded"
          />
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border p-2 rounded"
          />
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full border p-2 rounded"
          />
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
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