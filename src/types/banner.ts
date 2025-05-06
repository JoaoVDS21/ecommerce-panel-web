import { Tenant } from "./tenant";

export interface Banner {
  id: number;
  title: string; 
  position: number;
  tenantId: string;
  tenant: Tenant;
  isActive: boolean;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BannerFormData {
  title: string;
  position: number;
  isActive: boolean;
}