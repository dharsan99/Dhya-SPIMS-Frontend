import { DashboardSummary } from '../types/dashboard';
import axios from './axios';

export interface ProductionTimelineData {
  date: string;
  actual: number;
  target: number;
}

export interface MachineStatus {
  machine_id: string;
  machine_name: string;
  status: 'running' | 'idle' | 'maintenance' | 'offline';
  efficiency: number;
  current_order?: string;
}

export interface DashboardData {
  totalOrders: number;
  ordersByStatus: {
    pending?: number;
    in_progress?: number;
    completed?: number;
    dispatched?: number;
  };
  orderTrend: number;
  orderTrendHistory: number[];
  totalProductionToday: number;
  totalProductionMTD: number;
  totalProductionYTD: number;
  productionEfficiencyToday: number;
  productionEfficiencyMTD: number;
  productionEfficiencyHistory: number[];
  lowStockItems: number;
  pendingFiberShortages: number;
  pendingOrders: number;
  overdueOrders: number;
  attendanceRateToday: number;
  attendanceOvertimeToday: number;
  attendanceRateHistory: number[];
  receivables: {
    total: number;
    overdue: number;
  };
  payables: {
    total: number;
    overdue: number;
  };
  machineEfficiency: Array<{
    machine: string;
    avg_efficiency: number;
  }>;
  topBuyers: Array<{
    buyer_id: string;
    buyer_name: string;
    total_order_qty: number;
  }>;
  topSuppliers: Array<{
    supplier: string;
    total: number;
  }>;
  machineStatuses: MachineStatus[];
  totalMachines: number;
  runningMachines: number;
  idleMachines: number;
  maintenanceMachines: number;
  offlineMachines: number;
}

export const fetchDashboardData = async (): Promise<DashboardSummary> => {
  const response = await axios.get<DashboardSummary>('/api/dashboard/summary');
  return response.data;
}; 