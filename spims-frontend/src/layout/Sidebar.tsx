import { NavLink } from 'react-router-dom';
import { FiGrid, FiLayers, FiMapPin } from 'react-icons/fi';

const Sidebar = () => {
  const navLinkStyles =
    'flex items-center gap-3 px-4 py-2 rounded hover:bg-blue-100 text-gray-700 transition';
  const activeLink = 'bg-blue-100 text-blue-700 font-medium';

  const createNavLink = (to: string, label: string, Icon: React.ElementType) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? `${navLinkStyles} ${activeLink}` : navLinkStyles
      }
    >
      <Icon />
      {label}
    </NavLink>
  );

  return (
    <aside className="w-64 sticky top-0 h-screen bg-white border-r px-4 py-6 shadow-sm">
      <h1 className="text-2xl font-bold text-blue-600 mb-10 text-center">SPIMS</h1>

      <nav className="flex flex-col gap-4">
        {/* --- Core Navigation --- */}
        <div className="flex flex-col gap-2">
          {createNavLink('/dashboard', 'Dashboard', FiGrid)}
          {createNavLink('/orders', 'Orders', FiGrid)}
          {createNavLink('/production', 'Productions', FiGrid)}

        </div>

        {/* --- Section Divider --- */}
        <hr className="my-2 border-gray-200" />

        {/* --- Master Data Section --- */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase px-2 mb-2">Master Data</h3>
          <div className="flex flex-col gap-2">
            {createNavLink('/fibers', 'Fibres', FiLayers)}
            {createNavLink('/shades', 'Shades', FiMapPin)}
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;