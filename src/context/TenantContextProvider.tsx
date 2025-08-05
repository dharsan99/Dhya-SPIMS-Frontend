import useTenantStore from '@/hooks/useTenantStore';
import useAuthStore from '@/hooks/auth';
import { ReactNode, useEffect } from 'react';

type Props = {
  children: ReactNode;
};

const TenantContextProvider = ({ children }: Props) => {
  const setTenantId = useTenantStore((state) => state.setTenantId);
  const currentTenantId = useTenantStore((state) => state.tenantId);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    console.log('TenantContextProvider: User object:', user);
    console.log('TenantContextProvider: User tenantId:', user?.tenantId);
    console.log('TenantContextProvider: Current tenantId in store:', currentTenantId);
    
    // If user is authenticated, use their tenant ID from JWT token
    if (user?.tenantId) {
      console.log('TenantContextProvider: Setting tenant ID from JWT token:', user.tenantId);
      setTenantId(user.tenantId);
    } else if (user && !user.tenantId && currentTenantId) {
      // User exists but has no tenantId, preserve current tenant ID
      console.log('TenantContextProvider: User exists but no tenantId, preserving current tenant ID:', currentTenantId);
      // Don't change the tenant ID
    } else {
      // Fallback for unauthenticated users or initial load
      const subdomain = window.location.hostname.split('.')[0];
      const stored = localStorage.getItem('tenantId');
      const resolvedTenantId = stored || subdomain || 'default';
      console.log('TenantContextProvider: User has no tenantId, using fallback:', resolvedTenantId);
      console.log('TenantContextProvider: Subdomain:', subdomain);
      console.log('TenantContextProvider: Stored tenantId:', stored);
      setTenantId(resolvedTenantId);
    }
  }, [setTenantId, user?.tenantId, currentTenantId]);

  // Debug effect to log tenant ID changes
  useEffect(() => {
    console.log('TenantContextProvider: User tenant ID changed to:', user?.tenantId);
  }, [user?.tenantId]);

  return <>{children}</>;
};

export default TenantContextProvider;


