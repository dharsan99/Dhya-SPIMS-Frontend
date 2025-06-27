import { useEffect, useState } from 'react';
import { useOptimizedToast } from '@/hooks/useOptimizedToast';
import { createSupplier, updateSupplier } from '../api/suppliers';
import { Supplier } from '../types/supplier';

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (data: Supplier | Omit<Supplier, 'id'>) => void;
  supplierToEdit: Supplier | null;
  initialData: Supplier | null;
}

const SupplierModal = ({
  isOpen,
  onClose,
  onSaved,
  supplierToEdit,
}: SupplierModalProps) => {
  const { success, error } = useOptimizedToast();
  const isEditMode = !!supplierToEdit;

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(supplierToEdit?.name || '');
      setContact(supplierToEdit?.contact || '');
      setEmail(supplierToEdit?.email || '');
      setAddress(supplierToEdit?.address || '');
    }
  }, [isOpen, supplierToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      error('Supplier name is required.');
      return;
    }

    const supplierData = { name, contact, email, address };

    try {
      if (isEditMode) {
        const updated = await updateSupplier(supplierToEdit!.id, supplierData);
        success('Supplier updated successfully!');
        onSaved(updated.data);
      } else {
        const created = await createSupplier(supplierData);
        success('Supplier created successfully!');
        onSaved(created.data);
      }
      onClose();
    } catch (err) {
      error('Failed to save supplier.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex items-center justify-center transition-colors">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md transition-colors duration-300"
      >
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          {isEditMode ? 'Edit Supplier' : 'Add Supplier'}
        </h2>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300 block mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300 block mb-1">
            Contact
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300 block mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300 block mb-1">
            Address
          </label>
          <textarea
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-400 dark:bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-500 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {isEditMode ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupplierModal;