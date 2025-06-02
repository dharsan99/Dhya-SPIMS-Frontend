import { NavLink } from 'react-router-dom';
import { FiGrid, FiLayers, FiMapPin, FiSettings, FiPackage, FiUsers, FiMail } from 'react-icons/fi';

import useAuthStore from '../hooks/auth';

const Sidebar = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const auth = useAuthStore();
  const email = auth.user?.email || '';

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


  const isOrderUser = email === 'orders@nscspinning.com';

  return (
    <aside className="w-64 sticky top-0 h-screen flex flex-col bg-white dark:bg-gray-900 border-r dark:border-gray-700 px-4 py-6 shadow-md transition-colors duration-300 overflow-y-auto">
      {/* Logo */}
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-wide">
          SPIMS
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-8" aria-label="Sidebar Navigation">
        {/* Core */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase px-2 mb-3 tracking-wide">
            Core
          </h3>
          <div className="flex flex-col gap-1">
            {createNavLink('/app/dashboard', 'Dashboard', FiGrid)}
            {createNavLink('/app/orders', 'Orders', FiPackage)}
          </div>
        </div>

        {/* Master Data */}
        {!isOrderUser && (
          <div>
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase px-2 mb-3 tracking-wide">
              Master Data
            </h3>
            <div className="flex flex-col gap-1">
              {createNavLink('/app/fibers', 'Fibres', FiLayers)}
              {createNavLink('/app/shades', 'Shades', FiMapPin)}
              {createNavLink('/app/employees', 'Employees', FiUsers)}
              {createNavLink('/app/marketing', 'Marketing', FiMail)}
            </div>
          </div>
        )}

        {/* Settings */}
        {!isOrderUser && (
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

      {/* Spacer */}
      <div className="flex-grow" />
    </aside>
  );
};

export default Sidebar;