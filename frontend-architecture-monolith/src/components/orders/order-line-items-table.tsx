import { Link, useParams } from "@tanstack/react-router";
import type { OrderLineItem } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

interface OrderLineItemsTableProps {
  items: OrderLineItem[];
  className?: string;
}

export function OrderLineItemsTable({ items, className }: OrderLineItemsTableProps) {
  const {orderId} = useParams({from : '/orders/$orderId'});
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
                search={{orderId}}
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
