import api from './axios';

export interface TenantUserRole {
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  permissions: Record<string, string[]>;
  created_at: string;
  updated_at: string;
}

export interface TenantInfo {
  id: string;
  name: string;
  domain: string;
  plan: string;
  is_active: boolean;
  storage_path: string | null;
  address: string | null;
  phone: string | null;
  industry: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TenantUser {
  id: string;
  tenant_id: string;
  name: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
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

export const fetchSuperAdminTenantUsers = async (params: { search?: string; status?: string; tenant_id?: string; page?: number; limit?: number } = {}): Promise<FetchTenantUsersResponse> => {
  const response = await api.get('/dashboard/admin/users', { params });
  return response.data.data;
};

export interface InviteTenantUserVars {
  email: string;
  tenant_id: string;
  role_id: string;
}

export const inviteTenantUser = async ({
  email,
  tenant_id,
  role_id,
}: InviteTenantUserVars): Promise<any> => {
  const response = await api.post('/dashboard/admin/invite-user', {
    email,
    tenant_id,
    role_id,
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

export const updateTenantUser = async ({ id, name, role_id }: { id: string; name: string; role_id: string }): Promise<any> => {
  const response = await api.put(`/dashboard/admin/users/${id}`, {
    name,
    role_id,
  });
  return response.data;
};

export const deleteTenantUser = async (id: string): Promise<any> => {
  const response = await api.delete(`/dashboard/admin/users/${id}`);
  return response.data;
};
