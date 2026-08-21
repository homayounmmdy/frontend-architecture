export type {
  BundleComponent,
  Collection,
  PriceList,
  PriceListPrice,
  Product,
  ProductKind,
  ProductStatus,
  ProductVariant,
} from "@/modules/catalog/domain/catalog.types";

export type {
  Order,
  OrderExchange,
  OrderLineItem,
  OrderRefund,
  OrderReturn,
  OrderStatus,
  PaymentStatus,
  ShipmentStatus,
} from "@/modules/orders/domain/orders.types";

export type { InventoryItem, InventoryStatus } from "@/modules/inventory/domain/inventory.types";
export type { Customer, CustomerDetail, CustomerSegment } from "@/modules/customers/domain/customers.types";
export type { Discount, DiscountRule, DiscountType } from "@/modules/discounts/domain/discounts.types";
export type { AnalyticsOverview } from "@/modules/analytics/domain/analytics.types";
export type { DashboardSummary } from "@/modules/dashboard/domain/dashboard.types";
export type { Account, AccountProfile, SettingsData } from "@/modules/settings/domain/settings.types";
export type {
  AccountMember,
  AccountPermissionPolicy,
  AuthSession,
  AuthUser,
  PermissionKey,
  RoleKey,
  SessionMembership,
} from "@/modules/users/domain/users.types";
export type { AuditLogEntry } from "@/shared/domain/audit-log.types";
