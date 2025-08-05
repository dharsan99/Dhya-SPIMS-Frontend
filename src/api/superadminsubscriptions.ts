import api from './axios';

export interface TenantSubscription {
  id: string;
  tenantName: string;
  planName: string;
  description: string;
  price: number;
  billingCycle: string;
  maxUsers: number;
  maxOrders: number;
  maxStorage: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionsPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface FetchTenantSubscriptionsResponse {
  subscriptions: TenantSubscription[];
  pagination: SubscriptionsPagination;
}

export interface FetchTenantSubscriptionsParams {
  search?: string;
  status?: string;
  plan?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

export const fetchTenantSubscriptions = async (params: FetchTenantSubscriptionsParams = {}): Promise<FetchTenantSubscriptionsResponse> => {
  const response = await api.get('/dashboard/admin/tenants/subscriptions', { params });
  return response.data.data;
};

export const createTenantSubscription = async (payload: { tenantId: string; planId: string }) => {
  const response = await api.post('/dashboard/admin/tenants/subscriptions', payload);
  return response.data;
};

export const updateTenantSubscriptionStatus = async (id: string, status: 'active' | 'inactive') => {
  const response = await api.put(`/dashboard/admin/tenants/subscriptions/${id}`, { status });
  return response.data;
};