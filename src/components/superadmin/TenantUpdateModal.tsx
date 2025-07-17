import React, { useState, useEffect } from 'react';
import Modal from '../SuperAdminModal';

interface TenantUpdateModalProps {
  open: boolean;
  onClose: () => void;
  tenant: any;
  isLoading?: boolean;
  onSave?: (payload: any) => Promise<void> | void;
}

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
];

const TenantUpdateModal: React.FC<TenantUpdateModalProps> = ({ open, onClose, tenant, isLoading, onSave }) => {
  const [form, setForm] = useState({
    name: '',
    domain: '',
    address: '',
    phone: '',
    industry: '',
    status: 'active',
  });
  const [saving, setSaving] = useState(false);

  console.log('tenant', tenant)

  useEffect(() => {
    if (tenant) {
      setForm({
        name: tenant.name || '',
        domain: tenant.domain || '',
        address: tenant.companyDetails?.address || '',
        phone: tenant.companyDetails?.phone || '',
        industry: tenant.companyDetails?.industry || '',
        status: tenant.status || 'active',
      });
    }
  }, [tenant, open]);

  if (!open || !tenant) return null;
  if (isLoading) {
    return (
      <Modal onClose={onClose}>
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">Loading...</div>
      </Modal>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSave) return;
    setSaving(true);
    try {
      await onSave({
        name: form.name,
        status: form.status,
        companyDetails: {
          address: form.address,
          phone: form.phone,
          industry: form.industry,
          domain: form.domain,
        },
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <form className="space-y-6 w-full max-w-lg" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2 text-center">Edit Tenant</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Domain</label>
            <input
              value={form.domain}
              onChange={e => setForm({ ...form, domain: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Address</label>
            <input
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Phone</label>
            <input
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Industry</label>
            <input
              value={form.industry}
              onChange={e => setForm({ ...form, industry: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TenantUpdateModal; 