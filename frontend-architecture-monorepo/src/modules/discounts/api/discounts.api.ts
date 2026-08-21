import type { Discount } from "../domain/discounts.types";
import { apiClient } from "@/shared/api/client";

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
