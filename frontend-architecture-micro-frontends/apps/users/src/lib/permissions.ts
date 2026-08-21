import type { PermissionKey, RoleKey } from "../domain/users.types";

export const ALL_PERMISSIONS: PermissionKey[] = [
  "dashboard.view",
  "catalog.view",
  "catalog.edit",
  "inventory.view",
  "inventory.edit",
  "orders.view",
  "orders.manage",
  "orders.refund",
  "customers.view",
  "discounts.view",
  "discounts.manage",
  "analytics.view",
  "settings.view",
  "settings.account_profile.manage",
  "settings.shipping.manage",
  "settings.tax.manage",
  "settings.notifications.manage",
  "settings.users.manage",
  "settings.permissions.manage",
];

export const DEFAULT_PERMISSION_POLICY = {
  account_owner: ALL_PERMISSIONS,
  admin: [
    "dashboard.view",
    "catalog.view",
    "catalog.edit",
    "inventory.view",
    "inventory.edit",
    "orders.view",
    "orders.manage",
    "customers.view",
    "discounts.view",
    "discounts.manage",
    "analytics.view",
    "settings.view",
    "settings.account_profile.manage",
    "settings.shipping.manage",
    "settings.notifications.manage",
  ],
  user: [
    "dashboard.view",
    "catalog.view",
    "inventory.view",
    "orders.view",
    "customers.view",
    "discounts.view",
    "analytics.view",
  ],
} satisfies Record<RoleKey, PermissionKey[]>;

export const PERMISSION_GROUPS: Array<{
  title: string;
  items: Array<{ key: PermissionKey; label: string; description: string }>;
}> = [
  {
    title: "Overview",
    items: [
      { key: "dashboard.view", label: "View dashboard", description: "Open the dashboard overview." },
      { key: "analytics.view", label: "View analytics", description: "Open analytics and trend reports." },
    ],
  },
  {
    title: "Catalog",
    items: [
      { key: "catalog.view", label: "View catalog", description: "Browse product lists and product detail." },
      { key: "catalog.edit", label: "Edit catalog", description: "Update product and variant details." },
      { key: "inventory.view", label: "View inventory", description: "Open inventory pages and stock health." },
      { key: "inventory.edit", label: "Edit inventory", description: "Adjust warehouse stock levels." },
    ],
  },
  {
    title: "Orders And Customers",
    items: [
      { key: "orders.view", label: "View orders", description: "Open order lists and detail screens." },
      { key: "orders.manage", label: "Manage orders", description: "Mark fulfillment, cancel, start returns, and create exchanges." },
      { key: "orders.refund", label: "Refund orders", description: "Issue partial or full refunds." },
      { key: "customers.view", label: "View customers", description: "Open customer lists and detail screens." },
    ],
  },
  {
    title: "Promotions",
    items: [
      { key: "discounts.view", label: "View discounts", description: "Browse discount lists and detail screens." },
      { key: "discounts.manage", label: "Manage discounts", description: "Create and edit discount rules." },
    ],
  },
  {
    title: "Settings",
    items: [
      { key: "settings.view", label: "View settings", description: "Open account settings." },
      { key: "settings.account_profile.manage", label: "Manage account profile", description: "Update store name, email, currency, and timezone." },
      { key: "settings.shipping.manage", label: "Manage shipping", description: "Update carrier and shipping rates." },
      { key: "settings.tax.manage", label: "Manage taxes", description: "Update tax defaults and inclusive pricing." },
      { key: "settings.notifications.manage", label: "Manage notifications", description: "Update alert preferences." },
      { key: "settings.users.manage", label: "Manage users", description: "Change account member roles." },
      { key: "settings.permissions.manage", label: "Manage permissions", description: "Customize Admin and User role access." },
    ],
  },
];

export const ROLE_LABELS: Record<RoleKey, string> = {
  account_owner: "Account Owner",
  admin: "Admin",
  user: "User",
};

export const VIEW_PERMISSION_BY_PATH: Array<{ prefix: string; permission: PermissionKey }> = [
  { prefix: "/profile", permission: "dashboard.view" },
  { prefix: "/users/roles-permissions", permission: "settings.permissions.manage" },
  { prefix: "/users", permission: "settings.users.manage" },
  { prefix: "/settings", permission: "settings.view" },
  { prefix: "/analytics", permission: "analytics.view" },
  { prefix: "/discounts", permission: "discounts.view" },
  { prefix: "/customers", permission: "customers.view" },
  { prefix: "/orders", permission: "orders.view" },
  { prefix: "/inventory", permission: "inventory.view" },
  { prefix: "/catalog/new", permission: "catalog.edit" },
  { prefix: "/catalog", permission: "catalog.view" },
  { prefix: "/", permission: "dashboard.view" },
];

export const ORDERED_APP_PATHS = VIEW_PERMISSION_BY_PATH.map((entry) => entry.prefix);

export function getViewPermissionForPath(pathname: string) {
  return VIEW_PERMISSION_BY_PATH.find((entry) => entry.prefix === "/" || pathname.startsWith(entry.prefix))?.permission ?? "dashboard.view";
}
