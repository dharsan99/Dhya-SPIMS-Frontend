// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useThemeStore } from './hooks/useThemeStore';

import AOS from 'aos';
import 'aos/dist/aos.css';

// ✅ Create Query Client
const queryClient = new QueryClient();

// ✅ Set light mode before React renders
(() => {
  const root = document.documentElement;
  root.classList.remove('dark');
  root.classList.add('light');
  localStorage.setItem('theme', 'light');
})();

// ✅ Initialize AOS (Animate on Scroll)
AOS.init({
  duration: 800,
  once: true,
  easing: 'ease-out-cubic',
  offset: 100,
});

// ✅ ReactDOM Hydration
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);