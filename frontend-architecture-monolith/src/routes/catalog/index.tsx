import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/api/products";
import { useAuth } from "@/app/providers/use-auth";
import { EmptyState } from "@/components/feedback/empty-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { useCatalogFilters } from "@/hooks/use-catalog-filters";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

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
          <div className="grid gap-4 md:grid-cols-4">
            <Input placeholder="Search by product name" value={search} onChange={(event) => setSearch(event.target.value)} />
            <Select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option === "all" ? "All categories" : option}
                </option>
              ))}
            </Select>
            <Select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </Select>
            <Select value={collectionId} onChange={(event) => setCollectionId(event.target.value)}>
              <option value="all">All collections</option>
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </Select>
          </div>

          {filteredProducts.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Kind</TableHead>
                  <TableHead>Variants</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Inventory</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-secondary">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <span className="w-full px-1 text-center text-xs font-medium text-muted-foreground">No image</span>
                          )}
                        </div>
                        <div className="space-y-1">
                          <Link to="/catalog/$productId" params={{ productId: product.id }} className="font-medium text-primary hover:underline">
                            {product.name}
                          </Link>
                          <div className="text-xs text-muted-foreground">
                            {(product.collections ?? []).map((collection) => collection.name).join(", ")}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="table-cell-muted">{product.sku}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="capitalize">{product.kind}</TableCell>
                    <TableCell>{product.variants.length}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>
                      <StatusBadge status={product.status} />
                    </TableCell>
                    <TableCell>{product.inventory}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState title="No matching products" description="Try adjusting your search or filter controls." />
          )}
      </SectionCard>
    </div>
  );
}
