import axiosInstance from './axios';

export interface RealTimeData {
  production: {
    currentOutput: number;
    targetOutput: number;
    efficiency: number;
    machineStatus: Array<{
      id: string;
      name: string;
      status: 'running' | 'stopped' | 'maintenance';
      efficiency: number;
    }>;
  };
  quality: {
    defectRate: number;
    qualityScore: number;
    recentDefects: Array<{
      type: string;
      count: number;
      timestamp: Date;
    }>;
  };
  financial: {
    currentRevenue: number;
    currentCosts: number;
    profitMargin: number;
    cashFlow: number;
  };
  sustainability: {
    energyConsumption: number;
    waterUsage: number;
    wasteReduction: number;
    carbonFootprint: number;
  };
  timestamp: Date;
}

export const fetchRealTimeData = async (): Promise<RealTimeData> => {
  try {
    const response = await axiosInstance.get('/api/dashboard/real-time');
    return response.data;
  } catch (error) {
    console.error('Error fetching real-time data:', error);
    throw error;
  }
}; 