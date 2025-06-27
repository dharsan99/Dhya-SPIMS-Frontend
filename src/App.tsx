import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './hooks/auth';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import WebsiteLayout from './layout/WebsiteLayout';

// Lazy load components
const LandingPage = lazy(() => import('./pages/website/LandingPage'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Lazy load other pages
const Orders = lazy(() => import('./pages/Orders'));
const Production = lazy(() => import('./pages/Production'));
const ProductionDashboard = lazy(() => import('./pages/ProductionDashboard'));
const Fibers = lazy(() => import('./pages/Fibers'));
const Yarns = lazy(() => import('./pages/Yarns'));
const Blends = lazy(() => import('./pages/Blends'));
const Brands = lazy(() => import('./pages/Brands'));
const Shades = lazy(() => import('./pages/Shades'));
const Suppliers = lazy(() => import('./pages/Suppliers'));
const Employees = lazy(() => import('./pages/Employees'));
const Marketing = lazy(() => import('./pages/Marketing'));
const Settings = lazy(() => import('./pages/Settings'));
const YarnMapping = lazy(() => import('./pages/YarnMapping'));

// Website pages
const AboutPage = lazy(() => import('./pages/website/AboutPage'));
const ContactPage = lazy(() => import('./pages/website/ContactPage'));
const DisclaimerPage = lazy(() => import('./pages/website/DisclaimerPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/website/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/website/TermsPage'));
const FeaturesPage = lazy(() => import('./pages/website/FeaturesPage'));
const ProductsPage = lazy(() => import('./pages/website/ProductsPage'));
const ServicesPage = lazy(() => import('./pages/website/ServicesPage'));
const RefundPolicyPage = lazy(() => import('./pages/website/RefundPolicyPage'));
const DocumentationPage = lazy(() => import('./pages/website/DocumentationPage'));

// Simple loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  const { hasHydrated } = useAuthStore();
  if (!hasHydrated) return <LoadingSpinner />;
  return (
    <Router>
      <div className="App">
        {/* Toast notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#111827',
            },
          }}
        />

        {/* Main app content */}
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* All pages with header/footer */}
            <Route element={<WebsiteLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/refund-policy" element={<RefundPolicyPage />} />
              <Route path="/docs" element={<DocumentationPage />} />
              {/* Protected routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/production" element={<ProtectedRoute><Production /></ProtectedRoute>} />
              <Route path="/production-dashboard" element={<ProtectedRoute><ProductionDashboard /></ProtectedRoute>} />
              <Route path="/fibers" element={<ProtectedRoute><Fibers /></ProtectedRoute>} />
              <Route path="/yarns" element={<ProtectedRoute><Yarns /></ProtectedRoute>} />
              <Route path="/blends" element={<ProtectedRoute><Blends /></ProtectedRoute>} />
              <Route path="/brands" element={<ProtectedRoute><Brands /></ProtectedRoute>} />
              <Route path="/shades" element={<ProtectedRoute><Shades /></ProtectedRoute>} />
              <Route path="/suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
              <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
              <Route path="/marketing" element={<ProtectedRoute><Marketing /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/yarn-mapping" element={<ProtectedRoute><YarnMapping /></ProtectedRoute>} />
            </Route>
            {/* Login page without header/footer */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            {/* Catch all route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;