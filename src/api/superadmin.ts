import api from './axios';

export interface DashboardStat {
  id: string;
  key: string;
  title: string;
  value: number;
  change: number;
  change_type: 'positive' | 'negative' | 'neutral' | string;
}

export interface DashboardStatsResponse {
  dashboard_stats: DashboardStat[];
}

export interface RecentActivity {
  type: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface SuperAdminSummary {
  totalPurchaseOrders: number;
  totalProductionOrders: number;
  pendingFibreTransfers: number;
  recentActivities: RecentActivity[];
}

export const fetchSuperAdminDashboard = async (): Promise<DashboardStat[]> => {
  const response = await api.get<DashboardStatsResponse>('/dashboard/admin');
  // console.log('dashboard',response.data)
  return response.data.dashboard_stats;
}; 

export const fetchSuperAdminSummary = async (): Promise<SuperAdminSummary> => {
  const response = await api.get<SuperAdminSummary>('/dashboard/summary');
  // console.log('summary',response.data)
  return response.data;
}; 