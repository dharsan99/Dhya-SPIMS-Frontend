import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import Modal from '../SuperAdminModal';
import DetailSection from './DetailSection';


interface TenantDetailsModalProps {
  open: boolean;
  onClose: () => void;
  tenant: any;
  isLoading?: boolean;
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

const TenantDetailsModal: React.FC<TenantDetailsModalProps> = ({ open, onClose, tenant, isLoading }) => {

  if (!open) return null;

  return (
    <Modal onClose={onClose}>
      <div className="mb-7 flex items-center justify-between w-full">
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
            <div className="flex flex-col justify-center items-center md:flex-row md:items-center  md:justify-between md:gap-4 mb-2">
              <p className="text-2xl  md:text-3xl font-semibold text-blue-700 dark:text-blue-300">{tenant.name || placeholder}</p>
              <div className="flex gap-2 mt-2 md:mt-0">
                {getStatusBadge(tenant.is_active)}
                {getPlanBadge(tenant.plan)}
              </div>
            </div>
            <div className='flex flex-col items-center justify-center w-full md:items-start'>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{tenant.domain || placeholder}</div>
            <div className="text-xs text-gray-400">Created: {tenant.created_at ? new Date(tenant.created_at).toLocaleDateString() : placeholder}</div>
            </div>
          </div>

          {/* Company Details */}
          {tenant.companyDetails && (
            <DetailSection
              title="Company Details"
              rows={[
                { label: 'Address:', value: tenant.companyDetails.address || placeholder },
                { label: 'Phone:', value: tenant.companyDetails.phone || placeholder },
                { label: 'Industry:', value: tenant.companyDetails.industry || placeholder },
                { label: 'Website:', value: tenant.companyDetails.domain || placeholder },
              ]}
            />
          )}

          {/* Subscription */}
          {tenant.subscription && (
            <DetailSection
              title="Subscription"
              rows={[
                { label: 'Plan:', value: tenant.subscription.plan || placeholder },
                { label: 'Status:', value: tenant.subscription.status || placeholder },
                { label: 'Start:', value: tenant.subscription.startDate ? new Date(tenant.subscription.startDate).toLocaleDateString() : placeholder },
                { label: 'End:', value: tenant.subscription.endDate ? new Date(tenant.subscription.endDate).toLocaleDateString() : placeholder },
              ]}
            />
          )}

          {/* Usage */}
          {tenant.usage && (
            <DetailSection
              title="Usage"
              rows={[
                { label: 'Total Users:', value: tenant.usage.totalUsers ?? placeholder },
                { label: 'Active Users:', value: tenant.usage.activeUsers ?? placeholder },
                { label: 'Storage Used:', value: tenant.usage.storageUsed ?? placeholder },
                { label: 'Storage Limit:', value: tenant.usage.storageLimit ?? placeholder },
              ]}
            />
          )}
        </div>
      )}
    </Modal>
  );
};

export default TenantDetailsModal; 