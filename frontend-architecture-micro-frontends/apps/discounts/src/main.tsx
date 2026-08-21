import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { AuthProvider } from "@commerceos/authentication/providers/auth-provider";
import { AppProviders } from "@commerceos/shared/providers/app-providers";
import { createStandaloneRouter } from "@commerceos/shared/router/standalone";
import DiscountsPage from "@commerceos/discounts/screens/discounts.index";
import DiscountDetailPage from "@commerceos/discounts/screens/discounts.detail";
import NewDiscountPage from "@commerceos/discounts/screens/discounts.new";
import "@commerceos/shared/styles/globals.css";

const router = createStandaloneRouter([
  { path: "/discounts", component: DiscountsPage },
  { path: "/discounts/new", component: NewDiscountPage },
  { path: "/discounts/$discountId", component: DiscountDetailPage },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </AppProviders>
  </React.StrictMode>,
);
