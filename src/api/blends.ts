// src/api/blends.ts
import axios from './axios';
import api from './axios';

const endpoint = '/blends';

export const getAllBlends = () => api.get(endpoint);
export const getBlends = async () => {
    const response = await axios.get('/blends');
    return response.data;
  };

export const getBlendById = (id: string) => api.get(`${endpoint}/${id}`);

export const createBlend = (data: {
  blend_code: string;
  description?: string;
}) => api.post(endpoint, data);

export const updateBlend = (id: string, data: {
  blend_code?: string;
  description?: string;
}) => api.put(`${endpoint}/${id}`, data);

export const deleteBlend = (id: string) => api.delete(`${endpoint}/${id}`);