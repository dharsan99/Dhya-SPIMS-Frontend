import { useState } from 'react';
import {FiEdit, FiPlus, FiTrash2 } from 'react-icons/fi';
import Pagination from '../../components/Pagination';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSuperAdminTenantUsers, TenantUser, FetchTenantUsersResponse, inviteTenantUser, updateTenantUser, deleteTenantUser } from '../../api/superadmintenantusers';
import { fetchSuperAdminTenants } from '../../api/superadmintenants';
import { getRoles } from '../../api/roles';
import { toast } from 'react-hot-toast';
import AddUserModal from '../../components/AddUserModal';
import UpdateUserModal from '../../components/UpdateUserModal';
import DebouncedSearchInput from '../../components/DebouncedSearchInput';
import { useDebounce } from '../../hooks/useDebounce';

function TenantUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 600);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tenantFilter, setTenantFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editUser, setEditUser] = useState<null | TenantUser>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<FetchTenantUsersResponse>({
    queryKey: ['superadmin-tenant-users', debouncedSearchQuery, statusFilter, tenantFilter, page, rowsPerPage],
    queryFn: () => fetchSuperAdminTenantUsers({
      ...(debouncedSearchQuery ? { search: debouncedSearchQuery } : {}),
      status: statusFilter === 'all' ? undefined : statusFilter,
      tenant_id: tenantFilter === 'all' ? undefined : tenantFilter,
      page,
      limit: rowsPerPage,
    }),
  });

  const tenantsQuery = useQuery({
    queryKey: ['superadmin-tenants'],
    queryFn: () => fetchSuperAdminTenants(),
  });
  const rolesQuery = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  });

  const inviteMutation = useMutation({
    mutationFn: inviteTenantUser,
    onSuccess: () => {
      toast.success('Invitation sent! Check your Mail for Registration link');
      setAddUserOpen(false);
      // Optionally refetch users here
    },
    onError: () => {
      toast.error('Failed to send invitation');
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: updateTenantUser,
    onSuccess: () => {
      toast.success('User updated!');
      setEditUser(null);
      queryClient.invalidateQueries({ queryKey: ['superadmin-tenant-users'] });
    },
    onError: () => {
      toast.error('Failed to update user');
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteTenantUser,
    onSuccess: (data) => {
      toast.success(data?.message || 'User deactivated!');
      setDeletingUserId(null);
      queryClient.invalidateQueries({ queryKey: ['superadmin-tenant-users'] });
    },
    onError: () => {
      toast.error('Failed to deactivate user');
      setDeletingUserId(null);
    }
  });

  const users: TenantUser[] = data?.users || [];
  const pagination = data?.pagination || { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: rowsPerPage };

  const getStatusBadge = (status: boolean) => {
    const statusKey = status ? 'active' : 'inactive';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 md:gap-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center md:text-left">
            Tenant Users
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-center md:text-left">
            Manage all users belonging to tenants
          </p>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          onClick={() => setAddUserOpen(true)}
        >
          <FiPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <DebouncedSearchInput
              value={searchQuery}
              onDebouncedChange={setSearchQuery}
              placeholder="Search users..."
            />
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
            </select>
          </div>
          <div>
            <select
              value={tenantFilter}
              onChange={(e) => setTenantFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Tenants</option>
              {tenantsQuery.data?.tenants?.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tenant Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
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
                  <td colSpan={8} className="text-center py-12 text-gray-500 dark:text-gray-400">Loading users...</td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.tenants?.name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.is_active)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.role?.name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.updated_at ? new Date(user.updated_at).toLocaleDateString() : '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300" onClick={() => setEditUser(user)}>
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-green-300"
                          onClick={async () => {
                            if (deletingUserId) return;
                            if (window.confirm('Are you sure you want to deactivate this user?')) {
                              setDeletingUserId(user.id);
                              deleteUserMutation.mutate(user.id);
                            }
                          }}
                          disabled={deletingUserId === user.id && deleteUserMutation.isPending}
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-500 dark:text-gray-400">No users found matching your criteria.</td>
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
      <AddUserModal
        open={addUserOpen}
        onClose={() => setAddUserOpen(false)}
        onSubmit={(vars) => inviteMutation.mutate(vars)}
        isLoading={inviteMutation.isPending}
        tenants={tenantsQuery.data?.tenants || []}
        tenantsLoading={tenantsQuery.isLoading}
        roles={rolesQuery.data || []}
        rolesLoading={rolesQuery.isLoading}
      />
      <UpdateUserModal
        open={!!editUser}
        onClose={() => setEditUser(null)}
        onSubmit={({ name, role_id }) => {
          if (editUser) updateUserMutation.mutate({ id: editUser.id, name, role_id });
        }}
        isLoading={updateUserMutation.isPending}
        roles={rolesQuery.data || []}
        rolesLoading={rolesQuery.isLoading}
        initialName={editUser?.name || ''}
        initialRoleId={editUser?.role?.id || ''}
      />
    </div>
  );
}

export default TenantUsers; 