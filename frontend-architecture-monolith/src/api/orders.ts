import type { Order } from "@/types";
import { apiClient } from "@/api/client";

export function fetchOrders() {
  return apiClient.get<Order[]>("/api/orders");
}

export function fetchOrder(orderId: string) {
  return apiClient.get<Order>(`/api/orders/${orderId}`);
}

export function updateOrder(orderId: string, payload: Partial<Order>) {
  return apiClient.patch<Order>(`/api/orders/${orderId}`, payload);
}
