import api from './axios';
import { Fiber } from '../types/fiber';

// 🔁 Get all fibers
export const getAllFibers = async (): Promise<Fiber[]> => {
  const response = await api.get('/fibres');
  return response.data;
};

// ➕ Create a new fiber
export const createFiber = async (fiber: Omit<Fiber, 'id'>): Promise<Fiber> => {
  const response = await api.post('/fibres', fiber);
  return response.data;
};

// 📝 Update an existing fiber
export const updateFiber = async (id: string, fiber: Partial<Fiber>): Promise<Fiber> => {
  const response = await api.put(`/fibres/${id}`, fiber);
  return response.data;
};

// ❌ Delete a fiber
export const deleteFiber = async (id: string): Promise<void> => {
  await api.delete(`/fibres/${id}`);
};

// 🔍 Get a single fiber by ID
export const getFiberById = async (id: string): Promise<Fiber> => {
  const response = await api.get(`/fibres/${id}`);
  return response.data;
};

export const getLowStockFibres = async (): Promise<Fiber[]> => {
  const response = await api.get('/fibres/low-stock');
  return response.data;
};

export const getFiberUsageTrend = async (fibreId: string): Promise<{ date: string; usedKg: number }[]> => {
  const response = await api.get(`/api/fibres/${fibreId}/usage`);
  return response.data;
};