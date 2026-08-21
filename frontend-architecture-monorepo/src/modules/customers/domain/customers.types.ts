import type { PriceList } from "@/modules/catalog/domain/catalog.types";
import type { Order } from "@/modules/orders/domain/orders.types";

export type CustomerSegment = "VIP" | "Wholesale" | "At Risk" | "New" | "Repeat";

export interface Customer {
  id: string;
  name: string;
  email: string;
  segment: CustomerSegment;
  tags: string[];
  priceListId?: string | null;
  priceList?: PriceList | null;
  lifetimeSpend: number;
  notes: string;
  joinedAt: string;
}

export interface CustomerDetail extends Customer {
  orderHistory: Order[];
}
