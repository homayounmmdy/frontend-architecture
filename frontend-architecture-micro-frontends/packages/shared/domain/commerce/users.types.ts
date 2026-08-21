import type { Account } from "@commerceos/shared/domain/commerce/settings.types";

export type RoleKey = "account_owner" | "admin" | "user";

export type PermissionKey =
  | "dashboard.view"
  | "catalog.view"
  | "catalog.edit"
  | "inventory.view"
  | "inventory.edit"
  | "orders.view"
  | "orders.manage"
  | "orders.refund"
  | "customers.view"
  | "discounts.view"
  | "discounts.manage"
  | "analytics.view"
  | "settings.view"
  | "settings.account_profile.manage"
  | "settings.shipping.manage"
  | "settings.tax.manage"
  | "settings.notifications.manage"
  | "settings.users.manage"
  | "settings.permissions.manage";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  title: string;
  initials: string;
  avatarUrl?: string | null;
}

export interface AccountMember {
  userId: string;
  name: string;
  email: string;
  title: string;
  initials: string;
  avatarUrl?: string | null;
  role: RoleKey;
  status: "active" | "inactive";
  lastActiveAt: string;
}

export interface AccountPermissionPolicy {
  account_owner: PermissionKey[];
  admin: PermissionKey[];
  user: PermissionKey[];
}

export interface SessionMembership {
  account: Account;
  role: RoleKey;
  permissions: PermissionKey[];
}

export interface AuthSession {
  token: string;
  user: AuthUser;
  activeAccount: Account;
  activeRole: RoleKey;
  activePermissions: PermissionKey[];
  memberships: SessionMembership[];
}
