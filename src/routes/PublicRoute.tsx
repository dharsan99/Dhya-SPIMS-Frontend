import { Navigate } from 'react-router-dom';
import useAuthStore from '../hooks/auth';

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, hasHydrated } = useAuthStore();

  // ⏳ Waiting for hydration
  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 dark:text-gray-300">
        Checking session...
      </div>
    );
  }

  // ✅ Redirect if already authenticated
  if (token) {
    return <Navigate to="/" />;
  }

  // ✅ Show children (e.g., Login page) for unauthenticated users
  return <>{children}</>;
};

export default PublicRoute;