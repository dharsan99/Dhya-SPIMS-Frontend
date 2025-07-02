import { create } from 'zustand';

type TenantStore = {
  tenantId: string | null;
  setTenantId: (id: string) => void;
  clearTenant: () => void;
};

const useTenantStore = create<TenantStore>((set) => ({
  tenantId: null,
  setTenantId: (id) => {
    localStorage.setItem('tenantId', id); // ✅ Save to localStorage
    set({ tenantId: id });
  },
  clearTenant: () => {
    localStorage.removeItem('tenantId'); // ✅ Clear from localStorage
    set({ tenantId: null });
  },
}));


export default useTenantStore;