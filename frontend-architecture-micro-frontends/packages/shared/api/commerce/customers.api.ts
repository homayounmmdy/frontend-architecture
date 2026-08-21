import type { Customer, CustomerDetail } from "@commerceos/shared/domain/commerce/customers.types";
import { apiClient } from "@commerceos/shared/api/client";

export function fetchCustomers() {
  return apiClient.get<Customer[]>("/api/customers");
}

export function fetchCustomer(customerId: string) {
  return apiClient.get<CustomerDetail>(`/api/customers/${customerId}`);
}

export function updateCustomer(customerId: string, payload: Partial<Customer>) {
  return apiClient.patch<CustomerDetail>(`/api/customers/${customerId}`, payload);
}
