export interface Tenant {
  id: string;
  name: string;
  logo?: string;
}

export interface TenantState {
  currentTenant: Tenant | null;
  availableTenants: Tenant[];
  isLoading: boolean;
}