import { EmptyState } from "@commerceos/shared/components/feedback/empty-state";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@commerceos/ui/table";
import type { Product } from "../../domain/catalog.types";
import { ProductRow } from "./components/product-row";

interface ProductsTableProps {
  products: Product[];
}

export function ProductsTable({ products }: ProductsTableProps) {
  if (!products.length) {
    return <EmptyState title="No matching products" description="Try adjusting your search or filter controls." />;
  }

  return (
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
        {products.map((product) => (
          <ProductRow key={product.id} product={product} />
        ))}
      </TableBody>
    </Table>
  );
}
