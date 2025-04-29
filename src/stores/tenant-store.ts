import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tenant, TenantState } from '@/types/tenant';

interface TenantStore extends TenantState {
  setCurrentTenant: (tenant: Tenant) => void;
  setAvailableTenants: (tenants: Tenant[]) => void;
}

export const useTenantStore = create<TenantStore>()(
  persist(
    (set) => ({
      currentTenant: null,
      availableTenants: [],
      isLoading: false,
      
      setCurrentTenant: (tenant) => {
        set({ currentTenant: tenant });
      },
      
      setAvailableTenants: (tenants) => {
        set({ availableTenants: tenants });
      },
    }),
    {
      name: 'tenant-storage',
      partialize: (state) => ({ currentTenant: state.currentTenant }),
    }
  )
);