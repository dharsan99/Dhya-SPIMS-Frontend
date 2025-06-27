import {
  FiGrid,
  FiLayers,
  FiMapPin,
  FiSettings,
  FiPackage,
  FiUsers,
  FiMail,
} from 'react-icons/fi';

import { NavLink } from 'react-router-dom';
import useAuthStore from '../hooks/auth';

const Sidebar = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const hasPermission = useAuthStore((state) => state.hasPermission);

  // Permission checks
  const canViewFibres = hasPermission('Fibres', 'View Fibre');
  const canViewShades = hasPermission('Shades', 'View Shade');
  const canViewEmployees = hasPermission('Employees', 'View Employee');
  const canViewMarketing = hasPermission('Marketing', 'View Marketing');
  const canViewSettings = hasPermission('Settings', 'View Settings');

  const navLinkStyles =
    'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium';
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
      className={({ isActive }) =>
        `${navLinkStyles} ${isActive ? activeLink : inactiveLink}`
      }
      onClick={onLinkClick}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className="truncate">{label}</span>
    </NavLink>
  );

  return (
    <aside className="w-64 fixed top-0 left-0 h-screen flex flex-col bg-white dark:bg-gray-900 border-r dark:border-gray-700 px-4 py-6 shadow-md transition-colors duration-300 overflow-y-auto z-50">
      {/* Logo */}
      <div className="mb-10 text-center">
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          TexIntelli
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-8" aria-label="Sidebar Navigation">
        <div>
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase px-2 mb-3 tracking-wide">
            Core
          </h3>
          <div className="flex flex-col gap-1">
            {createNavLink('/app/dashboard', 'Dashboard', FiGrid)}
            {createNavLink('/app/orders', 'Orders', FiPackage)}
          </div>
        </div>

        {(canViewFibres || canViewShades || canViewEmployees || canViewMarketing) && (
          <div>
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase px-2 mb-3 tracking-wide">
              Master Data
            </h3>
            <div className="flex flex-col gap-1">
              {canViewFibres && createNavLink('/app/fibers', 'Fibres', FiLayers)}
              {canViewShades && createNavLink('/app/shades', 'Shades', FiMapPin)}
              {canViewEmployees && createNavLink('/app/employees', 'Employees', FiUsers)}
              {canViewMarketing && createNavLink('/app/marketing', 'Marketing', FiMail)}
            </div>
          </div>
        )}

        {canViewSettings && (
          <div>
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase px-2 mb-3 tracking-wide">
              Configuration
            </h3>
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
