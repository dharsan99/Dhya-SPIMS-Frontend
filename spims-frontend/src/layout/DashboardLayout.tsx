import { Outlet, useNavigate } from 'react-router-dom';
import useAuthStore from '../hooks/auth';
import Sidebar from './Sidebar';


const DashboardLayout = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex min-h-screen bg-gray-100">
  <Sidebar />
  <div className="flex-1 flex flex-col">
    {/* topbar + outlet */}
  </div>
</div>
  

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <span className="text-sm text-gray-600">Logged in as <strong>{user?.name}</strong></span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm"
          >
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;