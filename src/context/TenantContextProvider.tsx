import useTenantStore from '@/hooks/useTenantStore';
import useAuthStore from '@/hooks/auth';
import { ReactNode, useEffect } from 'react';

type Props = {
  children: ReactNode;
};

const TenantContextProvider = ({ children }: Props) => {
  const setTenantId = useTenantStore((state) => state.setTenantId);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // If user is authenticated, use their tenant ID from JWT token
    if (user?.tenantId) {
      console.log('TenantContextProvider: Setting tenant ID from JWT token:', user.tenantId);
      setTenantId(user.tenantId);
    } else {
      // Fallback for unauthenticated users or initial load
      const subdomain = window.location.hostname.split('.')[0];
      const stored = localStorage.getItem('tenantId');
      const resolvedTenantId = stored || subdomain || 'default';
      console.log('TenantContextProvider: Using fallback tenant ID:', resolvedTenantId);
      setTenantId(resolvedTenantId);
    }
  }, [setTenantId, user?.tenantId]);

  // Debug effect to log tenant ID changes
  useEffect(() => {
    console.log('TenantContextProvider: User tenant ID changed to:', user?.tenantId);
  }, [user?.tenantId]);

  return <>{children}</>;
};

export default TenantContextProvider;


