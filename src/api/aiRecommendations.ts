import axiosInstance from './axios';

export interface AiRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'production' | 'financial' | 'quality' | 'sustainability';
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  estimatedBenefit: {
    value: number;
    unit: string;
    timeframe: string;
  };
  implementation: {
    difficulty: 'easy' | 'medium' | 'hard';
    timeRequired: string;
    resources: string[];
  };
  status: 'pending' | 'applied' | 'rejected';
  timestamp: Date;
}

export interface ApplyRecommendationResponse {
  success: boolean;
  message: string;
  appliedAt: Date;
  expectedImpact: {
    metric: string;
    improvement: number;
    timeframe: string;
  };
}

export const applyAiRecommendation = async (recommendationId: string): Promise<ApplyRecommendationResponse> => {
  try {
    const response = await axiosInstance.post(`/api/ai/recommendations/${recommendationId}/apply`);
    return response.data;
  } catch (error) {
    console.error('Error applying AI recommendation:', error);
    throw error;
  }
};

export const fetchAiRecommendations = async (): Promise<AiRecommendation[]> => {
  try {
    const response = await axiosInstance.get('/api/ai/recommendations');
    return response.data;
  } catch (error) {
    console.error('Error fetching AI recommendations:', error);
    throw error;
  }
}; 