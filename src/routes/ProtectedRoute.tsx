import { Navigate } from 'react-router-dom';
import useAuthStore from '../hooks/auth';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, hasHydrated, user } = useAuthStore();

  // 🚀 Optional: Log debug info
  if (import.meta.env.DEV) {
    console.log('[ProtectedRoute]', {
      token,
      hydrated: hasHydrated,
      user,
    });
  }

  // Wait until Zustand hydration is complete
  if (!hasHydrated) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-300">
        Checking session...
      </div>
    );
  }

  // If no token, redirect to login
  if (!token) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;