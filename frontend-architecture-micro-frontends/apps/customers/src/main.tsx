import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { AuthProvider } from "@commerceos/authentication/providers/auth-provider";
import { AppProviders } from "@commerceos/shared/providers/app-providers";
import { createStandaloneRouter } from "@commerceos/shared/router/standalone";
import CustomersPage from "@commerceos/customers/screens/customers.index";
import CustomerDetailPage from "@commerceos/customers/screens/customers.detail";
import "@commerceos/shared/styles/globals.css";

const router = createStandaloneRouter([
  { path: "/customers", component: CustomersPage },
  { path: "/customers/$customerId", component: CustomerDetailPage },
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
