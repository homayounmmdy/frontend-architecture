import { Link } from "@tanstack/react-router";
import { TableCell } from "@commerceos/ui/table";
import type { Product } from "../../../domain/catalog.types";

interface ProductImageNameCellProps {
  product: Product;
}

export function ProductImageNameCell({ product }: ProductImageNameCellProps) {
  return (
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
  );
}
