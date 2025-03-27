import api from './axios';

const endpoint = '/tenants';

// Get all tenants
export const getAllTenants = () => api.get(endpoint);

// Get tenant by ID
export const getTenantById = (id: string) => api.get(`${endpoint}/${id}`);

// Create a new tenant
export const createTenant = (data: {
  name: string;
  domain?: string;
  plan?: string;
  is_active?: boolean;
}) => api.post(endpoint, data);

// Update tenant details
export const updateTenant = (
  id: string,
  data: Partial<{
    name: string;
    domain?: string;
    plan?: string;
    is_active?: boolean;
  }>
) => api.put(`${endpoint}/${id}`, data);

// Deactivate tenant (soft delete)
export const deleteTenant = (id: string) => api.delete(`${endpoint}/${id}`);