import React, { useState, useEffect } from 'react';
import SuperAdminModal from '../SuperAdminModal';
import { createSuperAdminTenant, adminSignup } from '../../api/superadmintenants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const SuperAdminTenantWizardModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [tenantForm, setTenantForm] = useState({ name: '', domain: '', address: '', industry: '', phone: '' });
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '' });
  const queryClient = useQueryClient();

  // Step 1: Tenant creation
  const tenantMutation = useMutation({
    mutationFn: createSuperAdminTenant,
    onSuccess: (data: any) => {
      setTenantId(data.id);
      setStep(2);
    },
    onError: (err: any) => {
      console.log('Tenant creation error:', err);
      toast.error(err?.response?.data?.message || 'Failed to create tenant');
    }
  });

  // Step 2: User creation
  const userMutation = useMutation({
    mutationFn: (userData: typeof userForm) =>
      adminSignup({ ...userData, tenant_id: tenantId! }),
    onSuccess: () => {
      toast.success('Tenant and user created! Invite sent.');
      queryClient.invalidateQueries({ queryKey: ['superadmin-tenants'] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to create user');
    }
  });

  const handleTenantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    tenantMutation.mutate(tenantForm);
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId) return;
    userMutation.mutate(userForm);
  };

  // Reset state when closed
  useEffect(() => {
    if (!open) {
      setStep(1);
      setTenantId(null);
      setTenantForm({ name: '', domain: '', address: '', industry: '', phone: '' });
      setUserForm({ name: '', email: '', password: '' });
    }
  }, [open]);

  return open ? (
    <SuperAdminModal onClose={onClose}>
      <div className="p-1 sm:p-2">
        {step === 1 ? (
          <form onSubmit={handleTenantSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2">Add Tenant</h2>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Tenant Name <span className="text-red-500">*</span></label>
                <input
                  value={tenantForm.name}
                  onChange={e => setTenantForm({ ...tenantForm, name: e.target.value })}
                  required
                  placeholder="e.g. ABC Spinning Mills"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Domain <span className="text-xs text-gray-400">(optional)</span></label>
                <input
                  value={tenantForm.domain}
                  onChange={e => setTenantForm({ ...tenantForm, domain: e.target.value })}
                  placeholder="e.g. abcspinning.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Address <span className="text-xs text-gray-400">(optional)</span></label>
                <input
                  value={tenantForm.address}
                  onChange={e => setTenantForm({ ...tenantForm, address: e.target.value })}
                  placeholder="e.g. 123 Main St"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Industry <span className="text-xs text-gray-400">(optional)</span></label>
                <input
                  value={tenantForm.industry}
                  onChange={e => setTenantForm({ ...tenantForm, industry: e.target.value })}
                  placeholder="e.g. Textiles"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Phone <span className="text-xs text-gray-400">(optional)</span></label>
                <input
                  value={tenantForm.phone}
                  onChange={e => setTenantForm({ ...tenantForm, phone: e.target.value })}
                  placeholder="e.g. +1-555-1234"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              disabled={tenantMutation.status === 'pending'}
            >
              {tenantMutation.status === 'pending' ? 'Creating...' : 'Next'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleUserSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2">Add First User</h2>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Name <span className="text-red-500">*</span></label>
                  <input
                    value={userForm.name}
                    onChange={e => setUserForm({ ...userForm, name: e.target.value })}
                    required
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                    required
                    placeholder="e.g. john@abcspinning.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Password <span className="text-red-500">*</span></label>
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                    required
                    placeholder="Set a password for the user"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              disabled={userMutation.status === 'pending'}
            >
              {userMutation.status === 'pending' ? 'Creating...' : 'Create User & Finish'}
            </button>
          </form>
        )}
      </div>
    </SuperAdminModal>
  ) : null;
};

export default SuperAdminTenantWizardModal; 