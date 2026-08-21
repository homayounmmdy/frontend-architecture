import type { Account, SettingsData } from "../domain/settings.types";
import { apiClient } from "@commerceos/shared/api/client";

export function fetchAccount(accountId: string) {
  return apiClient.get<Account>(`/api/accounts/${accountId}`);
}

export function updateAccount(accountId: string, payload: Partial<Account>) {
  return apiClient.patch<Account>(`/api/accounts/${accountId}`, payload);
}

export function fetchAccountSettings(accountId: string) {
  return apiClient.get<SettingsData>(`/api/accounts/${accountId}/settings`);
}

export function updateAccountSettings(accountId: string, payload: Partial<SettingsData>) {
  return apiClient.patch<SettingsData>(`/api/accounts/${accountId}/settings`, payload);
}
