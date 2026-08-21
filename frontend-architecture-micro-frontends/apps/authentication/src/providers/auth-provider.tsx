import { type PropsWithChildren, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSession, login, logout, switchAccount } from "../api/auth.api";
import { AuthContext, type AuthContextValue } from "./use-auth";
import { clearStoredAuthToken, getStoredAuthToken, setStoredAuthToken } from "@commerceos/shared/lib/auth-storage";
import { getViewPermissionForPath, ORDERED_APP_PATHS } from "@commerceos/shared/permissions/permissions";
import type { PermissionKey } from "@commerceos/shared/domain/commerce/users.types";

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const sessionQuery = useQuery({
    queryKey: ["auth", "session"],
    queryFn: async () => {
      if (!getStoredAuthToken()) return null;
      try {
        return await fetchSession();
      } catch {
        clearStoredAuthToken();
        return null;
      }
    },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async (session) => {
      setStoredAuthToken(session.token);
      queryClient.setQueryData(["auth", "session"], session);
      await queryClient.invalidateQueries();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      clearStoredAuthToken();
      queryClient.setQueryData(["auth", "session"], null);
      await queryClient.invalidateQueries();
    },
  });

  const switchAccountMutation = useMutation({
    mutationFn: switchAccount,
    onSuccess: async (session) => {
      setStoredAuthToken(session.token);
      queryClient.setQueryData(["auth", "session"], session);
      await queryClient.invalidateQueries();
    },
  });

  const value = useMemo<AuthContextValue>(() => {
    const session = sessionQuery.data ?? null;

    const hasPermission = (permission: PermissionKey) => {
      if (!session) return false;
      return session.activeRole === "account_owner" || session.activePermissions.includes(permission);
    };

    const getFallbackPath = () =>
      ORDERED_APP_PATHS.find((path) => hasPermission(getViewPermissionForPath(path))) ?? "/";

    return {
      session,
      isLoading: sessionQuery.isLoading,
      isAuthenticated: Boolean(session),
      login: async (payload) => loginMutation.mutateAsync(payload),
      logout: async () => {
        await logoutMutation.mutateAsync();
      },
      switchAccount: async (accountId) => switchAccountMutation.mutateAsync({ accountId }),
      hasPermission,
      getFallbackPath,
    };
  }, [loginMutation, logoutMutation, sessionQuery.data, sessionQuery.isLoading, switchAccountMutation]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
