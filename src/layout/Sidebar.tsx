import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { FiGrid, FiPackage, FiActivity, FiShoppingBag, FiTrendingUp, FiMail, FiFileText, FiUser, FiBarChart, FiLayers, FiMapPin, FiBox, FiTruck, FiUsers, FiSettings, FiSearch, FiMoreHorizontal, FiChevronLeft, FiChevronRight, FiLogOut, FiHelpCircle } from 'react-icons/fi';
import useAuthStore from '../hooks/auth';
import { useSidebarState } from '../hooks/useSidebarState';
import logo from '../assets/dhya_texintelli.png';

interface NavItem {
  to: string;
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: string;
  description?: string;
  permission?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
  permission?: string;
}

const Sidebar = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const auth = useAuthStore();
  //const email = auth.user?.email || '';
  const { collapsed, toggleCollapsed } = useSidebarState();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMorePopup, setShowMorePopup] = useState(false);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [visibleItems, setVisibleItems] = useState<NavItem[]>([]);
  const [hiddenItems, setHiddenItems] = useState<NavItem[]>([]);

  const location = useLocation();

  // const hasPermission = useAuthStore((state: any) => state.hasPermission);


  // Navigation sections with improved structure
  const navSections: NavSection[] = [
    {
      title: 'Overview',
      items: [
        { to: '/app/dashboard', label: 'Dashboard', Icon: FiGrid, description: 'System overview and KPIs' },
      ]
    },
    {
      title: 'Core Operations',
      items: [
        { to: '/app/orders', label: 'Orders', Icon: FiPackage, description: 'Manage customer orders', permission: 'Orders' },
        { to: '/app/production', label: 'Production', Icon: FiActivity, description: 'Production workflows', permission: 'Production' },
        { to: '/app/buyers', label: 'Buyers', Icon: FiShoppingBag, description: 'Customer management', permission: 'Buyers' },
      ]
    },
    {
      title: 'Growth Engine',
      items: [
        { to: '/app/growth', label: 'Growth Engine', Icon: FiTrendingUp, description: 'AI-powered growth', permission: 'Growth Engine' },
        { to: '/app/growth/brand-discovery', label: 'Campaign Management', Icon: FiMail, description: 'Email campaigns', permission: 'Growth Engine' },
        { to: '/app/growth/tasks', label: 'Task Management', Icon: FiFileText, description: 'Task tracking', permission: 'Growth Engine' },
        { to: '/app/growth/persona', label: 'Company Persona', Icon: FiUser, description: 'Target personas', permission: 'Growth Engine' },
        { to: '/app/growth/analytics', label: 'Performance Analytics', Icon: FiBarChart, description: 'Growth metrics', permission: 'Growth Engine' },
      ],
      permission: 'Growth Engine'
    },
    {
      title: 'Inventory & Materials',
      items: [
        { to: '/app/fibers', label: 'Fibres', Icon: FiLayers, description: 'Fiber inventory', permission: 'Fibres' },
        { to: '/app/shades', label: 'Shades', Icon: FiMapPin, description: 'Color management', permission: 'Shades' },
        { to: '/app/stocks', label: 'Stocks', Icon: FiBox, description: 'Stock management', permission: 'Stocks' },
        { to: '/app/suppliers', label: 'Suppliers', Icon: FiTruck, description: 'Supplier management', permission: 'Suppliers' },
      ]
    },
    {
      title: 'Human Resources',
      items: [
        { to: '/app/employees', label: 'Employees', Icon: FiUsers, description: 'Employee management', permission: 'Employees' },
      ]
    },
    {
      title: 'Marketing & Sales',
      items: [
        { to: '/app/marketing', label: 'Email Campaigns', Icon: FiMail, description: 'Email marketing', permission: 'Marketing' },
        { to: '/app/campaigns', label: 'Campaign Center', Icon: FiTrendingUp, description: 'Campaign management', permission: 'Marketing' },
      ],
      permission: 'Marketing'
    },
    {
      title: 'Administration',
      items: [
        { to: '/app/settings', label: 'Settings', Icon: FiSettings, description: 'System configuration', permission: 'Settings' },
      ]
    }
  ];

  // Filter sections based on permissions
  const filteredSections = useMemo(() => navSections.filter(section => {
    console.log(section)
    // if (isOrderUser && section.title === 'Administration') return false;
    // if (section.permission && !hasPermission(section.permission, 'View')) return false;
    // return section.items.some(item => !item.permission || hasPermission(item.permission, 'View'));
    return true;
  }), [/*isOrderUser, hasPermission*/]);

  // Filter items within sections
  const processedSections = useMemo(() => filteredSections.map(section => ({
    ...section,
    items: section.items.filter(item => {
      console.log(item)
      // if (!item.permission) return true;
      // // Special case for Employees permission
      // if (item.permission === 'Employees') {
      //   return hasPermission('Employees', 'View Employee');
      // }
      // return hasPermission(item.permission, 'View');
      return true;
    })
  })), [filteredSections/*, hasPermission*/]);

  // Get all available navigation items
  const allNavItems = useMemo(() => processedSections.flatMap(section => section.items), [processedSections]);

  // Calculate visible items based on screen height
  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate how many items can fit in collapsed sidebar
  useEffect(() => {
    if (!collapsed) {
      setVisibleItems(allNavItems);
      setHiddenItems([]);
      return;
    }

    // Calculate available space for navigation items
    const headerHeight = 80; // Logo + collapse button
    const footerHeight = 80; // User profile
    const itemHeight = 48; // Each nav item height
    const padding = 32; // Top and bottom padding
    
    const availableHeight = screenHeight - headerHeight - footerHeight - padding;
    const maxVisibleItems = Math.floor(availableHeight / itemHeight);
    
    // Ensure at least 3 items are always visible
    const minVisibleItems = 3;
    const actualVisibleItems = Math.max(minVisibleItems, maxVisibleItems);
    
    setVisibleItems(allNavItems.slice(0, actualVisibleItems));
    setHiddenItems(allNavItems.slice(actualVisibleItems));
  }, [collapsed, screenHeight, allNavItems]);

  // Filter by search query
  const searchFilteredSections = useMemo(() => processedSections.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0), [processedSections, searchQuery]);

  const handleLogout = () => {
    if (auth.logout) auth.logout();
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Handle navigation with page refresh
  const handleNavigation = (path: string) => {
    onLinkClick?.();
    setShowMorePopup(false);
    
    // If navigating to the same route, force a refresh
    if (location.pathname === path) {
      window.location.reload();
    } else {
      // Navigate to new route
      window.location.href = path;
    }
  };

  const createNavLink = (item: NavItem) => (
    <button
      key={item.to}
      onClick={() => handleNavigation(item.to)}
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium relative overflow-hidden w-full text-left ${
        location.pathname === item.to
          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-700'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
      }`}
    >
      <item.Icon className="w-5 h-5 flex-shrink-0 transition-transform duration-200" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="truncate">{item.label}</span>
          {item.badge && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
              {item.badge}
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
            {item.description}
          </p>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </button>
  );

  return (
    <>
    <aside
        className={`h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-72'
        }`}
      aria-label="Sidebar Navigation"
    >
        {/* Fixed Header Section */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
          <div className="flex items-center gap-3 min-w-0">
          {!collapsed && (
            <img
              src={logo}
              alt="Dhya Texintelli Logo"
                className="h-8 w-auto object-contain transition-all duration-300"
            />
          )}
        </div>
        <button
            onClick={toggleCollapsed}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
            {collapsed ? (
              <FiChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <FiChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
        </button>
        </div>

        {/* Fixed Search Bar */}
        {!collapsed && (
          <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
        )}

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto">
          {collapsed ? (
            // Collapsed Navigation - Limited visible items
            <nav className="py-4">
              <div className="space-y-1 px-2">
                {visibleItems.map((item) => (
                  <button
                    key={item.to}
                    onClick={() => handleNavigation(item.to)}
                    className={`group flex items-center justify-center p-3 rounded-lg transition-all duration-200 text-sm font-medium relative overflow-hidden w-full ${
                      location.pathname === item.to
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-700'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                    title={item.label}
                  >
                    <item.Icon className="w-5 h-5 flex-shrink-0" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </button>
                ))}
                
                {/* More Options Button */}
                {hiddenItems.length > 0 && (
                  <button
                    onClick={() => setShowMorePopup(true)}
                    className="group flex items-center justify-center p-3 rounded-lg transition-all duration-200 text-sm font-medium relative overflow-hidden text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                    title={`${hiddenItems.length} more options`}
                  >
                    <FiMoreHorizontal className="w-5 h-5 flex-shrink-0" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </button>
                )}
              </div>
            </nav>
          ) : (
            // Expanded Navigation - Full sections
            <nav className="py-4">
              <div className="space-y-6">
                {searchFilteredSections.map((section) => (
                  <div key={section.title} className="px-4">
                    {/* Section Header */}
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-2">
                      {section.title}
                    </h3>
                    
                    {/* Section Items */}
                    <div className="space-y-1">
                      {section.items.map((item) => createNavLink(item))}
            </div>
          </div>
                ))}
              </div>
            </nav>
          )}
        </div>

        {/* Fixed User Profile Section */}
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700">
          {!collapsed ? (
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                    {auth.user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {auth.user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {auth.user?.email}
                  </p>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => window.open('/help', '_blank')}
                  className="flex-1 p-2 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Help & Support"
                >
                  <FiHelpCircle className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 p-2 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Logout"
                >
                  <FiLogOut className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-2">
              <div className="flex flex-col items-center gap-2">
               
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Logout"
                >
                  <FiLogOut className="w-4 h-4" />
                </button>
            </div>
          </div>
        )}
        </div>
      </aside>

      {/* More Options Popup */}
      {showMorePopup && collapsed && (
        <div className="fixed inset-0 z-60" onClick={() => setShowMorePopup(false)}>
          <div className="absolute left-20 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                More Options ({hiddenItems.length})
              </h3>
            </div>
            <div className="p-4 space-y-1">
              {hiddenItems.map((item) => createNavLink(item))}
          </div>
            </div>
          </div>
        )}
    </>
  );
};

export default Sidebar;

