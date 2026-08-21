import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProduct, updateProduct } from "../api/products.api";
import { useAuth } from "@/modules/authentication/providers/use-auth";
import { ProductImageField } from "../components/product-image-field";
import type { Product } from "../domain/catalog.types";
import { LoadingState } from "@/shared/components/feedback/loading-state";
import { ActivityHistoryCard } from "@/shared/components/activity-history-card";
import { PageHeader } from "@/shared/components/page-header";
import { SectionCard } from "@/shared/components/section-card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select } from "@/shared/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { Textarea } from "@/shared/ui/textarea";

function updateVariantField(
  product: Product,
  variantId: string,
  field: "name" | "sku" | "price" | "inventory",
  value: string | number,
) {
  return {
    ...product,
    variants: product.variants.map((variant) =>
      variant.id === variantId ? { ...variant, [field]: value } : variant,
    ),
  };
}

function updateBundleComponentQuantity(product: Product, productId: string, quantity: number) {
  return {
    ...product,
    bundleComponents: (product.bundleComponents ?? []).map((component) =>
      component.productId === productId ? { ...component, quantity } : component,
    ),
  };
}

export default function ProductDetailPage() {
  const { hasPermission } = useAuth();
  const { productId } = useParams({ from: "/catalog/$productId" });
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["products", productId],
    queryFn: () => fetchProduct(productId),
  });
  const [form, setForm] = useState<Product | null>(null);
  const canEditCatalog = hasPermission("catalog.edit");

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: Partial<Product>) => updateProduct(productId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["products", productId] });
    },
  });

  if (isLoading || !form) {
    return <LoadingState label="Loading product..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={form.name}
        description={`Edit product details for ${form.sku}.`}
        actions={
          <Link to="/catalog">
            <Button variant="outline">Back to catalog</Button>
          </Link>
        }
      />
      <SectionCard title="Product Details">
          <form
            className="space-y-6"
            onSubmit={(event) => {
              event.preventDefault();
              void mutation.mutateAsync(form);
            }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>Product Image</Label>
                <ProductImageField
                  imageUrl={form.imageUrl}
                  productName={form.name}
                  disabled={!canEditCatalog}
                  onChange={(imageUrl) => setForm({ ...form, imageUrl })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" disabled={!canEditCatalog} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" disabled={!canEditCatalog} value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" disabled={!canEditCatalog} value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kind">Kind</Label>
                <Select
                  id="kind"
                  disabled={!canEditCatalog}
                  value={form.kind}
                  onChange={(event) => setForm({ ...form, kind: event.target.value as Product["kind"] })}
                >
                  <option value="standard">Standard</option>
                  <option value="bundle">Bundle</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  disabled={!canEditCatalog}
                  value={form.price}
                  onChange={(event) => setForm({ ...form, price: Number(event.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  disabled={!canEditCatalog}
                  value={form.status}
                  onChange={(event) => setForm({ ...form, status: event.target.value as Product["status"] })}
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="inventory">Inventory</Label>
                <Input id="inventory" type="number" value={form.inventory} disabled />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                disabled={!canEditCatalog}
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Collections</Label>
              <div className="rounded-md border px-3 py-2 text-sm text-muted-foreground">
                {(form.collections ?? []).map((collection) => collection.name).join(", ") || "No collections assigned"}
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <Label>Price Lists</Label>
                <p className="text-sm text-muted-foreground">
                  Wholesale and customer-specific pricing now lives next to the retail summary price.
                </p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Price list</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(form.priceListPrices ?? []).length ? (
                    form.priceListPrices?.map((entry) => (
                      <TableRow key={entry.priceListId}>
                        <TableCell>{entry.priceListName}</TableCell>
                        <TableCell>{entry.price}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="table-cell-muted">
                        No price list overrides configured.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {form.kind === "bundle" ? (
              <div className="space-y-3">
                <div>
                  <Label>Bundle Components</Label>
                  <p className="text-sm text-muted-foreground">
                    Bundle inventory is derived from component stock, not from a dedicated bundle location.
                  </p>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead>Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(form.bundleComponents ?? []).map((component) => (
                      <TableRow key={component.productId}>
                        <TableCell>{component.productName}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            disabled={!canEditCatalog}
                            value={component.quantity}
                            onChange={(event) =>
                              setForm(updateBundleComponentQuantity(form, component.productId, Number(event.target.value)))
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : null}
            {form.kind === "standard" ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Variants</Label>
                    <p className="text-sm text-muted-foreground">
                      Variant price and inventory now live alongside parent summary fields.
                    </p>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Variant</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Inventory</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {form.variants.map((variant) => (
                      <TableRow key={variant.id}>
                        <TableCell>
                          <Input
                            disabled={!canEditCatalog}
                            value={variant.name}
                            onChange={(event) => setForm(updateVariantField(form, variant.id, "name", event.target.value))}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            disabled={!canEditCatalog}
                            value={variant.sku}
                            onChange={(event) => setForm(updateVariantField(form, variant.id, "sku", event.target.value))}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            disabled={!canEditCatalog}
                            value={variant.price}
                            onChange={(event) =>
                              setForm(updateVariantField(form, variant.id, "price", Number(event.target.value)))
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            disabled={!canEditCatalog}
                            value={variant.inventory}
                            onChange={(event) =>
                              setForm(updateVariantField(form, variant.id, "inventory", Number(event.target.value)))
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : null}
            <div className="flex justify-end">
              <Button type="submit" disabled={mutation.isPending || !canEditCatalog}>
                {mutation.isPending ? "Saving..." : "Save product"}
              </Button>
            </div>
          </form>
      </SectionCard>
      <ActivityHistoryCard entries={form.activityHistory} />
    </div>
  );
}
