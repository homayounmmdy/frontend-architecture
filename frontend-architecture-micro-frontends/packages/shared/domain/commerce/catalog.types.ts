import type { CustomerSegment } from "@commerceos/shared/domain/commerce/customers.types";
import type { InventoryStatus } from "@commerceos/shared/domain/commerce/inventory.types";
import type { AuditLogEntry } from "@commerceos/shared/domain/audit-log.types";

export type ProductStatus = "active" | "draft" | "archived";
export type ProductKind = "standard" | "bundle";

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  inventory: number;
  status: InventoryStatus;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
}

export interface BundleComponent {
  productId: string;
  productName: string;
  quantity: number;
}

export interface PriceList {
  id: string;
  name: string;
  segment: CustomerSegment | "Custom";
}

export interface PriceListPrice {
  priceListId: string;
  priceListName: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  imageUrl?: string | null;
  kind: ProductKind;
  price: number;
  status: ProductStatus;
  inventory: number;
  collectionIds: string[];
  collections?: Collection[];
  variants: ProductVariant[];
  bundleComponents?: BundleComponent[];
  priceListPrices?: PriceListPrice[];
  activityHistory?: AuditLogEntry[];
}
