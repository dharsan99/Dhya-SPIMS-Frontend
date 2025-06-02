// src/api/yarnTypes.ts
import api from './axios';

const endpoint = '/yarn-types';

// Get all yarn types
export const getAllYarnTypes = () => api.get(endpoint);

// Get a yarn type by ID
export const getYarnTypeById = (id: string) => api.get(`${endpoint}/${id}`);

// Create a new yarn type
export const createYarnType = (data: {
  name: string;
  category?: string;
}) => api.post(endpoint, data);

// Update a yarn type
export const updateYarnType = (
  id: string,
  data: {
    name?: string;
    category?: string;
  }
) => api.put(`${endpoint}/${id}`, data);

// Delete a yarn type
export const deleteYarnType = (id: string) => api.delete(`${endpoint}/${id}`);