import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchInventory, updateInventory } from "../api/inventory.api";
import { useAuth } from "@commerceos/authentication/providers/use-auth";
import { LoadingState } from "@commerceos/shared/components/feedback/loading-state";
import { PageHeader } from "@commerceos/shared/components/page-header";
import { SectionCard } from "@commerceos/shared/components/section-card";
import { StatusBadge } from "@commerceos/shared/components/status-badge";
import { Button } from "@commerceos/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@commerceos/ui/dialog";
import { Input } from "@commerceos/ui/input";
import { Label } from "@commerceos/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@commerceos/ui/table";
import type { InventoryItem } from "../domain/inventory.types";

export default function InventoryPage() {
  const { hasPermission } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["inventory"],
    queryFn: fetchInventory,
  });
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [nextQuantity, setNextQuantity] = useState<number>(0);
  const canEditInventory = hasPermission("inventory.edit");

  const mutation = useMutation({
    mutationFn: ({ itemId, stockQuantity }: { itemId: string; stockQuantity: number }) =>
      updateInventory(itemId, { stockQuantity }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["inventory"] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });

  if (isLoading || !data) {
    return <LoadingState label="Loading inventory..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" description="Track stock levels across warehouse locations and adjust counts." />
      <SectionCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Reorder</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow
                key={item.id}
                className={
                  item.status !== "healthy"
                    ? "bg-amber-50/60 hover:bg-amber-50 dark:bg-amber-500/10 dark:hover:bg-amber-500/14"
                    : undefined
                }
              >
                <TableCell className="font-medium">{item.productName}</TableCell>
                <TableCell className="table-cell-muted">{item.sku}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.stockQuantity}</TableCell>
                <TableCell>{item.reorderThreshold}</TableCell>
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item);
                          setNextQuantity(item.stockQuantity);
                        }}
                        disabled={!canEditInventory}
                      >
                        Adjust
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adjust stock</DialogTitle>
                        <DialogDescription>Update stock quantity for {item.productName} in {item.location}.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="stockQuantity">Stock quantity</Label>
                          <Input
                            id="stockQuantity"
                            type="number"
                            value={selectedItem?.id === item.id ? nextQuantity : item.stockQuantity}
                            onChange={(event) => setNextQuantity(Number(event.target.value))}
                          />
                        </div>
                        <div className="flex justify-end">
                          <Button
                            onClick={() => void mutation.mutateAsync({ itemId: item.id, stockQuantity: nextQuantity })}
                            disabled={mutation.isPending || !canEditInventory}
                          >
                            {mutation.isPending ? "Saving..." : "Save adjustment"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
