import type { AuthSession } from "@commerceos/shared/domain/commerce/users.types";
import { apiClient } from "@commerceos/shared/api/client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SwitchAccountPayload {
  accountId: string;
}

export function fetchSession() {
  return apiClient.get<AuthSession>("/api/auth/session");
}

export function login(payload: LoginPayload) {
  return apiClient.post<AuthSession>("/api/auth/login", payload);
}

export function logout() {
  return apiClient.post<void>("/api/auth/logout", {});
}

export function switchAccount(payload: SwitchAccountPayload) {
  return apiClient.post<AuthSession>("/api/auth/switch-account", payload);
}
