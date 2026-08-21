import type { Account, AccountMember, AccountPermissionPolicy, SettingsData } from "@/types";
import { apiClient } from "@/api/client";

export function fetchAccount(accountId: string) {
  return apiClient.get<Account>(`/api/accounts/${accountId}`);
}

export function updateAccount(accountId: string, payload: Partial<Account>) {
  return apiClient.patch<Account>(`/api/accounts/${accountId}`, payload);
}

export function fetchAccountUsers(accountId: string) {
  return apiClient.get<AccountMember[]>(`/api/accounts/${accountId}/users`);
}

export function fetchAccountUser(accountId: string, userId: string) {
  return apiClient.get<AccountMember>(`/api/accounts/${accountId}/users/${userId}`);
}

export function updateAccountUser(accountId: string, userId: string, payload: Partial<AccountMember>) {
  return apiClient.patch<AccountMember>(`/api/accounts/${accountId}/users/${userId}`, payload);
}

export function fetchAccountPermissions(accountId: string) {
  return apiClient.get<AccountPermissionPolicy>(`/api/accounts/${accountId}/permissions`);
}

export function updateAccountPermissions(accountId: string, payload: Partial<AccountPermissionPolicy>) {
  return apiClient.patch<AccountPermissionPolicy>(`/api/accounts/${accountId}/permissions`, payload);
}

export function fetchAccountSettings(accountId: string) {
  return apiClient.get<SettingsData>(`/api/accounts/${accountId}/settings`);
}

export function updateAccountSettings(accountId: string, payload: Partial<SettingsData>) {
  return apiClient.patch<SettingsData>(`/api/accounts/${accountId}/settings`, payload);
}
