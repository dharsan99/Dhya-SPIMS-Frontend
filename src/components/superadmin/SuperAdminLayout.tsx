import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FiChevronDown, FiLogOut, FiMenu } from 'react-icons/fi';
import { useState } from 'react';
import useAuthStore from '../../hooks/auth';
import SuperAdminSidebar from './SuperAdminSidebar';

const getPageTitle = (pathname: string) => {
  if (pathname.includes('/superadmin/dashboard')) return 'Super Admin Dashboard';
  if (pathname.includes('/superadmin/tenants')) return 'Tenants Management';
  if (pathname.includes('/superadmin/tenant-users')) return 'Tenant Users Management';
  if (pathname.includes('/superadmin/plans')) return 'Subscription Plans Management';
  if (pathname.includes('/superadmin/billing')) return 'Billing & Revenue Management';
  if (pathname.includes('/superadmin/settings')) return 'Settings';
  return 'Super Admin';
};

const SuperAdminLayout = () => {
  const { user, hasHydrated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
    
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
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed md:static inset-y-0 left-0 z-40 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}
        style={{ width: 'auto' }}
      >
        <SuperAdminSidebar onLinkClick={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
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
          className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b dark:border-gray-800 px-4 md:px-6 py-5 flex items-center justify-between shadow-md h-28"
          role="banner"
        >
          {/* Left: Menu Button & Page Title */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <FiMenu className="w-6 h-6" />
            </button>
            
          </div>

          <div className='flex flex-col md:flex-row justify-center items-center md:justify-between gap-2 md:gap-0 w-full'>

          <div className="flex items-center gap-6 min-w-0">
              <span className="font-extrabold text-red-700 dark:text-red-300 text-xl tracking-wide truncate max-w-xs flex items-center" title={getPageTitle(location.pathname)}>
                {getPageTitle(location.pathname)}
              </span>
            </div>
          {/* Right: User Info & Actions */}
          <div className="flex items-center gap-4">
            {/* User Avatar & Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-2 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition-shadow shadow-sm hover:shadow-md"
                onClick={() => setProfileOpen((v) => !v)}
                aria-label="Open user menu"
                tabIndex={0}
              >
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-lg border-2 border-red-300 shadow-sm">
                  {user.name?.split(' ').map((n) => n[0]).join('').toUpperCase()}
                </div>
                <span className="hidden md:inline font-semibold text-gray-800 dark:text-gray-200 max-w-[120px] truncate text-base">{user.name}</span>
                <FiChevronDown className="w-5 h-5 text-gray-500" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded shadow-lg py-2 z-50 border dark:border-gray-700 animate-fade-in">
                  <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">Super Admin<br /><span className="font-semibold text-gray-800 dark:text-white">{user.email}</span></div>
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  <button className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 transition-colors" onClick={handleLogout}><FiLogOut /> Logout</button>
                </div>
              )}
            </div>
          </div>
          </div>
        </header>

        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 md:p-6 text-gray-800 dark:text-gray-100 transition-all outline-none focus:outline-red-400"
          tabIndex={-1}
          role="main"
        >
          <Outlet />
        </main>

        {/* Global Footer */}
        <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-3 px-6 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between shadow-inner sticky bottom-0 z-30">
          <span>© {new Date().getFullYear()} NSC Texintelli. Super Admin Panel.</span>
          <span>v1.0.0</span>
        </footer>
      </div>
    </div>
  );
};

export default SuperAdminLayout; 