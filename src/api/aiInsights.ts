import axiosInstance from './axios';

export interface AiInsight {
  id: string;
  type: 'optimization' | 'alert' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: 'production' | 'financial' | 'quality' | 'sustainability';
  actionable: boolean;
  action?: string;
  timestamp: Date;
  data?: {
    currentValue: number;
    targetValue: number;
    trend: 'up' | 'down' | 'stable';
    changePercentage: number;
  };
}

export interface AiInsightsResponse {
  insights: AiInsight[];
  summary: {
    totalInsights: number;
    highImpact: number;
    actionable: number;
    lastUpdated: Date;
  };
}

export const fetchAiInsights = async (): Promise<AiInsightsResponse> => {
  try {
    const response = await axiosInstance.get('/api/ai/insights');
    return response.data;
  } catch (error) {
    console.error('Error fetching AI insights:', error);
    throw error;
  }
}; 