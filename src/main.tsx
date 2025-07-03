// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Toaster } from 'sonner';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useThemeStore } from './hooks/useThemeStore';
import TenantContextProvider from './context/TenantContextProvider';

// ✅ import your ErrorBoundary
import AOS from 'aos';
import 'aos/dist/aos.css';
import ErrorBoundary from './components/generic/ErrorBoundry';

// ✅ Create Query Client
const queryClient = new QueryClient();

// ✅ Apply the saved theme IMMEDIATELY before React renders
(() => {
  useThemeStore.getState();
})();

// ✅ Initialize AOS
AOS.init({
  duration: 800,
  once: true,
  easing: 'ease-out-cubic',
  offset: 100,
});

// ✅ ReactDOM Hydration
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <TenantContextProvider>
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster richColors position="top-center" />
        </QueryClientProvider>
      </TenantContextProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
