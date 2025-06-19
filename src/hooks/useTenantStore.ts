import { create } from 'zustand';

type TenantStore = {
  tenantId: string | null;
  setTenantId: (id: string) => void;
  clearTenant: () => void;
};

const useTenantStore = create<TenantStore>((set) => ({
  tenantId: null,
  setTenantId: (id) => set({ tenantId: id }),
  clearTenant: () => set({ tenantId: null }),
}));

export default useTenantStore;