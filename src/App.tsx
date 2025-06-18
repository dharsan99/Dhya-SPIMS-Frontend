import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './hooks/useThemeStore'; // ✅

import DashboardLayout from './layout/DashboardLayout';
import SuperAdminLayout from './components/superadmin/SuperAdminLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import WebsiteHeader from './components/website/WebsiteHeader';
import WebsiteFooter from './components/website/WebsiteFooter';
import CookieConsentBanner from './components/CookieConsentBanner'; // ✅

import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import ProductionDashboard from './pages/ProductionDashboard';
import Blends from './pages/Blends';
import Brands from './pages/Brands';
import Shades from './pages/Shades';
import Suppliers from './pages/Suppliers';
import Yarns from './pages/Yarns';
import YarnMapping from './pages/YarnMapping';
import Fibers from './pages/Fibers';
import Settings from './pages/Settings';
import NotFoundPage from './pages/NotFoundPage';

import LandingPage from './pages/website/LandingPage';
import AboutPage from './pages/website/AboutPage';
import ContactPage from './pages/website/ContactPage';
import DocumentationPage from './pages/website/DocumentationPage';
import TermsPage from './pages/website/TermsPage';
import PrivacyPolicyPage from './pages/website/PrivacyPolicyPage';
import RefundPolicyPage from './pages/website/RefundPolicyPage';
import DisclaimerPage from './pages/website/DisclaimerPage';
import Employees from './pages/Employees';
import Marketing from './pages/Marketing';
import ProductionEntryPage from './pages/ProductionEntryPage';
import SignupPage from './pages/Signup';

// Super Admin Pages
import SuperAdminDashboard from './pages/superadmin/Dashboard';
import Tenants from './pages/superadmin/Tenants';

function App() {
  const { setTheme } = useThemeStore();

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto' | null;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, [setTheme]); // ✅ NOT on theme change, only once

  return (
    <>
      <Toaster position="top-center" />

      <BrowserRouter>
        <Routes>
          {/* Website Layout */}
          <Route path="/" element={<WebsiteLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="docs" element={<DocumentationPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="refund-policy" element={<RefundPolicyPage />} />
            <Route path="disclaimer" element={<DisclaimerPage />} />
          </Route>

          {/* Login */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Dashboard */}
          <Route path="/app" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="production">
              <Route index element={<ProductionDashboard />} />
              <Route path="new" element={<ProductionEntryPage />} />
              <Route path=":date" element={<ProductionEntryPage />} />
            </Route>
            <Route path="brands" element={<Brands />} />
            <Route path="blends" element={<Blends />} />
            <Route path="shades" element={<Shades />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="yarns" element={<Yarns />} />
            <Route path="yarn-mapping" element={<YarnMapping />} />
            <Route path="fibers" element={<Fibers />} />
            <Route path="settings" element={<Settings />} />
            <Route path="employees" element={<Employees />} />
            <Route path="*" element={<DelayedNotFound />} />
            <Route path="marketing" element={<Marketing />} /> {/* ✅ Added */}

          </Route>

          {/* Protected Super Admin */}
          <Route path="/superadmin" element={<ProtectedRoute><SuperAdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="tenants" element={<Tenants />} />
          </Route>
          

          {/* Catch-all */}
          <Route path="*" element={<DelayedNotFound />} />
        </Routes>

        {/* 🍪 Cookie Consent Banner */}
        <CookieConsentBanner />
      </BrowserRouter>
    </>
  );
}

const WebsiteLayout = () => (
  <>
    <WebsiteHeader />
    <Outlet />
    <WebsiteFooter />
  </>
);

const DelayedNotFound = () => {
  const [show404, setShow404] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow404(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!show404) return null;
  return <NotFoundPage />;
};

export default App;