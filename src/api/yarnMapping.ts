import api from './axios';
import { YarnMappingForm } from '../types/yarnMapping';

const endpoint = '/yarns';

export const getYarnMappings = () => api.get(endpoint).then(res => res.data);

export const getYarnMappingById = (id: string) =>
  api.get(`${endpoint}/${id}`).then(res => res.data);

export const createYarnMapping = (data: YarnMappingForm) =>
  api.post(endpoint, data).then(res => res.data);

export const updateYarnMapping = (id: string, data: Partial<YarnMappingForm>) =>
  api.put(`${endpoint}/${id}`, data).then(res => res.data);

export const deleteYarnMapping = (id: string) =>
  api.delete(`${endpoint}/${id}`).then(res => res.data);