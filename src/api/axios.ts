// src/api/axios.ts
import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import useAuthStore from '../hooks/auth';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    } else {
    }

    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error: any) => {
    const status = error.response?.status;

    if (status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    } else if (status >= 500) {
    }

    return Promise.reject(error);
  }
);

export default instance;