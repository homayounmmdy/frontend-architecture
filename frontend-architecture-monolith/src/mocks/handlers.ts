import { delay, http, HttpResponse } from "msw";
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
  updateCustomer,
  updateCurrentUser,
  updateDiscount,
  updateInventory,
  updateOrder,
  updateProduct,
  updateSettings,
} from "@/mocks/data/store";
import type { Account, AccountMember, AccountPermissionPolicy, Customer, Discount, InventoryItem, Order, Product, SettingsData } from "@/types";

function getToken(request: Request) {
  const header = request.headers.get("Authorization");
  return header?.startsWith("Bearer ") ? header.replace("Bearer ", "") : null;
}

function requireSession(request: Request) {
  const session = getSessionFromToken(getToken(request));
  if (!session) {
    return { error: HttpResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  }
  return { session };
}

function requirePermission(request: Request, permission: Parameters<typeof hasPermission>[1]) {
  const result = requireSession(request);
  if ("error" in result) return result;
  if (!hasPermission(result.session, permission)) {
    return { error: HttpResponse.json({ message: "Forbidden" }, { status: 403 }) };
  }
  return result;
}

function requireActiveAccount(request: Request, accountId: string) {
  const result = requireSession(request);
  if ("error" in result) return result;
  const allowed = result.session.memberships.some((membership) => membership.account.id === accountId);
  if (!allowed) {
    return { error: HttpResponse.json({ message: "Account not available for current user" }, { status: 403 }) };
  }
  return result;
}

export const handlers = [
  http.post("/api/auth/login", async ({ request }) => {
    const payload = (await request.json()) as { email: string; password: string };
    await delay(250);
    const session = authenticateUser(payload.email, payload.password);
    return session
      ? HttpResponse.json(session)
      : HttpResponse.json({ message: "Invalid email or password" }, { status: 401 });
  }),
  http.get("/api/auth/session", async ({ request }) => {
    await delay(120);
    const session = getSessionFromToken(getToken(request));
    return session
      ? HttpResponse.json(session)
      : HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
  }),
  http.post("/api/auth/logout", async () => {
    await delay(100);
    return new HttpResponse(null, { status: 204 });
  }),
  http.post("/api/auth/switch-account", async ({ request }) => {
    const result = requireSession(request);
    if ("error" in result) return result.error;
    const payload = (await request.json()) as { accountId: string };
    await delay(180);
    const nextSession = switchSessionAccount(getToken(request), payload.accountId);
    return nextSession
      ? HttpResponse.json(nextSession)
      : HttpResponse.json({ message: "Account not available for current user" }, { status: 403 });
  }),
  http.get("/api/me", async ({ request }) => {
    const result = requireSession(request);
    if ("error" in result) return result.error;
    await delay(120);
    const user = getCurrentUser(result.session.user.id);
    return user ? HttpResponse.json(user) : HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),
  http.patch("/api/me", async ({ request }) => {
    const result = requireSession(request);
    if ("error" in result) return result.error;
    const payload = (await request.json()) as Partial<AccountMember>;
    await delay(220);
    const user = updateCurrentUser(result.session.user.id, payload);
    return user ? HttpResponse.json(user) : HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),
  http.get("/api/dashboard/summary", async ({ request }) => {
    const result = requirePermission(request, "dashboard.view");
    if ("error" in result) return result.error;
    await delay(200);
    return HttpResponse.json(getDashboardSummary(result.session.activeAccount.id));
  }),
  http.get("/api/products", async ({ request }) => {
    const result = requirePermission(request, "catalog.view");
    if ("error" in result) return result.error;
    await delay(200);
    return HttpResponse.json(listProducts(result.session.activeAccount.id));
  }),
  http.post("/api/products", async ({ request }) => {
    const result = requirePermission(request, "catalog.edit");
    if ("error" in result) return result.error;
    const payload = (await request.json()) as Omit<Product, "id">;
    await delay(250);
    return HttpResponse.json(createProduct(result.session.activeAccount.id, payload), { status: 201 });
  }),
  http.get("/api/products/:id", async ({ params, request }) => {
    const result = requirePermission(request, "catalog.view");
    if ("error" in result) return result.error;
    await delay(150);
    const product = getProduct(result.session.activeAccount.id, String(params.id));
    return product ? HttpResponse.json(product) : HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),
  http.patch("/api/products/:id", async ({ params, request }) => {
    const result = requirePermission(request, "catalog.edit");
    if ("error" in result) return result.error;
    const payload = (await request.json()) as Partial<Product>;
    await delay(250);
    return HttpResponse.json(updateProduct(result.session.activeAccount.id, String(params.id), payload));
  }),
  http.get("/api/inventory", async ({ request }) => {
    const result = requirePermission(request, "inventory.view");
    if ("error" in result) return result.error;
    await delay(200);
    return HttpResponse.json(listInventory(result.session.activeAccount.id));
  }),
  http.patch("/api/inventory/:id", async ({ params, request }) => {
    const result = requirePermission(request, "inventory.edit");
    if ("error" in result) return result.error;
    const payload = (await request.json()) as Partial<InventoryItem>;
    await delay(250);
    return HttpResponse.json(updateInventory(result.session.activeAccount.id, String(params.id), payload));
  }),
  http.get("/api/orders", async ({ request }) => {
    const result = requirePermission(request, "orders.view");
    if ("error" in result) return result.error;
    await delay(200);
    return HttpResponse.json(listOrders(result.session.activeAccount.id));
  }),
  http.get("/api/orders/:id", async ({ params, request }) => {
    const result = requirePermission(request, "orders.view");
    if ("error" in result) return result.error;
    await delay(150);
    const order = getOrder(result.session.activeAccount.id, String(params.id));
    return order ? HttpResponse.json(order) : HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),
  http.patch("/api/orders/:id", async ({ params, request }) => {
    const result = requireSession(request);
    if ("error" in result) return result.error;
    const payload = (await request.json()) as Partial<Order>;
    const permission = payload.refunds ? "orders.refund" : "orders.manage";
    if (!hasPermission(result.session, permission)) {
      return HttpResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    await delay(250);
    return HttpResponse.json(updateOrder(result.session.activeAccount.id, String(params.id), payload));
  }),
  http.get("/api/customers", async ({ request }) => {
    const result = requirePermission(request, "customers.view");
    if ("error" in result) return result.error;
    await delay(200);
    return HttpResponse.json(listCustomers(result.session.activeAccount.id));
  }),
  http.get("/api/customers/:id", async ({ params, request }) => {
    const result = requirePermission(request, "customers.view");
    if ("error" in result) return result.error;
    await delay(150);
    const customer = getCustomer(result.session.activeAccount.id, String(params.id));
    return customer ? HttpResponse.json(customer) : HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),
  http.patch("/api/customers/:id", async ({ params, request }) => {
    const result = requirePermission(request, "customers.view");
    if ("error" in result) return result.error;
    const payload = (await request.json()) as Partial<Customer>;
    await delay(220);
    const customer = updateCustomer(result.session.activeAccount.id, String(params.id), payload);
    return customer ? HttpResponse.json(customer) : HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),
  http.get("/api/discounts", async ({ request }) => {
    const result = requirePermission(request, "discounts.view");
    if ("error" in result) return result.error;
    await delay(200);
    return HttpResponse.json(listDiscounts(result.session.activeAccount.id));
  }),
  http.post("/api/discounts", async ({ request }) => {
    const result = requirePermission(request, "discounts.manage");
    if ("error" in result) return result.error;
    const payload = (await request.json()) as Omit<Discount, "id" | "usageCount">;
    await delay(250);
    return HttpResponse.json(createDiscount(result.session.activeAccount.id, payload), { status: 201 });
  }),
  http.patch("/api/discounts/:id", async ({ params, request }) => {
    const result = requirePermission(request, "discounts.manage");
    if ("error" in result) return result.error;
    const payload = (await request.json()) as Partial<Discount>;
    await delay(250);
    return HttpResponse.json(updateDiscount(result.session.activeAccount.id, String(params.id), payload));
  }),
  http.get("/api/discounts/:id", async ({ params, request }) => {
    const result = requirePermission(request, "discounts.view");
    if ("error" in result) return result.error;
    await delay(150);
    const discount = getDiscount(result.session.activeAccount.id, String(params.id));
    return discount ? HttpResponse.json(discount) : HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),
  http.get("/api/analytics/overview", async ({ request }) => {
    const result = requirePermission(request, "analytics.view");
    if ("error" in result) return result.error;
    await delay(200);
    return HttpResponse.json(getAnalyticsOverview(result.session.activeAccount.id));
  }),
  http.get("/api/settings", async ({ request }) => {
    const result = requirePermission(request, "settings.view");
    if ("error" in result) return result.error;
    await delay(180);
    return HttpResponse.json(getSettings(result.session.activeAccount.id));
  }),
  http.patch("/api/settings", async ({ request }) => {
    const result = requireSession(request);
    if ("error" in result) return result.error;
    const payload = (await request.json()) as Partial<SettingsData>;
    if (
      (payload.shipping && !hasPermission(result.session, "settings.shipping.manage")) ||
      (payload.taxes && !hasPermission(result.session, "settings.tax.manage")) ||
      (payload.notifications && !hasPermission(result.session, "settings.notifications.manage"))
    ) {
      return HttpResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    await delay(250);
    return HttpResponse.json(updateSettings(result.session.activeAccount.id, payload));
  }),
  http.get("/api/accounts/:accountId", async ({ params, request }) => {
    const result = requireActiveAccount(request, String(params.accountId));
    if ("error" in result) return result.error;
    await delay(150);
    return HttpResponse.json(getAccount(String(params.accountId)));
  }),
  http.patch("/api/accounts/:accountId", async ({ params, request }) => {
    const result = requireActiveAccount(request, String(params.accountId));
    if ("error" in result) return result.error;
    if (!hasPermission(result.session, "settings.account_profile.manage")) {
      return HttpResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const payload = (await request.json()) as Partial<Account>;
    await delay(220);
    return HttpResponse.json(updateAccount(String(params.accountId), payload));
  }),
  http.get("/api/accounts/:accountId/settings", async ({ params, request }) => {
    const result = requireActiveAccount(request, String(params.accountId));
    if ("error" in result) return result.error;
    if (!hasPermission(result.session, "settings.view")) {
      return HttpResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    await delay(160);
    return HttpResponse.json(getSettings(String(params.accountId)));
  }),
  http.patch("/api/accounts/:accountId/settings", async ({ params, request }) => {
    const result = requireActiveAccount(request, String(params.accountId));
    if ("error" in result) return result.error;
    const payload = (await request.json()) as Partial<SettingsData>;
    if (
      (payload.shipping && !hasPermission(result.session, "settings.shipping.manage")) ||
      (payload.taxes && !hasPermission(result.session, "settings.tax.manage")) ||
      (payload.notifications && !hasPermission(result.session, "settings.notifications.manage"))
    ) {
      return HttpResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    await delay(220);
    return HttpResponse.json(updateSettings(String(params.accountId), payload));
  }),
  http.get("/api/accounts/:accountId/users", async ({ params, request }) => {
    const result = requireActiveAccount(request, String(params.accountId));
    if ("error" in result) return result.error;
    if (!hasPermission(result.session, "settings.users.manage")) {
      return HttpResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    await delay(180);
    return HttpResponse.json(getAccountUsers(String(params.accountId)));
  }),
  http.get("/api/accounts/:accountId/users/:userId", async ({ params, request }) => {
    const result = requireActiveAccount(request, String(params.accountId));
    if ("error" in result) return result.error;
    if (!hasPermission(result.session, "settings.users.manage")) {
      return HttpResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    await delay(180);
    const user = getAccountUser(String(params.accountId), String(params.userId));
    return user ? HttpResponse.json(user) : HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),
  http.patch("/api/accounts/:accountId/users/:userId", async ({ params, request }) => {
    const result = requireActiveAccount(request, String(params.accountId));
    if ("error" in result) return result.error;
    if (!hasPermission(result.session, "settings.users.manage")) {
      return HttpResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const payload = (await request.json()) as Partial<AccountMember>;
    await delay(220);
    return HttpResponse.json(updateAccountUser(String(params.accountId), String(params.userId), payload));
  }),
  http.get("/api/accounts/:accountId/permissions", async ({ params, request }) => {
    const result = requireActiveAccount(request, String(params.accountId));
    if ("error" in result) return result.error;
    if (!hasPermission(result.session, "settings.permissions.manage")) {
      return HttpResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    await delay(180);
    return HttpResponse.json(getAccountPermissions(String(params.accountId)));
  }),
  http.patch("/api/accounts/:accountId/permissions", async ({ params, request }) => {
    const result = requireActiveAccount(request, String(params.accountId));
    if ("error" in result) return result.error;
    if (!hasPermission(result.session, "settings.permissions.manage")) {
      return HttpResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    const payload = (await request.json()) as Partial<AccountPermissionPolicy>;
    await delay(220);
    return HttpResponse.json(updateAccountPermissions(String(params.accountId), payload));
  }),
];
