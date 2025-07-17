import React, { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import Select from 'react-select';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTenantSubscription, updateTenantSubscriptionStatus } from '@/api/superadminsubscriptions';

interface SubscriptionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subscription: any) => void;
  editingSubscription: any | null;
  tenants: { id: string; name: string }[];
  plans: { id: string; name: string }[];
  onSubscriptionCreated?: () => void;
}

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const SubscriptionFormModal: React.FC<SubscriptionFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSubscription,
  tenants,
  plans,
  onSubscriptionCreated,
}) => {
  const tenantOptions = tenants.map(t => ({ value: t.id, label: t.name }));
  const planOptions = plans.map(p => ({ value: p.id, label: p.name }));

  const [formState, setFormState] = useState<{ tenantId?: string; planId?: string; status: any }>({
    status: statusOptions[0],
  });

  const [loading] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createTenantSubscription,
    onSuccess: (variables) => {
      toast.success('Subscription created successfully');
      queryClient.invalidateQueries({ queryKey: ['superadmin-subscriptions'] });
      onSave && onSave(variables);
      onSubscriptionCreated && onSubscriptionCreated();
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create subscription');
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'inactive' }) => updateTenantSubscriptionStatus(id, status),
    onSuccess: () => {
      toast.success('Subscription status updated');
      queryClient.invalidateQueries({ queryKey: ['superadmin-subscriptions'] });
      onSave && onSave({ ...editingSubscription, status: formState.status.value });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update status');
    },
  });

  useEffect(() => {
    if (editingSubscription) {
      setFormState({
        status:
          statusOptions.find(opt => opt.value === editingSubscription.status) || statusOptions[0],
      });
    } else {
      setFormState({
        tenantId: '',
        planId: '',
        status: statusOptions[0],
      });
    }
  }, [editingSubscription]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingSubscription) {
      // Only status update handled here
      updateStatusMutation.mutate({
        id: editingSubscription.id,
        status: formState.status.value,
      });
      return;
    }

    if (!formState.tenantId || !formState.planId) {
      toast.error('Please select both tenant and plan');
      return;
    }

    mutation.mutate({
      tenantId: formState.tenantId,
      planId: formState.planId,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-xl mx-4">
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
          {editingSubscription ? (
            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Status</label>
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
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <Select
                options={tenantOptions}
                value={tenantOptions.find(opt => opt.value === formState.tenantId) || null}
                onChange={option => setFormState({ ...formState, tenantId: option?.value || '' })}
                placeholder="Select Tenant"
                className="text-black dark:text-white"
                required
              />
              <Select
                options={planOptions}
                value={planOptions.find(opt => opt.value === formState.planId) || null}
                onChange={option => setFormState({ ...formState, planId: option?.value || '' })}
                placeholder="Select Plan"
                className="text-black dark:text-white"
                required
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              disabled={loading}
            >
              {editingSubscription ? 'Update' : loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionFormModal;