import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: {
    id: string;
    tenant_id: string;
    name: string;
    email: string;
    role: string;
    user_roles?: {
      role?: {
        name: string;
        permissions: Record<string, string[]>;
      };
    }[];
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

      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      setHasHydrated: (val) => set({ hasHydrated: val }),

      hasPermission: (module, permission) => {
        const user = get().user;
        const permissions =
          user?.user_roles?.[0]?.role?.permissions || {};
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