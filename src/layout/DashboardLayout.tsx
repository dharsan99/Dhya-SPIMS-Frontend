import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FiChevronDown, FiLogOut, FiMenu } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  CogIcon,
  BellIcon,
  ArrowPathIcon,
  ArrowUpIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { WhatsNewPanel } from '../components/WhatsNewPanel';
import useAuthStore from '../hooks/auth';
import { useSidebarState } from '../hooks/useSidebarState';
import { useDynamicLogo } from '../hooks/useDynamicLogo';
import Sidebar from './Sidebar';
import logo from '../assets/dhya_texintelli.png';

const getPageTitle = (pathname: string) => {
  if (pathname.includes('/dashboard')) return 'Dashboard';
  if (pathname.includes('/orders')) return 'Orders';
  if (pathname.includes('/production')) return 'Production';
  if (pathname.includes('/fibers')) return 'Fibres';
  if (pathname.includes('/shades')) return 'Shades';
  if (pathname.includes('/employees')) return 'Employees';
  if (pathname.includes('/marketing')) return 'Marketing';
  if (pathname.includes('/settings')) return 'Settings';
  if (pathname.includes('/growth')) return 'Growth Engine';
  if (pathname.includes('/buyers')) return 'Buyers';
  if (pathname.includes('/attendance')) return 'Attendance';
  if (pathname.includes('/suppliers')) return 'Suppliers';
  if (pathname.includes('/stocks')) return 'Stocks';
  return 'SPIMS';
};

const getPageDescription = (pathname: string) => {
  if (pathname.includes('/dashboard')) return 'Real-time overview of your spinning mill operations';
  if (pathname.includes('/orders')) return 'Manage customer orders and track production status';
  if (pathname.includes('/production')) return 'Monitor production workflows and efficiency metrics';
  if (pathname.includes('/fibers')) return 'Track inventory and manage fiber procurement';
  if (pathname.includes('/shades')) return 'Configure color specifications and blending formulas';
  if (pathname.includes('/employees')) return 'Workforce management and attendance tracking';
  if (pathname.includes('/marketing')) return 'Customer outreach and campaign management';
  if (pathname.includes('/settings')) return 'System configuration and user preferences';
  if (pathname.includes('/growth')) return 'AI-powered growth and customer acquisition';
  if (pathname.includes('/buyers')) return 'Customer relationship and order management';
  if (pathname.includes('/attendance')) return 'Employee attendance and time tracking';
  if (pathname.includes('/suppliers')) return 'Supplier management and procurement';
  if (pathname.includes('/stocks')) return 'Inventory and stock management';
  return 'Smart Production & Inventory Management System';
};

const DashboardLayout = () => {
  const { user, hasHydrated, logout } = useAuthStore();
  const { tenantName } = useDynamicLogo();
  const { collapsed, mobileOpen, setMobileOpen, closeMobile } = useSidebarState();
  
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [showWhatsNew, setShowWhatsNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showFooterInfo, setShowFooterInfo] = useState(false);
  const lastScrollY = useRef(0);
  const headerRef = useRef<HTMLElement>(null);
    
  const handleLogout = () => {
    if (logout) logout();
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Implement global search logic here
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh - in real implementation, this would refresh current page data
    setTimeout(() => {
      setIsRefreshing(false);
      // Could show toast notification here
    }, 1000);
  };



  // Scroll handling for enhanced header behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Detect if scrolled past threshold
      setIsScrolled(currentScrollY > 10);
      
      // Show scroll-to-top button when scrolled down
      setShowScrollTop(currentScrollY > 300);
      
      // Auto-hide header on scroll down, show on scroll up (with debounce)
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsHeaderVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };



  // Accessibility: Skip to content
  const skipToContent = () => {
    const main = document.getElementById('main-content');
    if (main) main.focus();
  };

  if (!hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 transition-colors">
        <div className="animate-pulse space-y-4 w-full max-w-md">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  const pageTitle = getPageTitle(location.pathname);
  const pageDescription = getPageDescription(location.pathname);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Fixed Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}
        style={{ width: 'auto' }}
      >
        <Sidebar onLinkClick={closeMobile} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative md:ml-2 md:transition-all md:duration-300 z-20">
        {/* Accessibility: Skip to content */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only absolute top-2 left-2 z-50 bg-blue-600 text-white px-3 py-1 rounded"
          tabIndex={0}
          onClick={skipToContent}
        >
          Skip to main content
        </a>

        {/* Fixed Header */}
        <header
          ref={headerRef}
          className={`fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b dark:border-gray-800 transition-all duration-300 ease-in-out ${
            isHeaderVisible 
              ? 'translate-y-0 shadow-md' 
              : '-translate-y-full shadow-none'
          } ${
            isScrolled 
              ? 'backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-gray-200 dark:border-gray-700' 
              : 'bg-white dark:bg-gray-900'
          } md:ml-20 md:transition-all md:duration-300 ${
            collapsed ? 'md:ml-20' : 'md:ml-72'
          }`}
          role="banner"
        >
          {/* Top Header Row */}
          <div className="px-3 sm:px-4 md:px-6 py-3 flex items-center justify-between h-16 sm:h-20">
            {/* Left: Menu Button & Branding */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                className="md:hidden p-1.5 sm:p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <FiMenu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              
              <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 min-w-0">
                <img
                  src={logo}
                  alt="Dhya Texintelli Logo"
                  className="w-20 h-8 sm:w-24 sm:h-10 md:w-32 md:h-14 object-contain"
                />
                
                <span className="mx-1 sm:mx-2 text-gray-300 dark:text-gray-700 hidden sm:inline text-xl sm:text-2xl">|</span>
                
                <div className="hidden md:flex flex-col">
                  <h1 className="font-extrabold text-blue-700 dark:text-blue-300 text-lg sm:text-xl tracking-wide truncate max-w-xs">
                    {pageTitle}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate max-w-sm">
                    {pageDescription}
                    {tenantName && ` • ${tenantName}`}
                  </p>
                </div>
                <span className="md:hidden font-extrabold text-blue-700 dark:text-blue-300 text-base sm:text-lg tracking-wide truncate max-w-[120px] sm:max-w-xs">
                  {pageTitle}
                </span>
              </div>
            </div>

            {/* Right: Actions & User Profile */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
              {/* Global Search - Hidden on mobile, shown on medium+ */}
              <div className="hidden md:flex relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-48 lg:w-64 pl-8 pr-4 py-1.5 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
                />
                <MagnifyingGlassIcon className="absolute left-2.5 sm:left-3 top-1.5 sm:top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 sm:right-3 top-1.5 sm:top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Refresh Button - Hidden on small mobile */}
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="hidden sm:block p-1.5 sm:p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                  title="Refresh data"
                >
                  <ArrowPathIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>

                {/* Notifications - Hidden on small mobile */}
                <button className="hidden sm:block p-1.5 sm:p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative">
                  <BellIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></span>
                </button>

                {/* Settings - Hidden on small mobile */}
                <button 
                  onClick={() => navigate('/app/settings')}
                  className="hidden sm:block p-1.5 sm:p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Settings"
                >
                  <CogIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* User Avatar & Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center gap-1 sm:gap-2 px-1.5 sm:px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all shadow-sm hover:shadow-md"
                  onClick={() => setProfileOpen((v) => !v)}
                  aria-label="Open user menu"
                  tabIndex={0}
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm sm:text-lg border-2 border-blue-300 shadow-sm">
                    {user.name?.split(' ').map((n) => n[0]).join('').toUpperCase()}
                  </div>
                  <span className="hidden lg:inline font-semibold text-gray-800 dark:text-gray-200 max-w-[100px] xl:max-w-[120px] truncate text-sm sm:text-base">{user.name}</span>
                  <FiChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-60 border dark:border-gray-700 animate-fade-in">
                    <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                      Signed in as<br />
                      <span className="font-semibold text-gray-800 dark:text-white">{user.email}</span>
                    </div>
                    <hr className="my-1 border-gray-200 dark:border-gray-700" />
                    <button 
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 transition-colors" 
                      onClick={handleLogout}
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden px-3 sm:px-4 pb-2 sm:pb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search across all modules..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-8 sm:pl-10 pr-4 py-1.5 sm:py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
              />
              <MagnifyingGlassIcon className="absolute left-2.5 sm:left-3 top-1.5 sm:top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 sm:right-3 top-1.5 sm:top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Header spacer to prevent content overlap */}
        <div 
          className={`h-16 sm:h-20 md:h-20 ${
            collapsed ? 'md:ml-20' : 'md:ml-72'
          } md:transition-all md:duration-300`}
        ></div>

        {/* Scrollable Main Content */}
        <main
          id="main-content"
          className={`flex-1 overflow-y-auto py-4 md:py-6 text-gray-800 dark:text-gray-100 transition-all outline-none focus:outline-blue-400 md:transition-all md:duration-300 relative z-20 ${
            collapsed ? 'md:ml-20' : 'md:ml-72'
          }`}
          tabIndex={-1}
          role="main"
        >
          <div className="px-3 sm:px-4 md:px-6">
            <Outlet />
          </div>
        </main>

        {/* Fixed Footer */}
        <footer 
          className={`w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-inner relative z-20 ${
            collapsed ? 'md:ml-10' : 'md:ml-72'
          } md:transition-all md:duration-300`}
        >
          {/* Main Footer Content */}
          <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5">
            {/* Mobile Layout - Stacked */}
            <div className="block sm:hidden space-y-3">
              {/* Mobile: Brand & Company */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">
                    {tenantName || "Texintelli"}
                  </span>
                </div>
                <button
                  onClick={() => setShowWhatsNew(true)}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 rounded text-xs font-medium transition-colors"
                  aria-label="What's New"
                >
                  What's New
                </button>
              </div>
              
              {/* Mobile: Copyright & Version */}
              <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400">
                <span>© Texintelli {new Date().getFullYear()} All rights reserved</span>
                <span>v1.0.0</span>
              </div>
              
              {/* Mobile: Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">System Online</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>

            {/* Desktop Layout - Three Columns */}
            <div className="hidden sm:flex items-start md:items-center justify-between gap-4 lg:gap-6">
              {/* Left: Brand & Copyright */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 lg:gap-6 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">
                    {tenantName || "Texintelli"}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-2 lg:gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span className="whitespace-nowrap">© Texintelli {new Date().getFullYear()} All rights reserved</span>
                  <span className="hidden md:inline text-gray-400">•</span>
                  <span className="whitespace-nowrap">v1.0.0</span>
                </div>
              </div>

              {/* Center: Quick Actions */}
              <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
                <button
                  onClick={() => setShowFooterInfo(!showFooterInfo)}
                  className="px-2 lg:px-3 py-1.5 lg:py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 text-xs font-medium whitespace-nowrap"
                  aria-label="System Information"
                >
                  System Info
                </button>
                <button
                  onClick={() => setShowWhatsNew(true)}
                  className="px-2 lg:px-3 py-1.5 lg:py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-lg transition-all duration-200 text-xs font-medium whitespace-nowrap"
                  aria-label="What's New"
                >
                  What's New
                </button>
              </div>

              {/* Right: Status & Time */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-2 lg:gap-4 text-xs text-gray-500 dark:text-gray-400 min-w-0 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                  <span className="whitespace-nowrap">System Online</span>
                </div>
                <span className="hidden lg:inline text-gray-400">•</span>
                <span className="whitespace-nowrap">Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Footer Info Panel */}
          {showFooterInfo && (
            <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 sm:px-4 md:px-6 py-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">System Information</h3>
                <button
                  onClick={() => setShowFooterInfo(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Close system information"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400 truncate">Security: Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <DocumentTextIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400 truncate">Version: 1.0.0</span>
                </div>
                <div className="flex items-center gap-2">
                  <QuestionMarkCircleIcon className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400 truncate">Support: Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <InformationCircleIcon className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400 truncate">Uptime: 99.9%</span>
                </div>
              </div>
            </div>
          )}
        </footer>

        {/* Floating What's New Panel */}
        {showWhatsNew && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="max-w-md w-full mx-auto">
              <WhatsNewPanel onClose={() => setShowWhatsNew(false)} />
            </div>
          </div>
        )}

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Scroll to top"
            title="Scroll to top"
          >
            <ArrowUpIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;