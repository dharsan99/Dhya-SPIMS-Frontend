import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import ProductionDashboard from './pages/ProductionDashboard';
import Blends from './pages/Blends';
import Brands from './pages/Brands';
import Shades from './pages/Shades';
import Suppliers from './pages/Suppliers';
import Yarns from './pages/Yarns';
import YarnMapping from './pages/YarnMapping';

import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';
import DashboardLayout from './layout/DashboardLayout';


import Fibers from './pages/Fibers';

function App() {
  return (
    <>

    <Toaster position="top-right" />
  
    <BrowserRouter>
      <Routes>
        {/* ✅ Public Route: Redirect if logged in */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* ✅ Protected Layout Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard & Pages */}
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="production" element={<ProductionDashboard />} />
          {/* Master Data Pages */}
          <Route path="brands" element={<Brands />} />
          <Route path="blends" element={<Blends />} />
          <Route path="shades" element={<Shades />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="yarns" element={<Yarns />} />
          <Route path="yarn-mapping" element={<YarnMapping />} />
          <Route path="fibers" element={<Fibers />} />
        </Route>

        {/* ✅ Catch-all */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
    </>

  );
}

export default App;