import { Navigate } from 'react-router-dom';
import useAuthStore from '../hooks/auth';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { token, hasHydrated, user } = useAuthStore();

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
    if (import.meta.env.DEV) {
      console.log('[PublicRoute] Authenticated user detected. Redirecting to /dashboard', user);
    }
    return <Navigate to="/app/dashboard" replace />;
  }

  // ✅ Show children (e.g., Login page) for unauthenticated users
  return <>{children}</>;
};

export default PublicRoute;