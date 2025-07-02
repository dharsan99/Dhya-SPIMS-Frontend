import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import useAuthStore from '../hooks/auth';
import useTenantStore from '@/hooks/useTenantStore';
import { toast } from 'sonner';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    const tenantId = useTenantStore.getState().tenantId;

    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    if (tenantId) {
      config.headers.set('x-tenant-id', tenantId);
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
    } else {
      let message = 'Something went wrong. Please try again.';
      const responseData = error.response?.data;
    
      if (typeof responseData === 'string') {
        if (responseData.includes('<!DOCTYPE html>')) {
          message = 'API route not found or returned HTML error.';
        } else {
          message = responseData;
        }
      } else if (responseData?.message) {
        message = responseData.message;
      } else if (error.message) {
        message = error.message;
      }
    
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default instance;
