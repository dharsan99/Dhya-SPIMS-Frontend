// src/api/fibreCategories.ts
import api from './axios'; // ✅ use your custom axios instance
import { FiberCategory } from '../types/fiber';

export const getFibreCategories = async (): Promise<FiberCategory[]> => {
  const response = await api.get('/fibres/categories');
  return response.data; // Ensure this is an array
};

export const createFibreCategory = async (data: { name: string }) => {
  return api.post('/fibres/categories', data);
};

export const updateFibreCategory = async (id: string, data: { name: string }) => {
  return api.put(`/fibres/categories/${id}`, data);
};

export const deleteFibreCategory = async (id: string) => {
  return api.delete(`/fibres/categories/${id}`);
};