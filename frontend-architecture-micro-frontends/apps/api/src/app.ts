import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { Hono } from "hono";
import {
  authenticateUser,
  createDiscount,
  createProduct,
  getAccount,
  getAccountPermissions,
  getAccountUser,
  getAccountUsers,
  getAnalyticsOverview,
  getCustomer,
  getCurrentUser,
  getDashboardSummary,
  getDiscount,
  getOrder,
  getProduct,
  getSessionFromToken,
  getSettings,
  hasPermission,
  listCustomers,
  listDiscounts,
  listInventory,
  listOrders,
  listProducts,
  switchSessionAccount,
  updateAccount,
  updateAccountPermissions,
  updateAccountUser,
  updateCurrentUser,
  updateCustomer,
  updateDiscount,
  updateInventory,
  updateOrder,
  updateProduct,
  updateSettings,
} from "@commerceos/shared/mocks/data/store";
import type { Product } from "@commerceos/shared/domain/commerce/catalog.types";
import type { Customer } from "@commerceos/shared/domain/commerce/customers.types";
import type { Discount } from "@commerceos/shared/domain/commerce/discounts.types";
import type { InventoryItem } from "@commerceos/shared/domain/commerce/inventory.types";
import type { Order } from "@commerceos/shared/domain/commerce/orders.types";
import type { Account, SettingsData } from "@commerceos/shared/domain/commerce/settings.types";
import type {
  AccountMember,
  AccountPermissionPolicy,
  AuthSession,
} from "@commerceos/shared/domain/commerce/users.types";

type ApiStatusCode = 400 | 401 | 403 | 404 | 500;
type ApiError = { error: { message: string; status: ApiStatusCode } };
type ApiResult<T> = { value: T } | ApiError;

function isErrorResult<T>(result: ApiResult<T> | { url: string }): result is ApiError {
  return "error" in result;
}

function getToken(authorization: string | undefined) {
  return authorization?.startsWith("Bearer ") ? authorization.replace("Bearer ", "") : null;
}

function getSession(authorization: string | undefined) {
  return getSessionFromToken(getToken(authorization));
}

function requireSession(authorization: string | undefined): ApiResult<AuthSession> {
  const session = getSession(authorization);
  if (!session) return { error: { message: "Unauthorized", status: 401 as const } };
  return { value: session };
}

function requirePermission(
  authorization: string | undefined,
  permission: Parameters<typeof hasPermission>[1],
): ApiResult<AuthSession> {
  const result = requireSession(authorization);
  if (isErrorResult(result)) return result;
  if (!hasPermission(result.value, permission)) {
    return { error: { message: "Forbidden", status: 403 as const } };
  }
  return result;
}

function requireActiveAccount(authorization: string | undefined, accountId: string): ApiResult<AuthSession> {
  const result = requireSession(authorization);
  if (isErrorResult(result)) return result;
  const allowed = result.value.memberships.some((membership) => membership.account.id === accountId);
  if (!allowed) {
    return { error: { message: "Account not available for current user", status: 403 as const } };
  }
  return result;
}

function getExtensionFromMimeType(mimeType: string) {
  switch (mimeType) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    case "image/svg+xml":
      return ".svg";
    default:
      return "";
  }
}

function getUploadFileName(originalName: string, mimeType: string) {
  const parsedExtension = path.extname(originalName).toLowerCase();
  const extension = parsedExtension || getExtensionFromMimeType(mimeType) || ".bin";
  return `${Date.now()}-${randomUUID()}${extension}`;
}

async function persistImageUpload(
  uploadsDir: string,
  payload: { dataUrl?: string; fileName?: string },
): Promise<{ url: string } | ApiError> {
  const dataUrl = typeof payload.dataUrl === "string" ? payload.dataUrl : "";
  const fileName = typeof payload.fileName === "string" ? payload.fileName : "image";
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

  if (!match) {
    return { error: { message: "Invalid image payload", status: 400 as const } };
  }

  const [, mimeType, base64Data] = match;
  const bytes = Buffer.from(base64Data, "base64");
  if (!bytes.length) {
    return { error: { message: "Uploaded image is empty", status: 400 as const } };
  }

  await fs.mkdir(uploadsDir, { recursive: true });
  const uploadFileName = getUploadFileName(fileName, mimeType);
  await fs.writeFile(path.join(uploadsDir, uploadFileName), bytes);
  return { url: `/uploads/${uploadFileName}` };
}

function okOrNotFound<T>(value: T | null) {
  if (!value) return { error: { message: "Not found", status: 404 as const } };
  return { value };
}

function getAuthHeader(request: Request) {
  return request.headers.get("Authorization") ?? undefined;
}

export function createApp({ uploadsDir }: { uploadsDir: string }) {
  const app = new Hono();

  app.post("/api/auth/login", async (c) => {
    const payload = (await c.req.json()) as { email: string; password: string };
    const session = authenticateUser(payload.email, payload.password);
    return session
      ? c.json(session)
      : c.json({ message: "Invalid email or password" }, 401);
  });

  app.get("/api/auth/session", (c) => {
    const session = getSession(getAuthHeader(c.req.raw));
    return session ? c.json(session) : c.json({ message: "Unauthorized" }, 401);
  });

  app.post("/api/auth/logout", (c) => c.body(null, 204));

  app.post("/api/auth/switch-account", async (c) => {
    const authorization = getAuthHeader(c.req.raw);
    const result = requireSession(authorization);
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    const payload = (await c.req.json()) as { accountId: string };
    const nextSession = switchSessionAccount(getToken(authorization), payload.accountId);
    return nextSession
      ? c.json(nextSession)
      : c.json({ message: "Account not available for current user" }, 403);
  });

  app.get("/api/me", (c) => {
    const result = requireSession(getAuthHeader(c.req.raw));
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    const user = okOrNotFound(getCurrentUser(result.value.user.id));
    return isErrorResult(user) ? c.json({ message: user.error.message }, user.error.status) : c.json(user.value);
  });

  app.patch("/api/me", async (c) => {
    const result = requireSession(getAuthHeader(c.req.raw));
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    const payload = (await c.req.json()) as Partial<AccountMember>;
    const user = okOrNotFound(updateCurrentUser(result.value.user.id, payload));
    return isErrorResult(user) ? c.json({ message: user.error.message }, user.error.status) : c.json(user.value);
  });

  app.get("/api/dashboard/summary", (c) => {
    const result = requirePermission(getAuthHeader(c.req.raw), "dashboard.view");
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    return c.json(getDashboardSummary(result.value.activeAccount.id));
  });

  app.get("/api/products", (c) => {
    const result = requirePermission(getAuthHeader(c.req.raw), "catalog.view");
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    return c.json(listProducts(result.value.activeAccount.id));
  });

  app.post("/api/products", async (c) => {
    const result = requirePermission(getAuthHeader(c.req.raw), "catalog.edit");
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    const payload = (await c.req.json()) as Omit<Product, "id">;
    return c.json(createProduct(result.value.activeAccount.id, payload), 201);
  });

  app.get("/api/products/:id", (c) => {
    const result = requirePermission(getAuthHeader(c.req.raw), "catalog.view");
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    const product = okOrNotFound(getProduct(result.value.activeAccount.id, c.req.param("id")));
    return isErrorResult(product) ? c.json({ message: product.error.message }, product.error.status) : c.json(product.value);
  });

  app.patch("/api/products/:id", async (c) => {
    const result = requirePermission(getAuthHeader(c.req.raw), "catalog.edit");
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    const payload = (await c.req.json()) as Partial<Product>;
    return c.json(updateProduct(result.value.activeAccount.id, c.req.param("id"), payload));
  });

  app.get("/api/inventory", (c) => {
    const result = requirePermission(getAuthHeader(c.req.raw), "inventory.view");
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    return c.json(listInventory(result.value.activeAccount.id));
  });

  app.patch("/api/inventory/:id", async (c) => {
    const result = requirePermission(getAuthHeader(c.req.raw), "inventory.edit");
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    const payload = (await c.req.json()) as Partial<InventoryItem>;
    return c.json(updateInventory(result.value.activeAccount.id, c.req.param("id"), payload));
  });

  app.get("/api/orders", (c) => {
    const result = requirePermission(getAuthHeader(c.req.raw), "orders.view");
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    return c.json(listOrders(result.value.activeAccount.id));
  });

  app.get("/api/orders/:id", (c) => {
    const result = requirePermission(getAuthHeader(c.req.raw), "orders.view");
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    const order = okOrNotFound(getOrder(result.value.activeAccount.id, c.req.param("id")));
    return isErrorResult(order) ? c.json({ message: order.error.message }, order.error.status) : c.json(order.value);
  });

  app.patch("/api/orders/:id", async (c) => {
    const sessionResult = requireSession(getAuthHeader(c.req.raw));
    if (isErrorResult(sessionResult)) return c.json({ message: sessionResult.error.message }, sessionResult.error.status);
    const payload = (await c.req.json()) as Partial<Order>;
    const permission = payload.refunds ? "orders.refund" : "orders.manage";
    if (!hasPermission(sessionResult.value as AuthSession, permission)) {
      return c.json({ message: "Forbidden" }, 403);
    }
    return c.json(updateOrder(sessionResult.value.activeAccount.id, c.req.param("id"), payload));
  });

  app.get("/api/customers", (c) => {
    const result = requirePermission(getAuthHeader(c.req.raw), "customers.view");
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    return c.json(listCustomers(result.value.activeAccount.id));
  });

  app.get("/api/customers/:id", (c) => {
    const result = requirePermission(getAuthHeader(c.req.raw), "customers.view");
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    const customer = okOrNotFound(getCustomer(result.value.activeAccount.id, c.req.param("id")));
    return isErrorResult(customer) ? c.json({ message: customer.error.message }, customer.error.status) : c.json(customer.value);
  });

  app.patch("/api/customers/:id", async (c) => {
    const result = requirePermission(getAuthHeader(c.req.raw), "customers.view");
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    const payload = (await c.req.json()) as Partial<Customer>;
    const customer = okOrNotFound(updateCustomer(result.value.activeAccount.id, c.req.param("id"), payload));
    return isErrorResult(customer) ? c.json({ message: customer.error.message }, customer.error.status) : c.json(customer.value);
  });

  app.get("/api/discounts", (c) => {
    const result = requirePermission(getAuthHeader(c.req.raw), "discounts.view");
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    return c.json(listDiscounts(result.value.activeAccount.id));
  });

  app.post("/api/discounts", async (c) => {
    const result = requirePermission(getAuthHeader(c.req.raw), "discounts.manage");
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    const payload = (await c.req.json()) as Omit<Discount, "id" | "usageCount">;
    return c.json(createDiscount(result.value.activeAccount.id, payload), 201);
  });

  app.patch("/api/discounts/:id", async (c) => {
    const result = requirePermission(getAuthHeader(c.req.raw), "discounts.manage");
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    const payload = (await c.req.json()) as Partial<Discount>;
    return c.json(updateDiscount(result.value.activeAccount.id, c.req.param("id"), payload));
  });

  app.get("/api/discounts/:id", (c) => {
    const result = requirePermission(getAuthHeader(c.req.raw), "discounts.view");
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    const discount = okOrNotFound(getDiscount(result.value.activeAccount.id, c.req.param("id")));
    return isErrorResult(discount) ? c.json({ message: discount.error.message }, discount.error.status) : c.json(discount.value);
  });

  app.get("/api/analytics/overview", (c) => {
    const result = requirePermission(getAuthHeader(c.req.raw), "analytics.view");
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    return c.json(getAnalyticsOverview(result.value.activeAccount.id));
  });

  app.get("/api/settings", (c) => {
    const result = requirePermission(getAuthHeader(c.req.raw), "settings.view");
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    return c.json(getSettings(result.value.activeAccount.id));
  });

  app.patch("/api/settings", async (c) => {
    const result = requireSession(getAuthHeader(c.req.raw));
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    const payload = (await c.req.json()) as Partial<SettingsData>;
    if (
      (payload.shipping && !hasPermission(result.value, "settings.shipping.manage")) ||
      (payload.taxes && !hasPermission(result.value, "settings.tax.manage")) ||
      (payload.notifications && !hasPermission(result.value, "settings.notifications.manage"))
    ) {
      return c.json({ message: "Forbidden" }, 403);
    }
    return c.json(updateSettings(result.value.activeAccount.id, payload));
  });

  app.get("/api/accounts/:accountId", (c) => {
    const accountId = c.req.param("accountId");
    const result = requireActiveAccount(getAuthHeader(c.req.raw), accountId);
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    return c.json(getAccount(accountId));
  });

  app.patch("/api/accounts/:accountId", async (c) => {
    const accountId = c.req.param("accountId");
    const result = requireActiveAccount(getAuthHeader(c.req.raw), accountId);
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    if (!hasPermission(result.value, "settings.account_profile.manage")) {
      return c.json({ message: "Forbidden" }, 403);
    }
    const payload = (await c.req.json()) as Partial<Account>;
    return c.json(updateAccount(accountId, payload));
  });

  app.get("/api/accounts/:accountId/settings", (c) => {
    const accountId = c.req.param("accountId");
    const result = requireActiveAccount(getAuthHeader(c.req.raw), accountId);
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    if (!hasPermission(result.value, "settings.view")) {
      return c.json({ message: "Forbidden" }, 403);
    }
    return c.json(getSettings(accountId));
  });

  app.patch("/api/accounts/:accountId/settings", async (c) => {
    const accountId = c.req.param("accountId");
    const result = requireActiveAccount(getAuthHeader(c.req.raw), accountId);
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    const payload = (await c.req.json()) as Partial<SettingsData>;
    if (
      (payload.shipping && !hasPermission(result.value, "settings.shipping.manage")) ||
      (payload.taxes && !hasPermission(result.value, "settings.tax.manage")) ||
      (payload.notifications && !hasPermission(result.value, "settings.notifications.manage"))
    ) {
      return c.json({ message: "Forbidden" }, 403);
    }
    return c.json(updateSettings(accountId, payload));
  });

  app.get("/api/accounts/:accountId/users", (c) => {
    const accountId = c.req.param("accountId");
    const result = requireActiveAccount(getAuthHeader(c.req.raw), accountId);
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    if (!hasPermission(result.value, "settings.users.manage")) {
      return c.json({ message: "Forbidden" }, 403);
    }
    return c.json(getAccountUsers(accountId));
  });

  app.get("/api/accounts/:accountId/users/:userId", (c) => {
    const accountId = c.req.param("accountId");
    const userId = c.req.param("userId");
    const result = requireActiveAccount(getAuthHeader(c.req.raw), accountId);
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    if (!hasPermission(result.value, "settings.users.manage")) {
      return c.json({ message: "Forbidden" }, 403);
    }
    const user = okOrNotFound(getAccountUser(accountId, userId));
    return isErrorResult(user) ? c.json({ message: user.error.message }, user.error.status) : c.json(user.value);
  });

  app.patch("/api/accounts/:accountId/users/:userId", async (c) => {
    const accountId = c.req.param("accountId");
    const userId = c.req.param("userId");
    const result = requireActiveAccount(getAuthHeader(c.req.raw), accountId);
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    if (!hasPermission(result.value, "settings.users.manage")) {
      return c.json({ message: "Forbidden" }, 403);
    }
    const payload = (await c.req.json()) as Partial<AccountMember>;
    return c.json(updateAccountUser(accountId, userId, payload));
  });

  app.get("/api/accounts/:accountId/permissions", (c) => {
    const accountId = c.req.param("accountId");
    const result = requireActiveAccount(getAuthHeader(c.req.raw), accountId);
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    if (!hasPermission(result.value, "settings.permissions.manage")) {
      return c.json({ message: "Forbidden" }, 403);
    }
    return c.json(getAccountPermissions(accountId));
  });

  app.patch("/api/accounts/:accountId/permissions", async (c) => {
    const accountId = c.req.param("accountId");
    const result = requireActiveAccount(getAuthHeader(c.req.raw), accountId);
    if (isErrorResult(result)) return c.json({ message: result.error.message }, result.error.status);
    if (!hasPermission(result.value, "settings.permissions.manage")) {
      return c.json({ message: "Forbidden" }, 403);
    }
    const payload = (await c.req.json()) as Partial<AccountPermissionPolicy>;
    return c.json(updateAccountPermissions(accountId, payload));
  });

  app.post("/api/uploads/avatar", async (c) => {
    try {
      const result = await persistImageUpload(uploadsDir, await c.req.json());
      return isErrorResult(result) ? c.json({ message: result.error.message }, result.error.status) : c.json(result, 201);
    } catch {
      return c.json({ message: "Avatar upload failed" }, 500);
    }
  });

  app.post("/api/uploads/image", async (c) => {
    try {
      const result = await persistImageUpload(uploadsDir, await c.req.json());
      return isErrorResult(result) ? c.json({ message: result.error.message }, result.error.status) : c.json(result, 201);
    } catch {
      return c.json({ message: "Image upload failed" }, 500);
    }
  });

  return app;
}
