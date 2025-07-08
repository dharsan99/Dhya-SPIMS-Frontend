import api from './axios';

export const getPlans = async () => {
  const res = await api.get('/plans');
  return res.data.data;
};
