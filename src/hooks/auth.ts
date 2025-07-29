import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useTenantStore from './useTenantStore';

interface AuthState {
  token: string | null;
  user: {
    id: string;
    tenantId: string;
    name: string;
    email: string;
    role: {
      id: string;
      tenantId: string;
      name: string;
      description: string;
      permissions: Record<string, string[]>;
      createdAt: string;
      updatedAt: string;
    };
    isActive: boolean;
    isVerified: boolean;
    verificationToken: string | null;
    createdAt: string;
    updatedAt: string;
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
      
        // ✅ Sync tenantId into tenant store and clear any conflicting data
        if (user?.tenantId) {
          // Clear any existing tenant data and localStorage conflicts
          useTenantStore.getState().clearTenant();
          useTenantStore.getState().clearLocalStorageTenant();
          // Set the correct tenant ID from JWT token
          useTenantStore.getState().setTenantId(user.tenantId);
          console.log('Auth: Set tenant ID from JWT token:', user.tenantId);
        }
      },
      logout: () => {
        // Clear auth data and tenant data
        set({ token: null, user: null });
        useTenantStore.getState().clearTenant();
        useTenantStore.getState().clearLocalStorageTenant();
      },
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
        if (state) {
          state.setHasHydrated(true);
          // Ensure tenant ID is synced after rehydration
          if (state.user?.tenantId) {
            useTenantStore.getState().setTenantId(state.user.tenantId);
            console.log('Auth rehydration: Set tenant ID:', state.user.tenantId);
          }
        }
      },
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);

export default useAuthStore;