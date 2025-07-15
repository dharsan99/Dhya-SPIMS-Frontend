import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSuperAdminTenantById } from '../../api/superadmintenants';
import { CheckCircle, XCircle } from 'lucide-react';
import Modal from '../SuperAdminModal';

interface TenantDetailsModalProps {
  open: boolean;
  onClose: () => void;
  tenantId: string | null;
}

const placeholder = '-';

const getPlanBadge = (plan: string | undefined) => {
  if (!plan) return <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">{placeholder}</span>;
  const color =
    plan === 'premium'
      ? 'bg-purple-100 text-purple-800'
      : plan === 'enterprise'
      ? 'bg-orange-100 text-orange-800'
      : 'bg-blue-100 text-blue-800';
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>{plan.charAt(0).toUpperCase() + plan.slice(1)}</span>;
};

const getStatusBadge = (isActive: boolean | undefined) => {
  return isActive ? (
    <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-semibold">
      <CheckCircle className="w-3 h-3" /> Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-semibold">
      <XCircle className="w-3 h-3" /> Inactive
    </span>
  );
};

const TenantDetailsModal: React.FC<TenantDetailsModalProps> = ({ open, onClose, tenantId }) => {
  const { data: tenant, isLoading } = useQuery({
    queryKey: ['superadmin-tenant-details', tenantId],
    queryFn: () => tenantId ? fetchSuperAdminTenantById(tenantId) : Promise.resolve(null),
    enabled: !!tenantId && open,
    retry: false,
  });

  if (!open) return null;

  return (
    <Modal onClose={onClose}>
      <div className="mb-4 flex items-center justify-between w-full">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">Tenant Details</span>
      </div>
      {isLoading ? (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">Loading...</div>
      ) : !tenant ? (
        <div className="py-12 text-center text-gray-500 dark:text-gray-400">No details found.</div>
      ) : (
        <div className="space-y-6">
          {/* General Info */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-4 mb-2">
              <p className="text-xl font-semibold text-blue-700 dark:text-blue-300">{tenant.name || placeholder}</p>
              <div className="flex gap-2 mt-2 md:mt-0">
                {getStatusBadge(tenant.is_active)}
                {getPlanBadge(tenant.plan)}
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{tenant.domain || placeholder}</div>
            <div className="text-xs text-gray-400">Created: {tenant.created_at ? new Date(tenant.created_at).toLocaleDateString() : placeholder}</div>
          </div>

          {/* Company Details */}
          {tenant.companyDetails && (
            <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <div className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Company Details</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium">Address:</span> {tenant.companyDetails.address || placeholder}</div>
                <div><span className="font-medium">Phone:</span> {tenant.companyDetails.phone || placeholder}</div>
                <div><span className="font-medium">Industry:</span> {tenant.companyDetails.industry || placeholder}</div>
                <div><span className="font-medium">Website:</span> {tenant.companyDetails.website || placeholder}</div>
              </div>
            </div>
          )}

          {/* Subscription */}
          {tenant.subscription && (
            <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <div className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Subscription</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium">Plan:</span> {tenant.subscription.plan || placeholder}</div>
                <div><span className="font-medium">Status:</span> {tenant.subscription.status || placeholder}</div>
                <div><span className="font-medium">Start:</span> {tenant.subscription.startDate ? new Date(tenant.subscription.startDate).toLocaleDateString() : placeholder}</div>
                <div><span className="font-medium">End:</span> {tenant.subscription.endDate ? new Date(tenant.subscription.endDate).toLocaleDateString() : placeholder}</div>
              </div>
            </div>
          )}

          {/* Usage */}
          {tenant.usage && (
            <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <div className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Usage</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium">Total Users:</span> {tenant.usage.totalUsers ?? placeholder}</div>
                <div><span className="font-medium">Active Users:</span> {tenant.usage.activeUsers ?? placeholder}</div>
                <div><span className="font-medium">Storage Used:</span> {tenant.usage.storageUsed ?? placeholder}</div>
                <div><span className="font-medium">Storage Limit:</span> {tenant.usage.storageLimit ?? placeholder}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default TenantDetailsModal; 