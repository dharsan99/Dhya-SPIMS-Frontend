// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useThemeStore } from './hooks/useThemeStore';

import AOS from 'aos';
import 'aos/dist/aos.css';
import TenantContextProvider from './context/TenantContextProvider';

// ✅ Create Query Client
const queryClient = new QueryClient();

// ✅ Apply the saved theme IMMEDIATELY before React renders
(() => {
  useThemeStore.getState();
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
    <TenantContextProvider>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
    </TenantContextProvider>
  </React.StrictMode>
);