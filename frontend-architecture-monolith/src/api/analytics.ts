import type { AnalyticsOverview } from "@/types";
import { apiClient } from "@/api/client";

export function fetchAnalyticsOverview() {
  return apiClient.get<AnalyticsOverview>("/api/analytics/overview");
}
