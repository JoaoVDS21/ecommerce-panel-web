import { Product } from "./product";
import { Tenant } from "./tenant";

export interface Shelf {
  id: number;
  title: string; 
  position: number;
  tenantId: string;
  tenant: Tenant;
  isActive: boolean;
  imageUrl: string;
  products: Product[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ShelfFormData {
  title: string;
  position: number;
  isActive: boolean;
  products_ids: number[];
}