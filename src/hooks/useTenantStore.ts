import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TenantDetails {
  id: string;
  name: string;
  domain?: string;
  plan?: string;
  is_active: boolean;
  logo?: string; // base64 logo data
}

type TenantStore = {
  tenantId: string | null;
  tenantDetails: TenantDetails | null;
  setTenantId: (id: string) => void;
  setTenantDetails: (details: TenantDetails) => void;
  clearTenant: () => void;
  getTenantLogo: () => string | null;
};

const useTenantStore = create<TenantStore>()(
  persist(
    (set, get) => ({
      tenantId: null,
      tenantDetails: null,
      setTenantId: (id) => set({ tenantId: id }),
      setTenantDetails: (details) => set({ tenantDetails: details }),
      clearTenant: () => set({ tenantId: null, tenantDetails: null }),
      getTenantLogo: () => {
        const { tenantDetails } = get();
        return tenantDetails?.logo || null;
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