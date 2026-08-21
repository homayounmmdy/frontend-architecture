import { useMemo } from "react";
import type { Product } from "../domain/catalog.types";

export function useCatalogFilters(
  products: Product[] | undefined,
  filters: { search: string; category: string; status: string; collectionId: string },
) {
  const categories = useMemo(
    () => ["all", ...new Set((products ?? []).map((product) => product.category))],
    [products],
  );

  const collections = useMemo(() => {
    const entries = new Map<string, NonNullable<Product["collections"]>[number]>();
    for (const product of products ?? []) {
      for (const collection of product.collections ?? []) {
        entries.set(collection.id, collection);
      }
    }
    return [...entries.values()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return (products ?? []).filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = filters.category === "all" || product.category === filters.category;
      const matchesStatus = filters.status === "all" || product.status === filters.status;
      const matchesCollection =
        filters.collectionId === "all" || product.collectionIds.includes(filters.collectionId);
      return matchesSearch && matchesCategory && matchesStatus && matchesCollection;
    });
  }, [filters.category, filters.collectionId, filters.search, filters.status, products]);

  return {
    categories,
    collections,
    filteredProducts,
  };
}
