export type InventoryStatus = "healthy" | "low" | "out_of_stock";

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  location: string;
  stockQuantity: number;
  reorderThreshold: number;
  status: InventoryStatus;
}
