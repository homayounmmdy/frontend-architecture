import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, createRoute, createRouter } from "@tanstack/react-router";
import { NotFoundComponent, RootComponent } from "@/app/router/root";
import DashboardPage from "@/modules/dashboard/screens/dashboard.index";
import LoginPage from "@/modules/authentication/screens/login/login";
import ProfilePage from "@/modules/users/screens/profile/profile.index";
import RolesPermissionsPage from "@/modules/users/screens/users/roles-permissions";
import UserDetailPage from "@/modules/users/screens/users/users.detail";
import UsersPage from "@/modules/users/screens/users/users.index";
import CatalogPage from "@/modules/catalog/screens/catalog.index";
import NewProductPage from "@/modules/catalog/screens/catalog.new";
import ProductDetailPage from "@/modules/catalog/screens/catalog.detail";
import InventoryPage from "@/modules/inventory/screens/inventory.index";
import OrderDetailPage from "@/modules/orders/screens/orders.detail";
import OrdersPage from "@/modules/orders/screens/orders.index";
import CustomerDetailPage from "@/modules/customers/screens/customers.detail";
import CustomersPage from "@/modules/customers/screens/customers.index";
import DiscountDetailPage from "@/modules/discounts/screens/discounts.detail";
import DiscountsPage from "@/modules/discounts/screens/discounts.index";
import NewDiscountPage from "@/modules/discounts/screens/discounts.new";
import AnalyticsPage from "@/modules/analytics/screens/analytics.index";
import SettingsPage from "@/modules/settings/screens/settings.index";

export interface RouterContext {
  queryClient: QueryClient;
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: DashboardPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalog",
  component: CatalogPage,
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalog/$productId",
  component: ProductDetailPage,
});

const newProductRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalog/new",
  component: NewProductPage,
});

const inventoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/inventory",
  component: InventoryPage,
});

const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders",
  component: OrdersPage,
});

const orderDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders/$orderId",
  component: OrderDetailPage,
});

const customersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/customers",
  component: CustomersPage,
});

const customerDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/customers/$customerId",
  component: CustomerDetailPage,
});

const discountsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/discounts",
  component: DiscountsPage,
});

const newDiscountRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/discounts/new",
  component: NewDiscountPage,
});

const discountDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/discounts/$discountId",
  component: DiscountDetailPage,
});

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analytics",
  component: AnalyticsPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
});

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/users",
  component: UsersPage,
});

const userDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/users/$userId",
  component: UserDetailPage,
});

const rolesPermissionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/users/roles-permissions",
  component: RolesPermissionsPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  catalogRoute,
  newProductRoute,
  productRoute,
  inventoryRoute,
  ordersRoute,
  orderDetailRoute,
  customersRoute,
  customerDetailRoute,
  discountsRoute,
  newDiscountRoute,
  discountDetailRoute,
  analyticsRoute,
  usersRoute,
  userDetailRoute,
  rolesPermissionsRoute,
  profileRoute,
  settingsRoute,
]);

export const router = createRouter({
  routeTree,
  context: {
    queryClient: new QueryClient(),
  },
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
