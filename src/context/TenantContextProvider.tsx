import useTenantStore from '@/hooks/useTenantStore';
import { ReactNode, useEffect } from 'react';

type Props = {
  children: ReactNode;
};

const TenantContextProvider = ({ children }: Props) => {
  const setTenantId = useTenantStore((state) => state.setTenantId);

  useEffect(() => {
    // Example: get from subdomain or localStorage
    const subdomain = window.location.hostname.split('.')[0];
    const stored = localStorage.getItem('tenantId');

    const resolvedTenantId = stored || subdomain || 'default';
    setTenantId(resolvedTenantId);
  }, [setTenantId]);

  return <>{children}</>;
};

export default TenantContextProvider;


