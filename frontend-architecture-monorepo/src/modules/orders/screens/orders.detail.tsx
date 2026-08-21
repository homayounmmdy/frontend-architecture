import { Link, useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOrder, updateOrder } from "../api/orders.api";
import { useAuth } from "@/modules/authentication/providers/use-auth";
import type { Order } from "../domain/orders.types";
import { OrderLineItemsTable } from "../components/order-line-items-table";
import { LoadingState } from "@/shared/components/feedback/loading-state";
import { ActivityHistoryCard } from "@/shared/components/activity-history-card";
import { KeyValueList } from "@/shared/components/key-value-list";
import { PageHeader } from "@/shared/components/page-header";
import { SectionCard } from "@/shared/components/section-card";
import { StatusBadge } from "@/shared/components/status-badge";
import { Button } from "@/shared/ui/button";
import { formatCurrency, formatDate } from "@/shared/lib/utils";

export default function OrderDetailPage() {
  const { hasPermission } = useAuth();
  const { orderId } = useParams({ from: "/orders/$orderId" });
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => fetchOrder(orderId),
  });

  const mutation = useMutation({
    mutationFn: (payload: Partial<Order>) => updateOrder(orderId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      await queryClient.invalidateQueries({ queryKey: ["orders", orderId] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
      await queryClient.invalidateQueries({ queryKey: ["analytics", "overview"] });
    },
  });

  if (isLoading || !data) {
    return <LoadingState label="Loading order..." />;
  }

  async function runAction(payload: Partial<Order>) {
    await mutation.mutateAsync(payload);
  }

  const refundedAmount = data.refunds.reduce((sum, refund) => sum + refund.amount, 0);
  const canManageOrders = hasPermission("orders.manage");
  const canRefundOrders = hasPermission("orders.refund");

  return (
    <div className="space-y-6">
      <PageHeader
        title={data.orderNumber}
        description={`Placed on ${formatDate(data.date)} by ${data.customerName}.`}
        actions={
          <>
            <Link to="/orders">
              <Button variant="outline">Back to orders</Button>
            </Link>
            <Button variant="outline" disabled={!canManageOrders} onClick={() => void runAction({ status: "fulfilled" })}>
              Mark fulfilled
            </Button>
            <Button
              variant="outline"
              disabled={!canRefundOrders}
              onClick={() =>
                void runAction({
                  refunds: [
                    ...data.refunds,
                    {
                      id: `refund_${data.refunds.length + 1}`,
                      amount: Math.min(20, data.total),
                      reason: "Partial appeasement refund",
                      createdAt: "2026-04-16",
                    },
                  ],
                })
              }
            >
              Partial refund
            </Button>
            <Button
              variant="outline"
              disabled={!canManageOrders}
              onClick={() =>
                void runAction({
                  returns: [
                    ...data.returns,
                    {
                      id: `return_${data.returns.length + 1}`,
                      productName: data.lineItems[0]?.productName ?? "Order item",
                      quantity: 1,
                      status: "requested",
                      createdAt: "2026-04-16",
                    },
                  ],
                })
              }
            >
              Start return
            </Button>
            <Button
              variant="outline"
              disabled={!canManageOrders}
              onClick={() =>
                void runAction({
                  exchanges: [
                    ...data.exchanges,
                    {
                      id: `exchange_${data.exchanges.length + 1}`,
                      originalProductName: data.lineItems[0]?.productName ?? "Order item",
                      replacementProductName: `${data.lineItems[0]?.productName ?? "Order item"} replacement`,
                      status: "pending",
                      createdAt: "2026-04-16",
                    },
                  ],
                })
              }
            >
              Create exchange
            </Button>
            <Button variant="outline" disabled={!canManageOrders} onClick={() => void runAction({ status: "cancelled", paymentStatus: "refunded" })}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={!canRefundOrders} onClick={() => void runAction({ status: "refunded", paymentStatus: "refunded" })}>
              Refund
            </Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <SectionCard title="Line Items">
            <OrderLineItemsTable items={data.lineItems} />
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Summary">
            <KeyValueList
              items={[
                { label: "Order status", value: <StatusBadge status={data.status} /> },
                { label: "Payment", value: <StatusBadge status={data.paymentStatus} /> },
                { label: "Customer", value: data.customerName },
                { label: "Price list", value: data.appliedPriceListName ?? "Retail default" },
                { label: "Total", value: formatCurrency(data.total) },
                { label: "Refunded", value: formatCurrency(refundedAmount) },
              ]}
            />
          </SectionCard>
          <SectionCard title="Shipping Info" contentClassName="space-y-1 text-sm">
            <div>{data.shippingAddress.name}</div>
            <div>{data.shippingAddress.line1}</div>
            <div>
              {data.shippingAddress.city}, {data.shippingAddress.region} {data.shippingAddress.postalCode}
            </div>
            <div>{data.shippingAddress.country}</div>
          </SectionCard>
          <SectionCard title="Shipment Tracking">
            <KeyValueList
              items={[
                { label: "Carrier", value: data.shipment.carrier },
                { label: "Tracking", value: data.shipment.trackingNumber },
                { label: "Shipment status", value: <StatusBadge status={data.shipment.status} /> },
                { label: "Shipped", value: data.shipment.shippedAt ? formatDate(data.shipment.shippedAt) : "Not shipped yet" },
                {
                  label: "Estimated delivery",
                  value: data.shipment.estimatedDelivery ? formatDate(data.shipment.estimatedDelivery) : "Pending",
                },
              ]}
            />
          </SectionCard>
          <SectionCard title="Returns and Refunds" contentClassName="space-y-4 text-sm">
              <div className="space-y-2">
                <div className="font-medium">Refunds</div>
                {data.refunds.length ? data.refunds.map((refund) => (
                  <div key={refund.id} className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <span>{refund.reason}</span>
                      <span>{formatCurrency(refund.amount)}</span>
                    </div>
                    <div className="text-muted-foreground">{formatDate(refund.createdAt)}</div>
                  </div>
                )) : <div className="text-muted-foreground">No refunds recorded.</div>}
              </div>
              <div className="space-y-2">
                <div className="font-medium">Returns</div>
                {data.returns.length ? data.returns.map((entry) => (
                  <div key={entry.id} className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <span>{entry.productName}</span>
                      <StatusBadge status={entry.status} />
                    </div>
                    <div className="text-muted-foreground">
                      Qty {entry.quantity} · {formatDate(entry.createdAt)}
                    </div>
                  </div>
                )) : <div className="text-muted-foreground">No returns recorded.</div>}
              </div>
              <div className="space-y-2">
                <div className="font-medium">Exchanges</div>
                {data.exchanges.length ? data.exchanges.map((entry) => (
                  <div key={entry.id} className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <span>{entry.originalProductName}</span>
                      <StatusBadge status={entry.status} />
                    </div>
                    <div className="text-muted-foreground">
                      For {entry.replacementProductName} · {formatDate(entry.createdAt)}
                    </div>
                  </div>
                )) : <div className="text-muted-foreground">No exchanges recorded.</div>}
              </div>
          </SectionCard>
          <SectionCard title="Notes" contentClassName="text-sm text-muted-foreground">
            {data.notes || "No notes available."}
          </SectionCard>
          <ActivityHistoryCard entries={data.activityHistory} />
        </div>
      </div>
    </div>
  );
}
