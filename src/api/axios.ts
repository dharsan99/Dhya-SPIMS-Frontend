import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import useAuthStore from '../hooks/auth';
import useTenantStore from '@/hooks/useTenantStore';
import { toast } from 'sonner';


const instance = axios.create({
  baseURL: 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    const user = useAuthStore.getState().user;
    const tenantId = useTenantStore.getState().tenantId;

    console.log('tenantid', tenantId);
    console.log('user tenantId', user?.tenantId);

    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    // For superadmin routes, use the superadmin's own tenant ID from JWT token
    const isSuperAdminRoute = config.url?.includes('/dashboard/admin') || 
                             config.url?.includes('/admin/') ||
                             config.url?.includes('/superadmin/');
    
    if (isSuperAdminRoute) {
      // For superadmin routes, use the superadmin's own tenant ID
      if (user?.tenantId) {
        config.headers.set('x-tenant-id', user.tenantId);
        console.log('Superadmin route: Using superadmin tenant ID:', user.tenantId);
      }
    } else if (tenantId) {
      // For regular routes, use the current tenant ID
      config.headers.set('x-tenant-id', tenantId);
      console.log('Regular route: Using current tenant ID:', tenantId);
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
    if (error._handled) {
      // Skip showing toast if already handled
      return Promise.reject(error);
    }
    const status = error.response?.status;

    if (status === 401) {
      // TEMP: Do not logout or redirect to login on 401. Just show the error toast for debugging.
      toast.error('Unauthorized (401): Your session is invalid or expired. [Debug: No redirect performed]');
    } else {
      let message = 'Something went wrong. Please try again.';
      const responseData = error.response?.data;

      // Try to extract a meaningful error message
      if (typeof responseData === 'string') {
        if (responseData.includes('<!DOCTYPE html>')) {
          message = 'API route not found or returned HTML error.';
        } else {
          message = responseData;
        }
      } else if (responseData && typeof responseData === 'object') {
        // Try common keys for error messages
        message = responseData.error || JSON.stringify(responseData);
      } else if (error.message) {
        message = error.message;
      }

      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default instance;
