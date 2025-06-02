// src/api/brands.ts
import api from './axios';
import instance from './axios';


const endpoint = '/brands';

export const getAllBrands = () => api.get(endpoint);

export const getBrands = () => {
    return instance.get('/brands');
  };

export const getBrandById = (id: string) => api.get(`${endpoint}/${id}`);

export const createBrand = (data: {
  name: string;
  type?: string;
  description?: string;
}) => api.post(endpoint, data);

export const updateBrand = (id: string, data: {
  name?: string;
  type?: string;
  description?: string;
}) => api.put(`${endpoint}/${id}`, data);

export const deleteBrand = (id: string) => api.delete(`${endpoint}/${id}`);