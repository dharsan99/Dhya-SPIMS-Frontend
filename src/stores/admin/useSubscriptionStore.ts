import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface TenantSubscription {
  id: string;
  tenantName: string;
  planName: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  maxUsers: number;
  maxOrders: number;
  maxStorage: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface SubscriptionStore {
  subscriptions: TenantSubscription[];
  isModalOpen: boolean;
  editingSubscription: TenantSubscription | null;

  setModalOpen: (open: boolean) => void;
  setEditingSubscription: (sub: TenantSubscription | null) => void;
  addOrUpdateSubscription: (sub: TenantSubscription) => void;
  setSubscriptions: (subs: TenantSubscription[]) => void;
}

export const useSubscriptionStore = create<SubscriptionStore>()(
  devtools((set, get) => ({
    subscriptions: [],
    isModalOpen: false,
    editingSubscription: null,

    setModalOpen: (open) => set({ isModalOpen: open }),

    setEditingSubscription: (sub) => set({ editingSubscription: sub }),

    addOrUpdateSubscription: (newSub) =>
      set((state) => {
        const exists = state.subscriptions.some((s) => s.id === newSub.id);
        const updatedList = exists
          ? state.subscriptions.map((s) => (s.id === newSub.id ? newSub : s))
          : [...state.subscriptions, newSub];

        // If the editing subscription is the one updated, update it too
        const currentEditing = state.editingSubscription;
        const updatedEditing =
          currentEditing?.id === newSub.id ? newSub : currentEditing;

        return {
          subscriptions: updatedList,
          editingSubscription: updatedEditing,
        };
      }),

    setSubscriptions: (subs) => set({ subscriptions: subs }),
  }))
);
