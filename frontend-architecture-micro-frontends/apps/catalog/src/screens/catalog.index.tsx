import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api/products.api";
import { useAuth } from "@commerceos/authentication/providers/use-auth";
import { LoadingState } from "@commerceos/shared/components/feedback/loading-state";
import { useCatalogFilters } from "../hooks/use-catalog-filters";
import { PageHeader } from "@commerceos/shared/components/page-header";
import { SectionCard } from "@commerceos/shared/components/section-card";
import { Button } from "@commerceos/ui/button";
import { SearchFilters } from "../features/search-filters/search-filters";
import { ProductsTable } from "../features/products-table/products-table";

export default function CatalogPage() {
  const { hasPermission } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [collectionId, setCollectionId] = useState("all");
  const { categories, collections, filteredProducts } = useCatalogFilters(data, {
    search,
    category,
    status,
    collectionId,
  });

  if (isLoading) {
    return <LoadingState label="Loading catalog..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Catalog"
        description="Manage product details, pricing, and merchandising status."
        actions={
          hasPermission("catalog.edit") ? (
            <Link to="/catalog/new">
              <Button>New Product</Button>
            </Link>
          ) : null
        }
      />
      <SectionCard contentClassName="space-y-4">
        <SearchFilters
          search={search}
          category={category}
          status={status}
          collectionId={collectionId}
          categories={categories}
          collections={collections}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onStatusChange={setStatus}
          onCollectionIdChange={setCollectionId}
        />
        <ProductsTable products={filteredProducts} />
      </SectionCard>
    </div>
  );
}
