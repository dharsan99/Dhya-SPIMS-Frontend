import axiosInstance from './axios';

export interface PredictionRequest {
  modelId: string;
  timeframe: 'short' | 'medium' | 'long';
  parameters?: Record<string, any>;
}

export interface PredictionResponse {
  id: string;
  modelId: string;
  predictions: Array<{
    date: string;
    predicted: number;
    confidence: number;
    upperBound: number;
    lowerBound: number;
  }>;
  accuracy: number;
  generatedAt: Date;
  metadata: {
    modelType: string;
    trainingDataPoints: number;
    lastTrainingDate: Date;
  };
}

export const generatePrediction = async (modelId: string): Promise<PredictionResponse> => {
  try {
    const response = await axiosInstance.post(`/api/ai/predictions/generate`, {
      modelId,
      timeframe: 'medium'
    });
    return response.data;
  } catch (error) {
    console.error('Error generating prediction:', error);
    throw error;
  }
};

export const fetchPredictionHistory = async (modelId: string): Promise<PredictionResponse[]> => {
  try {
    const response = await axiosInstance.get(`/api/ai/predictions/${modelId}/history`);
    return response.data;
  } catch (error) {
    console.error('Error fetching prediction history:', error);
    throw error;
  }
}; 