import { Navigate } from 'react-router-dom';
import useAuthStore from '../hooks/auth';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, hasHydrated } = useAuthStore();

  // Wait until Zustand hydration is complete
  if (!hasHydrated) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-300">
        Checking session...
      </div>
    );
  }

  // If no token, redirect to login
  if (!token) return <Navigate to="/login" />;

  return <>{children}</>;
};

export default ProtectedRoute;