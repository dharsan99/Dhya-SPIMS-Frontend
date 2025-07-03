// utils/toastUtils.ts
import { toast } from 'react-hot-toast';

export const showSuccess = (message: string) => {
  toast.success(message, {
    style: {
      background: '#2d3748',
      color: '#fff',
    },
    iconTheme: {
      primary: '#38a169',
      secondary: '#fff',
    },
  });
};

export const showError = (message: string) => {
  toast.error(message, {
    style: {
      background: '#2d3748',
      color: '#fff',
    },
    iconTheme: {
      primary: '#e53e3e',
      secondary: '#fff',
    },
  });
};

export const showLoading = (message: string) => toast.loading(message);
export const dismissToast = (toastId: string) => toast.dismiss(toastId);
