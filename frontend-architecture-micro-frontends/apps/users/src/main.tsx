import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { AuthProvider } from "@commerceos/authentication/providers/auth-provider";
import { AppProviders } from "@commerceos/shared/providers/app-providers";
import { createStandaloneRouter } from "@commerceos/shared/router/standalone";
import ProfilePage from "@commerceos/users/screens/profile/profile.index";
import RolesPermissionsPage from "@commerceos/users/screens/users/roles-permissions";
import UserDetailPage from "@commerceos/users/screens/users/users.detail";
import UsersPage from "@commerceos/users/screens/users/users.index";
import "@commerceos/shared/styles/globals.css";

const router = createStandaloneRouter([
  { path: "/users", component: UsersPage },
  { path: "/users/$userId", component: UserDetailPage },
  { path: "/users/roles-permissions", component: RolesPermissionsPage },
  { path: "/profile", component: ProfilePage },
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
