import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../api/orders.api";
import { EmptyState } from "@commerceos/shared/components/feedback/empty-state";
import { LoadingState } from "@commerceos/shared/components/feedback/loading-state";
import { PageHeader } from "@commerceos/shared/components/page-header";
import { SectionCard } from "@commerceos/shared/components/section-card";
import { StatusBadge } from "@commerceos/shared/components/status-badge";
import { Select } from "@commerceos/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@commerceos/ui/table";
import { formatCurrency, formatDate } from "@commerceos/shared/lib/utils";

export default function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });
  const [status, setStatus] = useState("all");

  const filtered = useMemo(
    () => (data ?? []).filter((order) => status === "all" || order.status === status),
    [data, status],
  );

  if (isLoading) {
    return <LoadingState label="Loading orders..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" description="Review order flow, fulfillment status, and customer purchases." />
      <SectionCard contentClassName="space-y-4">
        <div className="max-w-xs">
          <Select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </Select>
        </div>
        {filtered.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price List</TableHead>
                <TableHead>Shipment</TableHead>
                <TableHead>Aftercare</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link to="/orders/$orderId" params={{ orderId: order.id }} className="font-medium text-primary hover:underline">
                      {order.orderNumber}
                    </Link>
                  </TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell className="table-cell-muted">{formatDate(order.date)}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="table-cell-muted">{order.appliedPriceListName ?? "Retail default"}</TableCell>
                  <TableCell>
                    <div className="text-sm">{order.shipment.carrier}</div>
                    <div className="table-cell-muted">
                      {order.shipment.status.replace("_", " ")} · {order.shipment.trackingNumber}
                    </div>
                  </TableCell>
                  <TableCell className="table-cell-muted">
                    {order.returns.length} returns · {order.refunds.length} refunds
                  </TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState title="No orders in this status" description="Try a different status filter." />
        )}
      </SectionCard>
    </div>
  );
}
