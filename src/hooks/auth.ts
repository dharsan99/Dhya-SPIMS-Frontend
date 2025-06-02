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
  } | null;
  hasHydrated: boolean;
  setAuth: (token: string, user: AuthState['user']) => void;
  logout: () => void;
  setHasHydrated: (val: boolean) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hasHydrated: false,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      setHasHydrated: (val) => set({ hasHydrated: val }),
    }),
    {
      name: 'auth-storage', // 🛑 Storage key in localStorage
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true);
      },
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }), // ✅ Only persist token and user — not hasHydrated
    }
  )
);

export default useAuthStore;