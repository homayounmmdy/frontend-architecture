import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDiscount } from "../api/discounts.api";
import { useAuth } from "@commerceos/authentication/providers/use-auth";
import { DiscountForm, type DiscountFormValues } from "../components/discount-form";
import { PageHeader } from "@commerceos/shared/components/page-header";
import { serializeDiscountValues } from "../utils/discounts";

export default function NewDiscountPage() {
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: DiscountFormValues) => createDiscount(serializeDiscountValues(values)),
    onSuccess: async (created) => {
      await queryClient.invalidateQueries({ queryKey: ["discounts"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
      await navigate({ to: "/discounts/$discountId", params: { discountId: created.id } });
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader title="New Discount" description="Create a mock discount offer for workshop flows." />
      <DiscountForm
        disabled={!hasPermission("discounts.manage")}
        submitLabel={mutation.isPending ? "Saving..." : "Create discount"}
        onSubmit={async (values) => {
          await mutation.mutateAsync(values);
        }}
      />
    </div>
  );
}
