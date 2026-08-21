import type { Product } from "../domain/catalog.types";
import { apiClient } from "@/shared/api/client";

export function fetchProducts() {
  return apiClient.get<Product[]>("/api/products");
}

export function fetchProduct(productId: string) {
  return apiClient.get<Product>(`/api/products/${productId}`);
}

export function createProduct(payload: Omit<Product, "id">) {
  return apiClient.post<Product>("/api/products", payload);
}

export function updateProduct(productId: string, payload: Partial<Product>) {
  return apiClient.patch<Product>(`/api/products/${productId}`, payload);
}
