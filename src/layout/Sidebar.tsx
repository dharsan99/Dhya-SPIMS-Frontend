import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiLayers,
  FiMapPin,
  FiSettings,
  FiPackage,
  FiUsers,
  FiMail,
  FiActivity,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

import useAuthStore from '../hooks/auth';
import logo from '../assets/dhya_texintelli.png';

const Sidebar = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const auth = useAuthStore();
  const email = auth.user?.email || '';
  const [collapsed, setCollapsed] = useState(true);

  const hasPermission = useAuthStore((state) => state.hasPermission);
  const canViewFibres = hasPermission('Fibres', 'View Fibre');
  const canViewShades = hasPermission('Shades', 'View Shade');
  const canViewEmployees = hasPermission('Employees', 'View Employee');
  const canViewMarketing = hasPermission('Marketing', 'View Marketing');
  const canViewSettings = hasPermission('Settings', 'View Settings');

  const navLinkStyles = collapsed
    ? 'flex items-center justify-center px-0 py-2 rounded-lg transition-colors duration-200 text-xl'
    : 'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium';
  const activeLink =
    'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-white font-semibold shadow-sm';
  const inactiveLink =
    'text-gray-700 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-gray-800';

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

  const isOrderUser = email === 'orders@nscspinning.com';

  return (
    <aside
      className={`h-full flex flex-col bg-white dark:bg-gray-900 border-r dark:border-gray-700 shadow-md transition-all duration-300 overflow-y-auto pt-20 ${collapsed ? 'w-20' : 'w-64'}` }
      aria-label="Sidebar Navigation"
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
          className="p-2 focus:outline-none"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <FiChevronRight className="w-6 h-6" /> : <FiChevronLeft className="w-6 h-6" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-8" aria-label="Sidebar Navigation">
        {/* Core */}
        <div>
          <h3 className={`text-xs font-bold uppercase px-2 mb-3 tracking-wide ${collapsed ? 'hidden' : 'text-gray-400 dark:text-gray-500'}`}>Core</h3>
          <div className="flex flex-col gap-1">
            {createNavLink('/app/dashboard', 'Dashboard', FiGrid)}
            {createNavLink('/app/orders', 'Orders', FiPackage)}
            {createNavLink('/app/production', 'Production', FiActivity)}
          </div>
        </div>

        {/* Master Data */}
        {(canViewFibres || canViewShades || canViewEmployees || canViewMarketing) && (
          <div>
            <h3 className={`text-xs font-bold uppercase px-2 mb-3 tracking-wide ${collapsed ? 'hidden' : 'text-gray-400 dark:text-gray-500'}`}>Master Data</h3>
            <div className="flex flex-col gap-1">
              {canViewFibres && createNavLink('/app/fibers', 'Fibres', FiLayers)}
              {canViewShades && createNavLink('/app/shades', 'Shades', FiMapPin)}
              {canViewEmployees && createNavLink('/app/employees', 'Employees', FiUsers)}
              {canViewMarketing && createNavLink('/app/marketing', 'Marketing', FiMail)}
            </div>
          </div>
        )}

        {/* Configuration */}
        {canViewSettings && !isOrderUser && (
          <div>
            <h3 className={`text-xs font-bold uppercase px-2 mb-3 tracking-wide ${collapsed ? 'hidden' : 'text-gray-400 dark:text-gray-500'}`}>Configuration</h3>
            <div className="flex flex-col gap-1">
              {createNavLink('/app/settings', 'Settings', FiSettings)}
            </div>
          </div>
        )}
      </nav>

      <div className="flex-grow" />
    </aside>
  );
};

export default Sidebar;

