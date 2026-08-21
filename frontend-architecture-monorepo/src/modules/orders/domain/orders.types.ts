import type { AuditLogEntry } from "@/shared/domain/audit-log.types";

export type OrderStatus = "pending" | "processing" | "fulfilled" | "cancelled" | "refunded";
export type PaymentStatus = "paid" | "pending" | "refunded";
export type ShipmentStatus = "label_created" | "in_transit" | "delivered" | "delayed";

export interface OrderLineItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface OrderRefund {
  id: string;
  amount: number;
  reason: string;
  createdAt: string;
}

export interface OrderReturn {
  id: string;
  productName: string;
  quantity: number;
  status: "requested" | "received" | "restocked";
  createdAt: string;
}

export interface OrderExchange {
  id: string;
  originalProductName: string;
  replacementProductName: string;
  status: "pending" | "approved" | "shipped";
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: number;
  notes: string;
  shippingAddress: {
    name: string;
    line1: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  shipment: {
    carrier: string;
    trackingNumber: string;
    status: ShipmentStatus;
    shippedAt: string | null;
    estimatedDelivery: string | null;
  };
  refunds: OrderRefund[];
  returns: OrderReturn[];
  exchanges: OrderExchange[];
  appliedPriceListName?: string | null;
  activityHistory?: AuditLogEntry[];
  lineItems: OrderLineItem[];
}
