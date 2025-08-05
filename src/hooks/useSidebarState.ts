import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  collapsed: boolean;
  mobileOpen: boolean;
  toggleCollapsed: () => void;
  setMobileOpen: (open: boolean) => void;
  closeMobile: () => void;
}

export const useSidebarState = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed: true, // Default: sidebar is collapsed
      mobileOpen: false,
      
      toggleCollapsed: () => 
        set((state) => ({ 
          collapsed: !state.collapsed 
        })),
      
      setMobileOpen: (open: boolean) => 
        set({ mobileOpen: open }),
      
      closeMobile: () => 
        set({ mobileOpen: false }),
    }),
    {
      name: 'sidebar-state', // Persist sidebar state in localStorage
      partialize: (state) => ({ collapsed: state.collapsed }), // Only persist collapsed state
    }
  )
); 