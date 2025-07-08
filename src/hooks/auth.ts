import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useTenantStore from './useTenantStore';

interface AuthState {
  token: string | null;
  user: {
    id: string;
    tenant_id: string;
    name: string;
    email: string;
    role: {
      id: string;
      tenant_id: string;
      name: string;
      description: string;
      permissions: Record<string, string[]>;
      created_at: string;
      updated_at: string;
    };
    is_active: boolean;
    created_at: string;
    updated_at: string;
  } | null;
  hasHydrated: boolean;
  setAuth: (token: string, user: AuthState['user']) => void;
  logout: () => void;
  setHasHydrated: (val: boolean) => void;

  hasPermission: (module: string, permission: string) => boolean;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      hasHydrated: false,

      setAuth: (token, user) => {
        set({ token, user });
      
        // ✅ Sync tenantId into tenant store
        if (user?.tenant_id) {
          useTenantStore.getState().setTenantId(user.tenant_id);
        }
      },
      logout: () => set({ token: null, user: null }),
      setHasHydrated: (val) => set({ hasHydrated: val }),

      hasPermission: (module, permission) => {
        const user = get().user;
        const permissions =
          user?.role?.permissions || {};
        const modulePermissions = permissions[module] || [];
        return modulePermissions.includes(permission);
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      },
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);

export default useAuthStore;