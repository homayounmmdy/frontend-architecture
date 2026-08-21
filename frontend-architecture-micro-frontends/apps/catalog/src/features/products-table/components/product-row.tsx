import { StatusBadge } from "@commerceos/shared/components/status-badge";
import { TableCell, TableRow } from "@commerceos/ui/table";
import { formatCurrency } from "@commerceos/shared/lib/utils";
import type { Product } from "../../../domain/catalog.types";
import { ProductImageNameCell } from "./product-image-name-cell";

interface ProductRowProps {
  product: Product;
}

export function ProductRow({ product }: ProductRowProps) {
  return (
    <TableRow key={product.id}>
      <ProductImageNameCell product={product} />
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
  );
}
