import { useState } from 'react';
import { FiPlus, FiEdit, FiEye, FiSearch } from 'react-icons/fi';
import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';
import { fetchSuperAdminTenants, fetchSuperAdminTenantById, updateSuperAdminTenant, FetchSuperAdminTenantsResponse } from '../../api/superadmintenants';
import Pagination from '../../components/Pagination';
import TenantDetailsModal from '../../components/superadmin/TenantDetailsModal';
import SuperAdminTenantWizardModal from '../../components/superadmin/SuperAdminTenantWizardModal';
import TenantUpdateModal from '../../components/superadmin/TenantUpdateModal';
import { useDebounce } from '../../hooks/useDebounce';
import { toast } from 'sonner';

function Tenants() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400); // 300ms debounce
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const queryClient = useQueryClient();

  // Fetch tenants from API
  const { data, isLoading } = useQuery<FetchSuperAdminTenantsResponse>({
    queryKey: ['superadmin-tenants', debouncedSearch, statusFilter, page, rowsPerPage],
    queryFn: () => fetchSuperAdminTenants({
      search: debouncedSearch,
      status: statusFilter,
      page,
      limit: rowsPerPage,
    }),
    placeholderData: keepPreviousData,
    retry: false
  });

  // Fetch full tenant details for selectedTenantId
  const { data: selectedTenantDetails, isLoading: isDetailsLoading } = useQuery({
    queryKey: ['superadmin-tenant-details', selectedTenantId],
    queryFn: () => selectedTenantId ? fetchSuperAdminTenantById(selectedTenantId) : Promise.resolve(null),
    enabled: !!selectedTenantId && (detailsModalOpen || editModalOpen),
    retry: false,
  });


  const tenants = data?.tenants ?? [];

  console.log('tenants', tenants)
  const pagination = data?.pagination ?? { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: rowsPerPage };

  const filteredTenants = tenants; // Filtering is now server-side

  const getStatusBadge = (status: string | undefined, is_active?: boolean) => {
    const statusKey = status || (is_active ? 'active' : 'inactive');
    const statusClasses = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[statusKey as keyof typeof statusClasses] || statusClasses.inactive}`}>
        {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
      </span>
    );
  };

  const getPlanBadge = (plan: string | undefined) => {
    const planKey = plan || 'basic';
    const planClasses = {
      basic: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      premium: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      enterprise: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${planClasses[planKey as keyof typeof planClasses] || planClasses.basic}`}>
        {planKey.charAt(0).toUpperCase() + planKey.slice(1)}
      </span>
    );
  };

  const handleEditClick = (tenant: any) => {
    console.log('tenant details', tenant)
    setSelectedTenantId(tenant.id);
    setEditModalOpen(true);
  };

  const handleDetailsClick = (tenant: any) => {
    setSelectedTenantId(tenant.id);
    setDetailsModalOpen(true);
  };

  const handleSave = async (payload: any) => {
    if (!selectedTenantId) return;
    const res = await updateSuperAdminTenant(selectedTenantId, payload);
    setEditModalOpen(false);
    // Refetch tenants list and details
    queryClient.invalidateQueries({ queryKey: ['superadmin-tenants'] });
    queryClient.invalidateQueries({ queryKey: ['superadmin-tenant-details', selectedTenantId] });
    if (res?.message) {
      toast.success(res.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 md:gap-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center md:text-left">
            Tenants Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-center md:text-left">
            Manage all registered tenants and their subscriptions
          </p>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          onClick={() => setAddModalOpen(true)}
        >
          <FiPlus className="w-4 h-4" />
          Add Tenant
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tenants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tenant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500 dark:text-gray-400">Loading tenants...</td>
                </tr>
              ) : filteredTenants.length > 0 ? (
                filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {tenant.name || '-'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {tenant.domain || '-'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(tenant.status, tenant.is_active)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tenant.plan ? getPlanBadge(tenant.plan) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {tenant.userCount != null ? tenant.userCount : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {tenant.created_at ? new Date(tenant.created_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {tenant.lastActive ? new Date(tenant.lastActive).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={() => handleDetailsClick(tenant)}
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          onClick={() => handleEditClick(tenant)}
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500 dark:text-gray-400">No tenants found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        page={pagination.currentPage || 1}
        setPage={setPage}
        rowsPerPage={pagination.itemsPerPage || rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        total={pagination.totalItems || 0}
        options={[5, 10, 20, 50]}
      />
      <TenantDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        tenant={selectedTenantDetails}
        isLoading={isDetailsLoading}
      />
      <SuperAdminTenantWizardModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
      <TenantUpdateModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        tenant={selectedTenantDetails}
        isLoading={isDetailsLoading}
        onSave={handleSave}
      />
    </div>
  );
}

export default Tenants; 