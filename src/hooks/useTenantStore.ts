import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TenantDetails {
  id: string;
  name: string;
  domain?: string;
  plan?: string;
  isActive: boolean;
  logo?: string; // base64 logo data
}

type TenantStore = {
  tenantId: string | null;
  tenantDetails: TenantDetails | null;
  setTenantId: (id: string) => void;
  setTenantDetails: (details: TenantDetails) => void;
  clearTenant: () => void;
  getTenantLogo: () => string | null;
  debugTenantInfo: () => void;
  clearLocalStorageTenant: () => void;
};

const useTenantStore = create<TenantStore>()(
  persist(
    (set, get) => ({
      tenantId: null,
      tenantDetails: null,
      setTenantId: (id) => {
        console.log('TenantStore: Setting tenant ID to:', id);
        set({ tenantId: id });
      },
      setTenantDetails: (details) => set({ tenantDetails: details }),
      clearTenant: () => {
        console.log('TenantStore: Clearing tenant data');
        set({ tenantId: null, tenantDetails: null });
      },
      getTenantLogo: () => {
        const { tenantDetails } = get();
        return tenantDetails?.logo || null;
      },
      debugTenantInfo: () => {
        const state = get();
        console.log('TenantStore Debug Info:', {
          tenantId: state.tenantId,
          tenantDetails: state.tenantDetails,
        });
      },
      clearLocalStorageTenant: () => {
        // Clear any conflicting localStorage tenant data
        localStorage.removeItem('tenantId');
        localStorage.removeItem('tenant-storage');
        console.log('TenantStore: Cleared localStorage tenant data');
      },
    }),
    {
      name: 'tenant-storage',
      partialize: (state) => ({
        tenantId: state.tenantId,
        tenantDetails: state.tenantDetails,
      }),
    }
  )
);

export default useTenantStore;