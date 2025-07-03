import { create } from 'zustand';
import toast from 'react-hot-toast';

export type Theme = 'light';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme, showToast?: boolean) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'light',

  setTheme: (_theme, showToast = false) => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    localStorage.setItem('theme', 'light');
    set({ theme: 'light' });

    if (showToast) {
      toast.success('Light Theme', {
        style: {
          borderRadius: '8px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  },
}));

// Initialize theme on store creation without showing toast
document.documentElement.classList.add('light');
localStorage.setItem('theme', 'light');