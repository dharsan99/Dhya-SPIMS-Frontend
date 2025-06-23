// components/SubscriptionFormModal.tsx

import React, { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import Select from 'react-select';

interface SubscriptionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subscription: any) => void;
  editingSubscription: any | null;
}

const billingOptions = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const SubscriptionFormModal: React.FC<SubscriptionFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSubscription,
}) => {
  const [formState, setFormState] = useState({
    tenantName: '',
    planName: '',
    description: '',
    price: '',
    billingCycle: billingOptions[0],
    maxUsers: '',
    maxOrders: '',
    maxStorage: '',
    status: statusOptions[0],
  });

  useEffect(() => {
    if (editingSubscription) {
      setFormState({
        tenantName: editingSubscription.tenantName,
        planName: editingSubscription.planName,
        description: editingSubscription.description,
        price: editingSubscription.price.toString(),
        billingCycle: billingOptions.find(opt => opt.value === editingSubscription.billingCycle) || billingOptions[0],
        maxUsers: editingSubscription.maxUsers.toString(),
        maxOrders: editingSubscription.maxOrders.toString(),
        maxStorage: editingSubscription.maxStorage,
        status: statusOptions.find(opt => opt.value === editingSubscription.status) || statusOptions[0],
      });
    } else {
      setFormState({
        tenantName: '',
        planName: '',
        description: '',
        price: '',
        billingCycle: billingOptions[0],
        maxUsers: '',
        maxOrders: '',
        maxStorage: '',
        status: statusOptions[0],
      });
    }
  }, [editingSubscription]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newSub = {
      id: editingSubscription ? editingSubscription.id : `sub${Date.now()}`,
      tenantName: formState.tenantName,
      planName: formState.planName,
      description: formState.description,
      price: parseFloat(formState.price),
      billingCycle: formState.billingCycle.value,
      maxUsers: parseInt(formState.maxUsers),
      maxOrders: parseInt(formState.maxOrders),
      maxStorage: formState.maxStorage,
      status: formState.status.value,
      createdAt: editingSubscription ? editingSubscription.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(newSub);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {editingSubscription ? 'Edit Subscription' : 'Create Subscription'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="tenantName"
              value={formState.tenantName}
              onChange={handleChange}
              required
              placeholder="Tenant Name"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="planName"
              value={formState.planName}
              onChange={handleChange}
              required
              placeholder="Plan Name"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              name="description"
              value={formState.description}
              onChange={handleChange}
              placeholder="Description"
              className="md:col-span-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="price"
              value={formState.price}
              onChange={handleChange}
              type="number"
              required
              placeholder="Price"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Select
              options={billingOptions}
              value={formState.billingCycle}
              onChange={(option) => setFormState({ ...formState, billingCycle: option! })}
              className="text-black dark:text-white"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '0.375rem',
                  borderColor: '#D1D5DB',
                  backgroundColor: '#fff',
                  padding: '1px',
                }),
              }}
            />
            <input
              name="maxUsers"
              value={formState.maxUsers}
              onChange={handleChange}
              type="number"
              placeholder="Max Users"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="maxOrders"
              value={formState.maxOrders}
              onChange={handleChange}
              type="number"
              placeholder="Max Orders"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="maxStorage"
              value={formState.maxStorage}
              onChange={handleChange}
              placeholder="Max Storage"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Select
              options={statusOptions}
              value={formState.status}
              onChange={(option) => setFormState({ ...formState, status: option! })}
              className="text-black dark:text-white"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '0.375rem',
                  borderColor: '#D1D5DB',
                  backgroundColor: '#fff',
                  padding: '1px',
                }),
              }}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {editingSubscription ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionFormModal;
