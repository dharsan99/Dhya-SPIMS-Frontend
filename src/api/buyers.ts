// src/api/buyers.ts
import api from './axios';

import { Buyer } from '../types/buyer';

export interface CreateBuyerInput {
  name: string;
  contact?: string;
  email?: string;
  address?: string;
}

export interface UpdateBuyerInput extends CreateBuyerInput {
  id: string;
}

const endpoint = '/buyers';

export const getBuyers = async (): Promise<Buyer[]> => {
  const response = await api.get(endpoint);
  return response.data;
};

export const getBuyerById = async (id: string): Promise<Buyer> => {
  const response = await api.get(`/buyers/${id}`);
  return response.data;
};

export const createBuyer = async (data: Partial<Buyer>): Promise<Buyer> => {
  const response = await api.post(endpoint, data);
  return response.data;
};

export const updateBuyer = async (id: string, data: CreateBuyerInput): Promise<Buyer> => {
  const response = await api.put(`/buyers/${id}`, data);
  return response.data;
};

export const deleteBuyer = async (id: string): Promise<void> => {
  await api.delete(`/buyers/${id}`);
};
