
import api from './axios';

export interface FetchSuperAdminTenantsParams {
  search?: string;
  status?: string;
  plan?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface Tenant {
  id: string;
  name: string;
  domain?: string;
  status?: 'active' | 'inactive' | 'suspended' | string;
  plan?: string;
  userCount?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastActive?: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface FetchSuperAdminTenantsResponse {
  tenants: Tenant[];
  pagination: Pagination;
}

export const fetchSuperAdminTenants = async (
  params: FetchSuperAdminTenantsParams = {}
): Promise<FetchSuperAdminTenantsResponse> => {
  const response = await api.get('/dashboard/admin/tenants', { params });
  // console.log('responsedata', response.data.data)
  return response.data.data;
};

export const fetchSuperAdminTenantById = async (id: string) => {
  const response = await api.get(`/dashboard/admin/tenants/${id}`);
  return response.data.data;
};

export const createSuperAdminTenantUser = async ({
  tenantId,
  name,
  email,
  password,
}: {
  tenantId: string;
  name: string;
  email: string;
  password: string;
}) => {
  const response = await api.post(`/dashboard/admin/tenants/${tenantId}/users`, {
    name,
    email,
    password,
  });
  return response.data.data;
};

export const createSuperAdminTenant = async (data: { name: string; domain?: string; address?: string; industry?: string; phone?: string }) => {
  const response = await api.post('/dashboard/admin/createTenant', data);
  return response.data;
};

export const adminSignup = async ({ name, email, password, tenantId }: { name: string; email: string; password: string; tenantId: string }) => {
  const response = await api.post('/admin/signup', { name, email, password, tenantId });
  return response.data.data;
};

export const verifyAdminEmail = async (token: string) => {
  const response = await api.get('http://localhost:5001/dashboard/admin/verify-mail', { params: { token } });
  return response.data;
};

export const updateSuperAdminTenant = async (id: string, data: {
  name: string;
  status: 'active' | 'inactive' | 'suspended';
  companyDetails: {
    address?: string;
    phone?: string;
    industry?: string;
    domain?: string;
  };
}) => {
  const response = await api.put(`/dashboard/admin/tenants/${id}`, data);
  return response.data;
}; 