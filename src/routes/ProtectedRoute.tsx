import { Navigate } from 'react-router-dom';
import useAuthStore from '../hooks/auth';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Use selectors for better performance and to avoid unnecessary rerenders
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  // Wait until Zustand hydration is complete
  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span className="text-gray-500 dark:text-gray-300 mt-2">Checking session...</span>
        </div>
      </div>
    );
  }

  // If no token, redirect to login
  if (!token) return <Navigate to="/login" />;

  return <>{children}</>;
};

export default ProtectedRoute;