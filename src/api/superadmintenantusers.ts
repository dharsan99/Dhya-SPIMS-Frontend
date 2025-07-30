import api from './axios';

export interface TenantUserRole {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  permissions: Record<string, string[]>;
  createdAt: string;
  updatedAt: string;
}

export interface TenantInfo {
  id: string;
  name: string;
  domain: string;
  plan: string;
  isActive: boolean;
  storagePath: string | null;
  address: string | null;
  phone: string | null;
  industry: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TenantUser {
  id: string;
  tenantId: string;
  tenant: TenantInfo;
  name: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  role: TenantUserRole;
  tenants: TenantInfo;
}

export interface TenantUsersPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface FetchTenantUsersResponse {
  users: TenantUser[];
  pagination: TenantUsersPagination;
}

export const fetchSuperAdminTenantUsers = async (params: { search?: string; status?: string; tenantId?: string; page?: number; limit?: number } = {}): Promise<FetchTenantUsersResponse> => {
  const response = await api.get('/dashboard/admin/users', { params });
  return response.data.data;
};

export interface InviteTenantUserVars {
  email: string;
  tenantId: string;
  roleId: string;
  isSuperadmin?: boolean;
}

export const inviteTenantUser = async ({
  email,
  tenantId,
  roleId,
  isSuperadmin = true,
}: InviteTenantUserVars): Promise<any> => {
  const response = await api.post('/dashboard/admin/invite-user', {
    email,
    tenantId,
    roleId,
    isSuperadmin,
  });
  return response.data;
};

export const adminAcceptInvite = async ({ name, password, token }: { name: string; password: string; token: string }): Promise<any> => {
  const response = await api.post('/dashboard/admin/accept-invite', {
    name,
    password,
    token,
  });
  return response.data;
};

export const updateTenantUser = async ({ id, name, roleId }: { id: string; name: string; roleId: string }): Promise<any> => {
  const response = await api.put(`/dashboard/admin/users/${id}`, {
    name,
    role_id: roleId,
  });
  return response.data;
};

export const deleteTenantUser = async (id: string): Promise<any> => {
  const response = await api.delete(`/dashboard/admin/users/${id}`);
  return response.data;
};
