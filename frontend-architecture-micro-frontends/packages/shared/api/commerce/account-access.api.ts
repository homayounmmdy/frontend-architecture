import type { AccountMember, AccountPermissionPolicy } from "@commerceos/shared/domain/commerce/users.types";
import { apiClient } from "@commerceos/shared/api/client";

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
