import { Navigate } from 'react-router-dom';
import useAuthStore from '../hooks/auth';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  return token ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;