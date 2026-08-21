import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../api/products.api";
import { useAuth } from "@/modules/authentication/providers/use-auth";
import { ProductImageField } from "../components/product-image-field";
import { PageHeader } from "@/shared/components/page-header";
import { SectionCard } from "@/shared/components/section-card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import type { Product } from "../domain/catalog.types";

function buildInitialProduct(): Omit<Product, "id"> {
  return {
    name: "",
    sku: "",
    category: "",
    description: "",
    imageUrl: null,
    kind: "standard",
    price: 0,
    status: "draft",
    inventory: 0,
    collectionIds: [],
    collections: [],
    variants: [],
    bundleComponents: [],
    priceListPrices: [],
    activityHistory: [],
  };
}

export default function NewProductPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { hasPermission } = useAuth();
  const [form, setForm] = useState<Omit<Product, "id">>(buildInitialProduct());
  const canEditCatalog = hasPermission("catalog.edit");

  const mutation = useMutation({
    mutationFn: (payload: Omit<Product, "id">) => createProduct(payload),
    onSuccess: async (created) => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
      await navigate({ to: "/catalog/$productId", params: { productId: created.id } });
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Product"
        description="Create a product entry and then refine variants, bundles, and pricing."
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
                productName={form.name || "New product"}
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
              <Input
                id="category"
                disabled={!canEditCatalog}
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
              />
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
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={
                !canEditCatalog ||
                mutation.isPending ||
                !form.name.trim() ||
                !form.sku.trim() ||
                !form.category.trim()
              }
            >
              {mutation.isPending ? "Saving..." : "Create product"}
            </Button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}
