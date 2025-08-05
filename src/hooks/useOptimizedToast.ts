import { useCallback } from 'react';

// Lazy load toast functions
let toastModule: any = null;
let isLoading = false;

const loadToast = async () => {
  if (toastModule) return toastModule;
  if (isLoading) {
    // Wait for the current loading to complete
    while (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    return toastModule;
  }
  
  isLoading = true;
  try {
    toastModule = await import('react-hot-toast');
  } finally {
    isLoading = false;
  }
  return toastModule;
};

export const useOptimizedToast = () => {
  const showToast = useCallback(async (type: 'success' | 'error' | 'loading', message: string, options?: any) => {
    const toast = await loadToast();
    
    switch (type) {
      case 'success':
        return toast.success(message, options);
      case 'error':
        return toast.error(message, options);
      case 'loading':
        return toast.loading(message, options);
      default:
        return toast(message, options);
    }
  }, []);

  const success = useCallback((message: string, options?: any) => {
    return showToast('success', message, options);
  }, [showToast]);

  const error = useCallback((message: string, options?: any) => {
    return showToast('error', message, options);
  }, [showToast]);

  const loading = useCallback((message: string, options?: any) => {
    return showToast('loading', message, options);
  }, [showToast]);

  return {
    success,
    error,
    loading,
    showToast,
  };
}; 