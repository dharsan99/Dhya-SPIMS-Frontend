import api from './axios';
import { ProductionForm } from '../types/production';

const endpoint = '/production';

// ✅ Get all production entries
export const getProduction = () => api.get(endpoint).then(res => res.data);

// ✅ Get a specific production record by ID
export const getProductionById = (id: string) => api.get(`${endpoint}/${id}`).then(res => res.data);

// ✅ Create new production entry
export const createProduction = (data: ProductionForm) => {
    console.log('📤 Sending production payload:', data); // ✅ TEMP LOG
    return api.post(endpoint, data).then(res => res.data);
  };

// ✅ Update existing production entry
export const updateProduction = (id: string, data: Partial<ProductionForm>) =>
  api.put(`${endpoint}/${id}`, data).then(res => res.data);

// ✅ Delete a production entry
export const deleteProduction = (id: string) =>
  api.delete(`${endpoint}/${id}`).then(res => res.data);