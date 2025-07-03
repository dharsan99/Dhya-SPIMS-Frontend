import api from './axios';

const endpoint = '/yarns';

// Get all yarns
export const getAllYarns = () => api.get(endpoint);

// Get a specific yarn by ID
export const getYarnById = (id: string) => api.get(`${endpoint}/${id}`);

// Create a new yarn
export const createYarn = (data: {
  tenant_id: string;
  yarn_type_id: string;
  blend_id: string;
  count_range: string;
  base_shade: string;
  special_effect?: string;
  status?: 'active' | 'inactive';
}) => api.post(endpoint, data);

// Update a yarn
export const updateYarn = (
    id: string,
    data: {
      count_range: string;
      base_shade: string;
      special_effect?: string;
      status?: 'active' | 'inactive';
    }
  ) => api.put(`${endpoint}/${id}`, data);

// Delete or deactivate a yarn
export const deleteYarn = (id: string) => api.delete(`${endpoint}/${id}`);