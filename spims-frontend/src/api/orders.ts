import api from './axios';
import { Order } from '../types/order';

const endpoint = '/orders';

/**
 * ✅ Fetch all orders
 */
export const getAllOrders = async (): Promise<Order[]> => {
  const response = await api.get(endpoint);
  return response.data;
};

/**
 * ✅ Fetch single order by ID
 */
export const getOrderById = async (id: string): Promise<Order> => {
  const response = await api.get(`${endpoint}/${id}`);
  return response.data;
};

/**
 * ✅ Create a new order (realisation optional)
 */
export const createOrder = (data: {
  tenant_id: string;
  buyer_id: string;
  shade_id: string;
  quantity_kg: number;
  delivery_date: string;
  created_by: string;
  status?: 'pending' | 'in_progress' | 'dispatched';
  order_number?: string;
  realisation?: number; // ✅ optional realisation %
}) => {
  console.log('📤 Creating order:', data);
  return api.post(endpoint, data);
};

/**
 * ✅ Update order by ID (realisation optional)
 */
export const updateOrder = (
  id: string,
  data: {
    buyer_id?: string;
    shade_id?: string;
    quantity_kg?: number;
    delivery_date?: string;
    status?: 'pending' | 'in_progress' | 'dispatched';
    realisation?: number; // ✅ optional realisation %
  }
) => {
  console.log(`🛠️ Updating order ${id}:`, data);
  return api.put(`${endpoint}/${id}`, data);
};

/**
 * ✅ Delete an order
 */
export const deleteOrder = (id: string) => {
  console.log(`🗑️ Deleting order ${id}`);
  return api.delete(`${endpoint}/${id}`);
};