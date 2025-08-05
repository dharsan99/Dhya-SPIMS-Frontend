import axiosInstance from './axios';

export interface Prediction {
  date: string;
  predicted: number;
  actual?: number;
  confidence: number;
  upperBound?: number;
  lowerBound?: number;
}

export interface PredictiveModel {
  id: string;
  name: string;
  metric: string;
  accuracy: number;
  lastUpdated: Date;
  predictions: Prediction[];
  modelType: 'linear' | 'neural_network' | 'random_forest' | 'time_series';
  trainingDataPoints: number;
  lastTrainingDate: Date;
  performance: {
    mse: number;
    mae: number;
    r2: number;
  };
}

export interface PredictiveModelsResponse {
  models: PredictiveModel[];
  summary: {
    totalModels: number;
    averageAccuracy: number;
    lastUpdated: Date;
  };
}

export const fetchPredictiveModels = async (): Promise<PredictiveModelsResponse> => {
  try {
    const response = await axiosInstance.get('/api/ai/predictive-models');
    return response.data;
  } catch (error) {
    console.error('Error fetching predictive models:', error);
    throw error;
  }
}; 