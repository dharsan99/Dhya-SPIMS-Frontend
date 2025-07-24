import api from './axios';

const endpoint = '/tenants';

interface TenantDetails {
  id: string;
  name: string;
  domain?: string;
  plan?: string;
  is_active: boolean;
  logo?: string; // base64 logo data
}


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
  logo?: string; // base64 logo data
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

export const getTenantDetails = async (id: string): Promise<{ data: TenantDetails }> => {
  return api.get(`${endpoint}/${id}/details`);
};

export const updateTenantLogo = (id: string, logoBase64: string) => 
  api.put(`${endpoint}/${id}/logo`, { logo: logoBase64 });

// Deactivate tenant (soft delete)
export const deleteTenant = (id: string) => api.delete(`${endpoint}/${id}`);


export type { TenantDetails };