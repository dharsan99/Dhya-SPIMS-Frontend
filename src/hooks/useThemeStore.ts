import { create } from 'zustand';
import toast from 'react-hot-toast';

export type Theme = 'light' | 'dark' | 'auto';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'auto',

  setTheme: (theme) => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(theme);
    }

    localStorage.setItem('theme', theme);
    set({ theme });

    toast.success(`Switched to ${theme === 'auto' ? 'Auto' : theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`, {
      style: {
        borderRadius: '8px',
        background: '#333',
        color: '#fff',
      },
    });
  },
}));

// 🔥 On App Start (Apply stored theme)
const storedTheme = localStorage.getItem('theme') as Theme;
if (storedTheme) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');

  if (storedTheme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.add(prefersDark ? 'dark' : 'light');
  } else {
    root.classList.add(storedTheme);
  }
}