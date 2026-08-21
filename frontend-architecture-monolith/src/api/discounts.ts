import type { Discount } from "@/types";
import { apiClient } from "@/api/client";

export function fetchDiscounts() {
  return apiClient.get<Discount[]>("/api/discounts");
}

export function fetchDiscount(discountId: string) {
  return apiClient.get<Discount>(`/api/discounts/${discountId}`);
}

export function createDiscount(payload: Omit<Discount, "id" | "usageCount">) {
  return apiClient.post<Discount>("/api/discounts", payload);
}

export function updateDiscount(discountId: string, payload: Partial<Discount>) {
  return apiClient.patch<Discount>(`/api/discounts/${discountId}`, payload);
}
