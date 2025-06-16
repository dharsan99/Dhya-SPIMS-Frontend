import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../hooks/auth';
import Sidebar from './Sidebar';
import { FiChevronDown, FiLogOut } from 'react-icons/fi';
import { useState } from 'react';
import logoNsc from '../assets/logo_nsc.jpg';
import { WhatsNewPanel } from '../components/WhatsNewPanel';

const getPageTitle = (pathname: string) => {
  if (pathname.includes('/dashboard')) return 'Dashboard';
  if (pathname.includes('/orders')) return 'Orders';
  if (pathname.includes('/production')) return 'Production';
  if (pathname.includes('/fibers')) return 'Fibres';
  if (pathname.includes('/shades')) return 'Shades';
  if (pathname.includes('/employees')) return 'Employees';
  if (pathname.includes('/marketing')) return 'Marketing';
  if (pathname.includes('/settings')) return 'Settings';
  return '';
};

const DashboardLayout = () => {
  const { user, hasHydrated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [showWhatsNew, setShowWhatsNew] = useState(false);

  const handleLogout = () => {
    if (logout) logout();
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Accessibility: Skip to content
  const skipToContent = () => {
    const main = document.getElementById('main-content');
    if (main) main.focus();
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
        {/* Accessibility: Skip to content */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only absolute top-2 left-2 z-50 bg-blue-600 text-white px-3 py-1 rounded"
          tabIndex={0}
          onClick={skipToContent}
        >
          Skip to main content
        </a>
        {/* Header */}
        <header
          className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b dark:border-gray-800 px-4 md:px-6 py-3 flex items-center justify-between shadow-md h-20"
          role="banner"
        >
          {/* Left: Logo & Page Title */}
          <div className="flex items-center gap-6 min-w-0">
            <img src={logoNsc} alt="SPIMS Logo" className="w-32 h-14 object-contain" />
            <span className="mx-2 text-gray-300 dark:text-gray-700 hidden sm:inline text-2xl">|</span>
            <span className="font-extrabold text-blue-700 dark:text-blue-300 text-xl tracking-wide truncate max-w-xs flex items-center" title={getPageTitle(location.pathname)}>
              {getPageTitle(location.pathname)}
            </span>
          </div>
          {/* Right: User Info & Actions */}
          <div className="flex items-center gap-4">
            {/* User Avatar & Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-2 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow shadow-sm hover:shadow-md"
                onClick={() => setProfileOpen((v) => !v)}
                aria-label="Open user menu"
                tabIndex={0}
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg border-2 border-blue-300 shadow-sm">
                  {user.name?.split(' ').map((n) => n[0]).join('').toUpperCase()}
                </div>
                <span className="hidden md:inline font-semibold text-gray-800 dark:text-gray-200 max-w-[120px] truncate text-base">{user.name}</span>
                <FiChevronDown className="w-5 h-5 text-gray-500" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded shadow-lg py-2 z-50 border dark:border-gray-700 animate-fade-in">
                  <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">Signed in as<br /><span className="font-semibold text-gray-800 dark:text-white">{user.email}</span></div>
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  <button className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 transition-colors" onClick={handleLogout}><FiLogOut /> Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>
        {/* Main Content Scrollable */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 md:p-6 text-gray-800 dark:text-gray-100 transition-all outline-none focus:outline-blue-400"
          tabIndex={-1}
          role="main"
        >
          <Outlet />
        </main>
        {/* Global Footer with What's New button */}
        <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-3 px-6 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between shadow-inner sticky bottom-0 z-30">
          <span>© {new Date().getFullYear()} NSC Texintelli. All rights reserved.</span>
          <span>v1.0.0</span>
          <button
            className="ml-4 px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition"
            onClick={() => setShowWhatsNew(true)}
            aria-label="Show What's New panel"
          >
            What's New
          </button>
        </footer>
        {/* Floating What's New Panel */}
        {showWhatsNew && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="max-w-md w-full mx-auto">
              <WhatsNewPanel onClose={() => setShowWhatsNew(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;