import type { LucideIcon } from "lucide-react";
import type { PermissionKey } from "@commerceos/shared/domain/commerce/users.types";
import {
  BarChart3,
  LayoutDashboard,
  Package,
  PackageSearch,
  Receipt,
  Settings,
  ShieldCheck,
  Tags,
  Users,
} from "lucide-react";

export const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, permission: "dashboard.view" },
  { to: "/catalog", label: "Catalog", icon: Package, permission: "catalog.view" },
  { to: "/inventory", label: "Inventory", icon: PackageSearch, permission: "inventory.view" },
  { to: "/orders", label: "Orders", icon: Receipt, permission: "orders.view" },
  { to: "/customers", label: "Customers", icon: Users, permission: "customers.view" },
  { to: "/discounts", label: "Discounts", icon: Tags, permission: "discounts.view" },
  { to: "/analytics", label: "Analytics", icon: BarChart3, permission: "analytics.view" },
  { to: "/users", label: "Users", icon: ShieldCheck, permission: "settings.users.manage" },
  { to: "/settings", label: "Settings", icon: Settings, permission: "settings.view" },
] as const satisfies ReadonlyArray<{ to: string; label: string; icon: LucideIcon; permission: PermissionKey }>;
