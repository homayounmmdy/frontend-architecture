import type { AuthSession } from "@/modules/users/domain/users.types";
import { apiClient } from "@/shared/api/client";

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
