import { Outlet, useNavigate } from 'react-router-dom';
import useAuthStore from '../hooks/auth';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const { user, hasHydrated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // ⏳ Avoid flicker/error during hydration
  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 transition-colors">
        Loading...
      </div>
    );
  }

  // 🔐 Extra guard (double protection)
  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300 overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* Right Side */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b dark:border-gray-800 px-6 py-4 flex items-center justify-between shadow-sm">
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