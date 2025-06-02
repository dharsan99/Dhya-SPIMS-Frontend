import axios from 'axios';
import { BlendFibre } from '../types/blendFibre';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const getAllBlendFibres = async (): Promise<BlendFibre[]> => {
  const response = await axios.get(`${API_BASE_URL}/blend-fibres`);
  return response.data;
};

export const getBlendFibresByBlendId = async (blendId: string): Promise<BlendFibre[]> => {
  const response = await axios.get(`${API_BASE_URL}/blend-fibres/${blendId}`);
  return response.data;
};