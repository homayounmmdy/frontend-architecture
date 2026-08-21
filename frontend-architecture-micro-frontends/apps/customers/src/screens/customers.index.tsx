import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchCustomers } from "../api/customers.api";
import { EmptyState } from "@commerceos/shared/components/feedback/empty-state";
import { LoadingState } from "@commerceos/shared/components/feedback/loading-state";
import { PageHeader } from "@commerceos/shared/components/page-header";
import { SectionCard } from "@commerceos/shared/components/section-card";
import { StatusBadge } from "@commerceos/shared/components/status-badge";
import { Input } from "@commerceos/ui/input";
import { Select } from "@commerceos/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@commerceos/ui/table";
import { formatCurrency, formatDate } from "@commerceos/shared/lib/utils";

export default function CustomersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });
  const [search, setSearch] = useState("");
  const [segment, setSegment] = useState("all");

  const filtered = useMemo(
    () =>
      (data ?? []).filter((customer) => {
        const matchesSearch = `${customer.name} ${customer.email}`.toLowerCase().includes(search.toLowerCase());
        const matchesSegment = segment === "all" || customer.segment === segment;
        return matchesSearch && matchesSegment;
      }),
    [data, search, segment],
  );

  if (isLoading) {
    return <LoadingState label="Loading customers..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Customers" description="Browse customer records, spend, and order activity." />
      <SectionCard contentClassName="space-y-4">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr),220px]">
          <Input placeholder="Search by customer name or email" value={search} onChange={(event) => setSearch(event.target.value)} />
          <Select value={segment} onChange={(event) => setSegment(event.target.value)}>
            <option value="all">All segments</option>
            <option value="VIP">VIP</option>
            <option value="Wholesale">Wholesale</option>
            <option value="At Risk">At Risk</option>
            <option value="New">New</option>
            <option value="Repeat">Repeat</option>
          </Select>
        </div>
        {filtered.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Segment</TableHead>
                <TableHead>Price List</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Lifetime Spend</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Link to="/customers/$customerId" params={{ customerId: customer.id }} className="font-medium text-primary hover:underline">
                      {customer.name}
                    </Link>
                  </TableCell>
                  <TableCell className="table-cell-muted">{customer.email}</TableCell>
                  <TableCell>
                    <StatusBadge status={customer.segment} />
                  </TableCell>
                  <TableCell className="table-cell-muted">{customer.priceList?.name ?? "Retail default"}</TableCell>
                  <TableCell>{customer.tags.join(", ")}</TableCell>
                  <TableCell>{formatCurrency(customer.lifetimeSpend)}</TableCell>
                  <TableCell>{formatDate(customer.joinedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState title="No customers found" description="Try a different search query." />
        )}
      </SectionCard>
    </div>
  );
}
