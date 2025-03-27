// src/api/axios.ts
import axios, { AxiosRequestConfig } from 'axios';
import useAuthStore from '../hooks/auth';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Add JWT token dynamically using Zustand store
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = useAuthStore.getState().token;

    if (!config.headers) {
      config.headers = {};
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('🔐 Auth token added to request');
    } else {
      console.warn('⚠️ No token found in Zustand auth store');
    }

    return config;
  },
  (error) => {
    console.error('❌ Axios request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ✅ Handle unauthorized errors globally
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn('🔐 Unauthorized - logging out');
      useAuthStore.getState().logout();
      window.location.href = '/login';
    } else if (status >= 500) {
      console.error('🚨 Server error:', error.response?.data || error.message);
    }

    return Promise.reject(error);
  }
);

export default instance;