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
import SubscriptionPlanPage from './pages/SubscriptionPlanPage';
//import SetupWizard from './components/setup/SetupWizard';

// Super Admin Pages
import SuperAdminDashboard from './pages/superadmin/Dashboard';
import Tenants from './pages/superadmin/Tenants';
import Plans from './pages/superadmin/Plans';
import Billing from './pages/superadmin/Billing';
import ParsingUsage from './pages/superadmin/ParsingUsage';
import SuperAdminSettings from './pages/superadmin/Settings';
import VerifyEmailPage from './pages/VerifyEmail';
import AcceptInvitePage from './pages/AcceptInvite';
import SuperAdminVerifyEmail from './pages/superadmin/VerifyAdminEmail';
import TenantUsers from './pages/superadmin/TenantUsers';
import AdminAcceptInvitePage from './pages/AdminAcceptInvite';

import AIInsightsProvider from './context/AIInsightsContext';
// Growth Engine imports
import GrowthEngineDashboard from './pages/GrowthEngine';
import CompanyPersona from './pages/GrowthEngine/CompanyPersona';
import BrandDiscovery from './pages/GrowthEngine/BrandDiscovery';
import PerformanceAnalytics from './pages/GrowthEngine/PerformanceAnalytics';
import TaskManagement from './pages/GrowthEngine/TaskManagement';
import CampaignCenter from './pages/CampaignCenter';
import FeaturesPage from './pages/website/FeaturesPage';

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
            <Route path='features' element={<FeaturesPage />} />
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
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/accept-invite" element={<AcceptInvitePage />} />
          <Route path="/select-plan" element={<SubscriptionPlanPage />} />
          <Route path="/superadmin/accept-invite" element={<AdminAcceptInvitePage />} />

          {/* Protected Dashboard */}
          <Route path="/app" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AIInsightsProvider><Dashboard /></AIInsightsProvider>} />
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
            <Route path="marketing" element={<Marketing />} />
            <Route path="campaigns" element={<CampaignCenter />} />
            {/* Growth Engine Routes */}
            <Route path="growth">
              <Route index element={<GrowthEngineDashboard />} />
              <Route path="persona" element={<CompanyPersona />} />
              <Route path="brand-discovery" element={<BrandDiscovery />} />
              <Route path="analytics" element={<PerformanceAnalytics />} />
              <Route path="tasks" element={<TaskManagement />} />
            </Route>
            {/*<Route path="setup-wizard" element={<SetupWizard />} />*/}
            <Route path="*" element={<DelayedNotFound />} />
          </Route>

          {/* Protected Super Admin */}
          <Route path="/superadmin" element={<ProtectedRoute><SuperAdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="tenants" element={<Tenants />} />
            <Route path="tenant-users" element={<TenantUsers />} />
            <Route path="plans" element={<Plans />} />
            <Route path="billing" element={<Billing />} />
            <Route path="parsing-usage" element={<ParsingUsage />} />
            <Route path="/superadmin/settings" element={<SuperAdminSettings />} />
            <Route path="verify-email" element={<SuperAdminVerifyEmail />} />
          </Route>
          
          {/* Catch-all - moved to end */}
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