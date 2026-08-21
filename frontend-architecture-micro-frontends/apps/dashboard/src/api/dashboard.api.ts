import type { DashboardSummary } from "../domain/dashboard.types";
import { apiClient } from "@commerceos/shared/api/client";

export function fetchDashboardSummary() {
  return apiClient.get<DashboardSummary>("/api/dashboard/summary");
}
