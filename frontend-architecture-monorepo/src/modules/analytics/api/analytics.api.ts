import type { AnalyticsOverview } from "../domain/analytics.types";
import { apiClient } from "@/shared/api/client";

export function fetchAnalyticsOverview() {
  return apiClient.get<AnalyticsOverview>("/api/analytics/overview");
}
