import { Product } from "./product";
import { Tenant } from "./tenant";

export interface Category {
  id: number;
  name: string; 
  tenantId: string;
  tenant: Tenant;
  isActive: boolean;
  imageUrl: string;
  products: Product[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryFormData {
  name: string;
  isActive: boolean;
  products_ids: number[];
}