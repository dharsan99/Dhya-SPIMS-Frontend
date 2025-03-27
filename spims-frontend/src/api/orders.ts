// src/api/orders.ts
import api from './axios';

const endpoint = '/orders';

export const getAllOrders = () => api.get(endpoint);

export const getOrderById = (id: string) => api.get(`${endpoint}/${id}`);

export const createOrder = (data: {
  tenant_id: string;
  order_number: string;
  buyer_name: string;
  yarn_id: string;
  quantity_kg: number;
  delivery_date: string; // Format: YYYY-MM-DD
  status?: 'pending' | 'in_progress' | 'dispatched';
  created_by: string;
}) => api.post(endpoint, data);

export const updateOrder = (id: string, data: {
  buyer_name?: string;
  yarn_id?: string;
  quantity_kg?: number;
  delivery_date?: string;
  status?: 'pending' | 'in_progress' | 'dispatched';
}) => api.put(`${endpoint}/${id}`, data);

export const deleteOrder = (id: string) => api.delete(`${endpoint}/${id}`);