import api from './axios';

export const fetchSuperAdminDashboard = async () => {
  const response = await api.get('/dashboard/admin');
  return response.data.dashboard_stats;
}; 