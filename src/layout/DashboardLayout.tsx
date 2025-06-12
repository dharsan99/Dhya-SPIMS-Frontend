import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuthStore from '../hooks/auth';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const DashboardLayout = () => {
  const { user, hasHydrated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 transition-colors">
        Loading...
      </div>
    );
  }

  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300 overflow-hidden relative">

      {/* Desktop Sidebar (fixed width) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } bg-black/30 `}
        onClick={() => setSidebarOpen(false)}
      >
        <div
          className={`absolute top-0 left-0 h-full w-64 transform bg-white dark:bg-gray-900 shadow-md transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <Sidebar onLinkClick={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Right Side (main content) */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">

        {/* Header */}
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b dark:border-gray-800 px-4 py-3 flex items-center justify-between shadow-sm">

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 dark:text-gray-300"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <span className="text-sm text-gray-700 dark:text-gray-300">
            Logged in as <strong>{user.name}</strong>
          </span>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold text-xs px-4 py-2 rounded-full transition-all"
          >
            Logout
          </button>
        </header>

        {/* Main Content Scrollable */}
        <main className="flex-1 overflow-y-auto p-6 text-gray-800 dark:text-gray-100 transition-all">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;