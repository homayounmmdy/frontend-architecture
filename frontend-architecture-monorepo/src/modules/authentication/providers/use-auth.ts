import { createContext, useContext } from "react";
import type { AuthSession, PermissionKey } from "@/modules/users/domain/users.types";
import type { LoginPayload } from "../api/auth.api";

export interface AuthContextValue {
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<AuthSession>;
  logout: () => Promise<void>;
  switchAccount: (accountId: string) => Promise<AuthSession>;
  hasPermission: (permission: PermissionKey) => boolean;
  getFallbackPath: () => string;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
