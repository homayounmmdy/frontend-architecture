import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  ChartColumn,
  Cog,
  CreditCard,
  FilePlus2,
  LayoutDashboard,
  Package,
  PackageSearch,
  Receipt,
  Search,
  Settings,
  Truck,
  Users,
} from "lucide-react";
import { fetchCustomers } from "@commerceos/shared/api/commerce/customers.api";
import { fetchOrders } from "@commerceos/shared/api/commerce/orders.api";
import { fetchProducts } from "@commerceos/shared/api/commerce/products.api";
import { fetchAccountUsers } from "@commerceos/shared/api/commerce/account-access.api";
import { useAuth } from "@commerceos/authentication/providers/use-auth";
import { Button } from "@commerceos/ui/button";
import { Dialog, DialogContent } from "@commerceos/ui/dialog";
import { Input } from "@commerceos/ui/input";
import { ROLE_LABELS } from "@commerceos/shared/permissions/permissions";
import { formatCurrency, formatDate } from "@commerceos/shared/lib/utils";
import { cn } from "@commerceos/ui/lib/utils";
import type { PermissionKey } from "@commerceos/shared/domain/commerce/users.types";

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CommandItem {
  id: string;
  label: string;
  section: string;
  subtitle: string;
  keywords: string;
  icon: LucideIcon;
  permission?: PermissionKey;
  run: () => Promise<void> | void;
}

const settingsSections = [
  {
    id: "store-profile",
    label: "Store Profile",
    subtitle: "Store name, support email, currency, and timezone",
    keywords: "settings store profile support email currency timezone",
    icon: Cog,
  },
  {
    id: "shipping",
    label: "Shipping",
    subtitle: "Default carrier and shipping rates",
    keywords: "settings shipping carrier standard express rate",
    icon: Truck,
  },
  {
    id: "taxes",
    label: "Taxes",
    subtitle: "Tax region, default rate, and inclusive pricing",
    keywords: "settings taxes nexus region default rate prices include tax",
    icon: CreditCard,
  },
  {
    id: "notifications",
    label: "Notifications",
    subtitle: "Low-stock, order alert, and digest preferences",
    keywords: "settings notifications low stock order alerts weekly digest",
    icon: Settings,
  },
] as const;

function matchesQuery(item: Pick<CommandItem, "label" | "subtitle" | "keywords">, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;
  return `${item.label} ${item.subtitle} ${item.keywords}`.toLowerCase().includes(normalizedQuery);
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const navigate = useNavigate();
  const { session, hasPermission, switchAccount } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    enabled: open && hasPermission("catalog.view"),
    staleTime: 60_000,
  });
  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    enabled: open && hasPermission("orders.view"),
    staleTime: 60_000,
  });
  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
    enabled: open && hasPermission("customers.view"),
    staleTime: 60_000,
  });
  const { data: accountUsers = [] } = useQuery({
    queryKey: ["accounts", session?.activeAccount.id, "users"],
    queryFn: () => fetchAccountUsers(session?.activeAccount.id ?? ""),
    enabled: open && Boolean(session?.activeAccount.id) && hasPermission("settings.users.manage"),
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(0);
      return;
    }

    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  const items = useMemo(() => {
    const navigateAndClose = async (callback: () => Promise<unknown>) => {
      onOpenChange(false);
      await callback();
    };

    const baseItems: CommandItem[] = [
      {
        id: "go-dashboard",
        label: "Go to Dashboard",
        section: "Navigate",
        subtitle: "Overview of revenue, orders, customers, and alerts",
        keywords: "home dashboard summary overview",
        icon: LayoutDashboard,
        permission: "dashboard.view",
        run: () => navigateAndClose(() => navigate({ to: "/" })),
      },
      {
        id: "go-catalog",
        label: "Go to Catalog",
        section: "Navigate",
        subtitle: "Browse products, pricing, and merchandising state",
        keywords: "catalog products inventory merchandise",
        icon: Package,
        permission: "catalog.view",
        run: () => navigateAndClose(() => navigate({ to: "/catalog" })),
      },
      {
        id: "go-inventory",
        label: "Go to Inventory",
        section: "Navigate",
        subtitle: "Review warehouse quantities and stock health",
        keywords: "inventory stock warehouse low stock",
        icon: PackageSearch,
        permission: "inventory.view",
        run: () => navigateAndClose(() => navigate({ to: "/inventory" })),
      },
      {
        id: "go-orders",
        label: "Go to Orders",
        section: "Navigate",
        subtitle: "Track order flow, fulfillment, and aftercare",
        keywords: "orders fulfillment shipment returns refunds",
        icon: Receipt,
        permission: "orders.view",
        run: () => navigateAndClose(() => navigate({ to: "/orders" })),
      },
      {
        id: "go-customers",
        label: "Go to Customers",
        section: "Navigate",
        subtitle: "Browse customer profiles, segments, and spend",
        keywords: "customers people buyers segments spend",
        icon: Users,
        permission: "customers.view",
        run: () => navigateAndClose(() => navigate({ to: "/customers" })),
      },
      {
        id: "go-discounts",
        label: "Go to Discounts",
        section: "Navigate",
        subtitle: "Manage active and archived discount rules",
        keywords: "discounts promotions coupons offers",
        icon: CreditCard,
        permission: "discounts.view",
        run: () => navigateAndClose(() => navigate({ to: "/discounts" })),
      },
      {
        id: "go-analytics",
        label: "Go to Analytics",
        section: "Navigate",
        subtitle: "View revenue, AOV, conversion, and category trends",
        keywords: "analytics revenue charts reports",
        icon: ChartColumn,
        permission: "analytics.view",
        run: () => navigateAndClose(() => navigate({ to: "/analytics" })),
      },
      {
        id: "go-settings",
        label: "Go to Settings",
        section: "Navigate",
        subtitle: "Open store configuration and operations settings",
        keywords: "settings configuration preferences store profile shipping taxes",
        icon: Settings,
        permission: "settings.view",
        run: () => navigateAndClose(() => navigate({ to: "/settings" })),
      },
      {
        id: "go-users",
        label: "Go to Users",
        section: "Navigate",
        subtitle: "Manage account members and role assignments",
        keywords: "users team members roles access account",
        icon: Users,
        permission: "settings.users.manage",
        run: () => navigateAndClose(() => navigate({ to: "/users" })),
      },
      {
        id: "go-profile",
        label: "Go to Profile",
        section: "Navigate",
        subtitle: "Edit your own name, email, title, and avatar",
        keywords: "profile me account avatar personal settings",
        icon: Users,
        permission: "dashboard.view",
        run: () => navigateAndClose(() => navigate({ to: "/profile" })),
      },
      {
        id: "go-roles-permissions",
        label: "Go to Roles & Permissions",
        section: "Navigate",
        subtitle: "Customize Admin and User permission sets",
        keywords: "users roles permissions access policy admin user",
        icon: Settings,
        permission: "settings.permissions.manage",
        run: () => navigateAndClose(() => navigate({ to: "/users/roles-permissions" })),
      },
      {
        id: "new-discount",
        label: "Create Discount",
        section: "Create",
        subtitle: "Open the new discount flow",
        keywords: "create new add discount promotion coupon",
        icon: FilePlus2,
        permission: "discounts.manage",
        run: () => navigateAndClose(() => navigate({ to: "/discounts/new" })),
      },
      ...settingsSections.map((section) => ({
        id: `settings-${section.id}`,
        label: `Open ${section.label}`,
        section: "Settings",
        subtitle: section.subtitle,
        keywords: section.keywords,
        icon: section.icon,
        permission:
          section.id === "store-profile" ? "settings.account_profile.manage" :
            section.id === "shipping" ? "settings.shipping.manage" :
              section.id === "taxes" ? "settings.tax.manage" :
                section.id === "notifications" ? "settings.notifications.manage" :
                  "settings.view",
        run: () => navigateAndClose(() => navigate({ to: "/settings", hash: section.id })),
      })),
      ...(session?.memberships.length
        ? session.memberships.map((membership) => ({
          id: `account-${membership.account.id}`,
          label: `Switch to ${membership.account.name}`,
          section: "Accounts",
          subtitle: ROLE_LABELS[membership.role],
          keywords: `${membership.account.name} account switch tenant ${membership.role}`,
          icon: Cog,
          run: () => navigateAndClose(() => switchAccount(membership.account.id)),
        }))
        : []),
    ];

    const productItems: CommandItem[] = products.map((product) => ({
      id: `product-${product.id}`,
      label: product.name,
      section: "Products",
      subtitle: `${product.sku} · ${product.category} · ${formatCurrency(product.price)}`,
      keywords: `product ${product.name} ${product.sku} ${product.category} ${product.status}`,
      icon: Package,
      permission: "catalog.view",
      run: () => navigateAndClose(() => navigate({ to: "/catalog/$productId", params: { productId: product.id } })),
    }));

    const orderItems: CommandItem[] = orders.map((order) => ({
      id: `order-${order.id}`,
      label: `${order.orderNumber} · ${order.customerName}`,
      section: "Orders",
      subtitle: `${formatDate(order.date)} · ${order.status} · ${formatCurrency(order.total)}`,
      keywords: `order ${order.orderNumber} ${order.customerName} ${order.status} ${order.paymentStatus} ${order.shipment.carrier}`,
      icon: Receipt,
      permission: "orders.view",
      run: () => navigateAndClose(() => navigate({ to: "/orders/$orderId", params: { orderId: order.id } })),
    }));

    const customerItems: CommandItem[] = customers.map((customer) => ({
      id: `customer-${customer.id}`,
      label: customer.name,
      section: "Customers",
      subtitle: `${customer.email} · ${customer.segment} · ${formatCurrency(customer.lifetimeSpend)}`,
      keywords: `customer ${customer.name} ${customer.email} ${customer.segment} ${customer.tags.join(" ")}`,
      icon: Users,
      permission: "customers.view",
      run: () => navigateAndClose(() => navigate({ to: "/customers/$customerId", params: { customerId: customer.id } })),
    }));

    const userItems: CommandItem[] = accountUsers.map((user) => ({
      id: `user-${user.userId}`,
      label: user.name,
      section: "Users",
      subtitle: `${user.email} · ${ROLE_LABELS[user.role]} · ${user.title}`,
      keywords: `user ${user.name} ${user.email} ${user.title} ${user.role} team member account`,
      icon: Users,
      permission: "settings.users.manage",
      run: () => navigateAndClose(() => navigate({ to: "/users/$userId", params: { userId: user.userId } })),
    }));

    const filterItems = (itemsToFilter: CommandItem[]) =>
      itemsToFilter
        .filter((item) => !item.permission || hasPermission(item.permission))
        .filter((item) => matchesQuery(item, query));

    const filteredBaseItems = filterItems(baseItems);
    const filteredProductItems = filterItems(productItems).slice(0, query ? 6 : 4);
    const filteredOrderItems = filterItems(orderItems).slice(0, query ? 6 : 4);
    const filteredCustomerItems = filterItems(customerItems).slice(0, query ? 6 : 4);
    const filteredUserItems = filterItems(userItems).slice(0, query ? 6 : 4);

    return [
      ...filteredBaseItems,
      ...filteredProductItems,
      ...filteredOrderItems,
      ...filteredCustomerItems,
      ...filteredUserItems,
    ];
  }, [accountUsers, customers, hasPermission, navigate, onOpenChange, orders, products, query, session?.memberships, switchAccount]);

  useEffect(() => {
    if (!items.length) {
      setActiveIndex(0);
      return;
    }
    setActiveIndex((current) => Math.min(current, items.length - 1));
  }, [items]);

  const groupedItems = useMemo(() => {
    const groups = new Map<string, CommandItem[]>();
    for (const item of items) {
      const currentGroup = groups.get(item.section) ?? [];
      currentGroup.push(item);
      groups.set(item.section, currentGroup);
    }
    return [...groups.entries()];
  }, [items]);

  const handleSelect = async (item: CommandItem) => {
    await item.run();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-2xl">
        <div className="border-b px-4 py-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setActiveIndex((current) => Math.min(current + 1, items.length - 1));
                }
                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setActiveIndex((current) => Math.max(current - 1, 0));
                }
                if (event.key === "Enter" && items[activeIndex]) {
                  event.preventDefault();
                  void handleSelect(items[activeIndex]);
                }
              }}
              placeholder="Search products, orders, customers, settings, and actions..."
              className="h-11 border-0 pl-10 pr-24 text-base shadow-none focus-visible:ring-0"
            />
            <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 md:flex">
              <span className="rounded border bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">↑↓</span>
              <span className="rounded border bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">↵</span>
            </div>
          </div>
        </div>

        <div className="max-h-[28rem] overflow-y-auto p-2">
          {groupedItems.length ? (
            groupedItems.map(([section, sectionItems]) => (
              <div key={section} className="pb-2">
                <div className="px-2 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {section}
                </div>
                <div className="space-y-1">
                  {sectionItems.map((item) => {
                    const itemIndex = items.findIndex((entry) => entry.id === item.id);
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.id}
                        type="button"
                        variant="ghost"
                        onMouseEnter={() => setActiveIndex(itemIndex)}
                        onClick={() => void handleSelect(item)}
                        className={cn(
                          "h-auto w-full justify-start rounded-lg px-3 py-3 text-left",
                          itemIndex === activeIndex && "bg-accent text-accent-foreground",
                        )}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-background">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{item.label}</span>
                          <span className="block truncate text-xs text-muted-foreground">{item.subtitle}</span>
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-10 text-center">
              <div className="text-sm font-medium">No matching commands</div>
              <div className="mt-1 text-sm text-muted-foreground">Try a product name, order number, customer email, or a setting like shipping.</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
