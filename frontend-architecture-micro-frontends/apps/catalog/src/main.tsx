import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { AuthProvider } from '@commerceos/authentication/providers/auth-provider';
import { AppProviders } from "@commerceos/shared/providers/app-providers";
import { createStandaloneRouter } from "@commerceos/shared/router/standalone";
import CatalogPage from "@commerceos/catalog/screens/catalog.index";
import ProductDetailPage from "@commerceos/catalog/screens/catalog.detail";
import NewProductPage from "@commerceos/catalog/screens/catalog.new";
import "@commerceos/shared/styles/globals.css";

const router = createStandaloneRouter([
  { path: "/catalog", component: CatalogPage },
  { path: "/catalog/new", component: NewProductPage },
  { path: "/catalog/$productId", component: ProductDetailPage },
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
