import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from './auth';
import useTenantStore from './useTenantStore';
import { getTenantDetails } from '../api/tenants';
import texintelliLogo from '../assets/dhya_texintelli.png';

interface UseDynamicLogoReturn {
  logoSrc: string;
  logoAlt: string;
  isLoading: boolean;
  isError: boolean;
  tenantName?: string;
  hasTenantLogo: boolean; // New: indicates if tenant has a custom logo
}

export const useDynamicLogo = (): UseDynamicLogoReturn => {
  const { user } = useAuthStore();
  const { tenantDetails, setTenantDetails, getTenantLogo } = useTenantStore();
  const [logoSrc, setLogoSrc] = useState<string>(texintelliLogo);
  const [logoAlt, setLogoAlt] = useState<string>('Dhya Texintelli Logo');
  const [hasTenantLogo, setHasTenantLogo] = useState<boolean>(false);

  // Get tenant ID from user
  const tenantId = user?.tenant_id || '';

  // Fetch tenant details including logo
  const { 
    data: tenantData, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['tenantDetails', tenantId],
    queryFn: () => getTenantDetails(tenantId!),
    enabled: !!tenantId && !tenantDetails, // Only fetch if we have tenantId and no cached details
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 1, // Only retry once if it fails
  });

  useEffect(() => {
    if (tenantData?.data) {
      // Store tenant details in store
      setTenantDetails(tenantData.data);
    }
  }, [tenantData, setTenantDetails]);

  useEffect(() => {
    // Determine logo to use
    const tenantLogo = getTenantLogo();
    
    if (tenantLogo && tenantLogo.trim()) {
      // Use tenant logo (base64)
      const logoData = tenantLogo.startsWith('data:') 
        ? tenantLogo 
        : `data:image/png;base64,${tenantLogo}`;
      
      setLogoSrc(logoData);
      setLogoAlt(`${tenantDetails?.name || 'Tenant'} Logo`);
      setHasTenantLogo(true);
    } else {
      // Fallback to Texintelli logo
      setLogoSrc(texintelliLogo);
      setLogoAlt('Dhya Texintelli Logo');
      setHasTenantLogo(false);
    }
  }, [tenantDetails, getTenantLogo]);

  return {
    logoSrc,
    logoAlt,
    isLoading,
    isError,
    tenantName: tenantDetails?.name,
    hasTenantLogo,
  };
}; 