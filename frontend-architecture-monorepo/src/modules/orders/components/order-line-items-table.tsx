import { Link } from "@tanstack/react-router";
import type { OrderLineItem } from "../domain/orders.types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";
import { formatCurrency } from "@/shared/lib/utils";

interface OrderLineItemsTableProps {
  items: OrderLineItem[];
  className?: string;
}

export function OrderLineItemsTable({ items, className }: OrderLineItemsTableProps) {
  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <Link
                to="/catalog/$productId"
                params={{ productId: item.productId }}
                className="font-medium text-primary hover:underline"
              >
                {item.productName}
              </Link>
            </TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>{formatCurrency(item.price)}</TableCell>
            <TableCell>{formatCurrency(item.quantity * item.price)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
