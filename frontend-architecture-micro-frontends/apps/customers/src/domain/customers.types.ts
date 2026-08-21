import type { PriceList } from "@commerceos/shared/domain/commerce/catalog.types";
import type { Order } from "@commerceos/shared/domain/commerce/orders.types";

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
