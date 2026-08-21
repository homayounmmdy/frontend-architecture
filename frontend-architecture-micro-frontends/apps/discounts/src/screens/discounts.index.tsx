import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchDiscounts } from "../api/discounts.api";
import { useAuth } from "@commerceos/authentication/providers/use-auth";
import { LoadingState } from "@commerceos/shared/components/feedback/loading-state";
import { PageHeader } from "@commerceos/shared/components/page-header";
import { SectionCard } from "@commerceos/shared/components/section-card";
import { StatusBadge } from "@commerceos/shared/components/status-badge";
import { Button } from "@commerceos/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@commerceos/ui/table";
import { formatDate } from "@commerceos/shared/lib/utils";

function formatDiscountValue(type: string, value: number) {
  if (type === "percentage") return `${value}%`;
  if (type === "fixed_amount") return `$${value}`;
  return "Free shipping";
}

export default function DiscountsPage() {
  const { hasPermission } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["discounts"],
    queryFn: fetchDiscounts,
  });

  if (isLoading || !data) {
    return <LoadingState label="Loading discounts..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Discounts"
        description="Manage promotional codes and scheduled offers."
        actions={
          hasPermission("discounts.manage") ? (
            <Link to="/discounts/new">
              <Button>Create discount</Button>
            </Link>
          ) : null
        }
      />
      <SectionCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Rules</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((discount) => (
              <TableRow key={discount.id}>
                <TableCell>
                  <Link to="/discounts/$discountId" params={{ discountId: discount.id }} className="font-medium text-primary hover:underline">
                    {discount.code}
                  </Link>
                </TableCell>
                <TableCell>{discount.type.replace("_", " ")}</TableCell>
                <TableCell>{formatDiscountValue(discount.type, discount.value)}</TableCell>
                <TableCell className="table-cell-muted">
                  {discount.rules.minimumSpend ? `Min ${discount.rules.minimumSpend}` : "No minimum"}
                  {discount.rules.eligibleSegments.length ? ` · ${discount.rules.eligibleSegments.join(", ")}` : ""}
                  {discount.rules.eligibleCategories.length ? ` · ${discount.rules.eligibleCategories.join(", ")}` : ""}
                </TableCell>
                <TableCell>
                  <StatusBadge status={discount.active ? "active" : "inactive"} />
                </TableCell>
                <TableCell>{discount.usageCount}</TableCell>
                <TableCell>{formatDate(discount.startDate)}</TableCell>
                <TableCell>{formatDate(discount.endDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
