import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiUsers,
  FiChevronLeft,
  FiChevronRight,
  FiShield,
} from 'react-icons/fi';

import logo from '../../assets/dhya_texintelli.png';

const SuperAdminSidebar = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const [collapsed, setCollapsed] = useState(true);

  const navLinkStyles = collapsed
    ? 'flex items-center justify-center px-0 py-2 rounded-lg transition-colors duration-200 text-xl'
    : 'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium';
  const activeLink =
    'bg-red-100 text-red-700 dark:bg-red-950 dark:text-white font-semibold shadow-sm';
  const inactiveLink =
    'text-gray-700 hover:bg-red-50 dark:text-gray-300 dark:hover:bg-gray-800';

  const createNavLink = (
    to: string,
    label: string,
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  ) => (
    <NavLink
      to={to}
      aria-label={label}
      onClick={onLinkClick}
      className={({ isActive }) =>
        `${navLinkStyles} ${isActive ? activeLink : inactiveLink}`
      }
    >
      <Icon className={collapsed ? 'w-6 h-6 shrink-0' : 'w-5 h-5 shrink-0'} />
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  );

  return (
    <aside
      className={`h-full flex flex-col bg-white dark:bg-gray-900 border-r dark:border-gray-700 shadow-md transition-all duration-300 overflow-y-auto ${collapsed ? 'w-20' : 'w-64'}`}
      aria-label="Super Admin Sidebar Navigation"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center justify-start w-full py-2 transition-all duration-300">
          {!collapsed && (
            <img
              src={logo}
              alt="Dhya Texintelli Logo"
              className="transition-all duration-300 w-32 h-auto object-contain"
              style={{ maxHeight: '48px' }}
            />
          )}
        </div>
        <button
          className="hidden md:block p-2 focus:outline-none"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <FiChevronRight className="w-6 h-6" /> : <FiChevronLeft className="w-6 h-6" />}
        </button>
      </div>

      {/* Super Admin Badge */}
      <div className={`px-2 mb-6 ${collapsed ? 'text-center' : ''}`}>
        <div className={`bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-3 py-2 rounded-lg ${collapsed ? 'text-xs' : 'text-sm'} font-semibold flex items-center gap-2 justify-center`}>
          <FiShield className="w-4 h-4" />
          {!collapsed && <span>Super Admin</span>}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-8" aria-label="Super Admin Navigation">
        {/* Super Admin */}
        <div>
          <h3 className={`text-xs font-bold uppercase px-2 mb-3 tracking-wide ${collapsed ? 'hidden' : 'text-gray-400 dark:text-gray-500'}`}>Super Admin</h3>
          <div className="flex flex-col gap-1">
            {createNavLink('/superadmin/dashboard', 'Dashboard', FiGrid)}
            {createNavLink('/superadmin/tenants', 'Tenants', FiUsers)}
          </div>
        </div>
      </nav>

      <div className="flex-grow" />
    </aside>
  );
};

export default SuperAdminSidebar; 