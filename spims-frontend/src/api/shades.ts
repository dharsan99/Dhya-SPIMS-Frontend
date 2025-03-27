import api from './axios';

const endpoint = '/shades';

// Get all shades
export const getAllShades = () => api.get(endpoint);

// Get shade by ID
export const getShadeById = (id: string) => api.get(`${endpoint}/${id}`);

// Create a new shade
export const createShade = (data: {
    id: string;
    shade_code: string;
    brand_id: string;
    blend_id: string;
    shade_name: string;
    percentage?: string;
    available_stock_kg?: number;
  }) => api.post(endpoint, data);

// Update a shade
// Update a shade
export const updateShade = (
    id: string,
    data: Partial<{
      shade_code: string;
      shade_name: string;
      percentage?: string;
      available_stock_kg?: number;
      brand_id: string;
      blend_id: string;
    }>
  ) => api.put(`/shades/${id}`, data);

// Delete a shade
export const deleteShade = (id: string) => api.delete(`${endpoint}/${id}`);