import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCustomer, updateCustomer } from "@/api/customers";
import { useAuth } from "@/app/providers/use-auth";
import { OrderHistoryOrderLink } from "@/components/customers/order-history-order-link";
import { LoadingState } from "@/components/feedback/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { Customer } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function CustomerDetailPage() {
  const { customerId } = useParams({ from: "/customers/$customerId" });
  const { hasPermission } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["customers", customerId],
    queryFn: () => fetchCustomer(customerId),
  });
  const [form, setForm] = useState<Customer | null>(null);
  const canEditCustomer = hasPermission("customers.view");

  useEffect(() => {
    if (data) {
      setForm({
        id: data.id,
        name: data.name,
        email: data.email,
        segment: data.segment,
        tags: data.tags,
        priceListId: data.priceListId ?? null,
        lifetimeSpend: data.lifetimeSpend,
        notes: data.notes,
        joinedAt: data.joinedAt,
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: Partial<Customer>) => updateCustomer(customerId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customers"] });
      await queryClient.invalidateQueries({ queryKey: ["customers", customerId] });
    },
  });

  if (isLoading || !data || !form) {
    return <LoadingState label="Loading customer..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={form.name}
        description={form.email}
        actions={
          <Link to="/customers">
            <Button variant="outline">Back to customers</Button>
          </Link>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1.3fr,1fr]">
        <SectionCard title="Order History">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
              <TableBody>
                {data.orderHistory.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <OrderHistoryOrderLink order={order} />
                    </TableCell>
                    <TableCell className="table-cell-muted">{formatDate(order.date)}</TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
        <div className="space-y-6">
          <SectionCard title="Profile" contentClassName="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" disabled={!canEditCustomer} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" disabled={!canEditCustomer} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="segment">Segment</Label>
              <Select
                id="segment"
                disabled={!canEditCustomer}
                value={form.segment}
                onChange={(event) => setForm({ ...form, segment: event.target.value as Customer["segment"] })}
              >
                <option value="VIP">VIP</option>
                <option value="Wholesale">Wholesale</option>
                <option value="At Risk">At Risk</option>
                <option value="New">New</option>
                <option value="Repeat">Repeat</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                disabled={!canEditCustomer}
                value={form.tags.join(", ")}
                onChange={(event) =>
                  setForm({
                    ...form,
                    tags: event.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>
            <div className="rounded-md border px-3 py-2 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Price list</span>
                <span>{data.priceList?.name ?? "Retail default"}</span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Lifetime spend</span>
                <span>{formatCurrency(data.lifetimeSpend)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Joined</span>
                <span>{formatDate(data.joinedAt)}</span>
              </div>
            </div>
            <div className="flex justify-end">
              <Button disabled={!canEditCustomer || mutation.isPending} onClick={() => void mutation.mutateAsync(form)}>
                {mutation.isPending ? "Saving..." : "Save customer"}
              </Button>
            </div>
          </SectionCard>
          <SectionCard title="Notes" contentClassName="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              disabled={!canEditCustomer}
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
            />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
