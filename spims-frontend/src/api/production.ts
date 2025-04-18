import api from './axios';
import { ProductionForm } from '../types/production';

const endpoint = '/productions';

export const getProduction = () => api.get(endpoint).then(res => res.data);

export const getProductionById = (id: string) =>
  api.get(`${endpoint}/${id}`).then(res => res.data);

export const getOrderProgress = (orderId: string) =>
  api.get(`/production/progress/${orderId}`).then((res) => res.data);

export const createProduction = (data: ProductionForm) => {
  console.log('📤 Sending production payload:', data);
  return api.post(endpoint, data).then(res => res.data);
};

export const updateProduction = (id: string, data: Partial<ProductionForm>) =>
  api.put(`${endpoint}/${id}`, data).then(res => res.data);

export const deleteProduction = (id: string) =>
  api.delete(`${endpoint}/${id}`).then(res => res.data);

// ✅ Analytics and Efficiency APIs
export const getDailyEfficiency = () =>
  api.get(`${endpoint}/efficiency/daily`).then(res => res.data);

export const getMachineEfficiency = () =>
  api.get(`${endpoint}/efficiency/machine`).then(res => res.data);

export const getProductionAnalytics = () =>
  api.get(`${endpoint}/analytics`).then(res => res.data);

export const getProductionLogs = () =>
  api.get(`${endpoint}/logs`).then(res => res.data);