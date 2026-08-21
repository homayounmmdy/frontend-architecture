import type { SettingsData } from "@/types";
import { apiClient } from "@/api/client";

export function fetchSettings() {
  return apiClient.get<SettingsData>("/api/settings");
}

export function updateSettings(payload: Partial<SettingsData>) {
  return apiClient.patch<SettingsData>("/api/settings", payload);
}
