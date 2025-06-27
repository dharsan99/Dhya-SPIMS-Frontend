import api from './axios';
import { Order } from '../types/order';
import { FiberUsageSummary } from '../components/ProductionTabs/orderprogress/FiberSummary';
import { LogEntry } from '../components/ProductionTabs/orderprogress/EfficiencyInsights';
import { ProgressKPIProps } from '../components/ProductionTabs/orderprogress/ProgressKPI';
import { normalizeOrders } from '../utils/normalizeOrders';

const endpoint = '/orders';

/**
 * ✅ Fetch all orders
 */

export const getAllOrders = async (): Promise<Order[]> => {
  const response = await api.get(endpoint);
  return normalizeOrders(response.data); // Normalize here
};

/**
 * ✅ Fetch single order by ID
 */
export const getOrderById = async (id: string): Promise<Order> => {
  const response = await api.get(`${endpoint}/${id}`);
  return response.data;
};

/**
 * ✅ Create a new order (now supports count)
 */
export const createOrder = (data: {
  tenant_id: string;
  buyer_id: string;
  shade_id: string;
  quantity_kg: number;
  delivery_date: string;
  created_by: string;
  status?: 'pending' | 'in_progress' | 'completed';
  order_number?: string;
  realisation?: number;
  count?: number; // ✅ New
}) => {
  console.log('📤 Creating order:', data);
  return api.post(endpoint, data);
};

/**
 * ✅ Update full order (now supports count)
 */
export const updateOrder = (
  id: string,
  data: {
    buyer_id?: string;
    shade_id?: string;
    quantity_kg?: number;
    delivery_date?: string;
    status?: 'pending' | 'in_progress' | 'completed';
    realisation?: number;
    count?: number;
    raw_cotton_updates?: {
      id: string;
      lot_number?: string;
      stock_kg?: string;
      grade?: string;
      source?: string;
      notes?: string;
    }[]; // ✅ Added
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

/**
 * ✅ Update only the order status
 */
export const updateOrderStatus = (id: string, status: 'pending' | 'in_progress' | 'completed') => {
  console.log(`🔄 Updating status for order ${id} → ${status}`);
  return api.put(`${endpoint}/${id}/status`, { status });
};

/**
 * ✅ Get full progress details
 */
export const getOrderProgressDetails = async (id: string): Promise<{
  insights: LogEntry[];
  timeline: any;
  fiberSummary: FiberUsageSummary[];
  dailyChart: any;
  kpis: ProgressKPIProps['data'];
  requiredQty: number;
  producedQty: number;
  averageEfficiency: number;
  topProductionDay: {
    date: string;
    production: number;
  };
  noProductionDays: string[];
}> => {
  const response = await api.get(`${endpoint}/${id}/progress-details`);
  return response.data;
};