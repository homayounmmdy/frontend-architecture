import type { CustomerSegment } from "@/modules/customers/domain/customers.types";
import type { Discount } from "../domain/discounts.types";
import type { DiscountFormValues } from "../components/discount-form";

export function normalizeDiscountValues(discount?: Discount): DiscountFormValues {
  if (!discount) {
    return {
      code: "",
      type: "percentage",
    value: 10,
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    active: true,
    minimumSpend: 0,
    eligibleSegments: "",
    eligibleCategories: "",
  };
  }

  return {
    code: discount.code,
    type: discount.type,
    value: discount.value,
    startDate: discount.startDate,
    endDate: discount.endDate,
    active: discount.active,
    minimumSpend: discount.rules.minimumSpend,
    eligibleSegments: discount.rules.eligibleSegments.join(", "),
    eligibleCategories: discount.rules.eligibleCategories.join(", "),
  };
}

function splitList(value: string) {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function serializeDiscountValues(values: DiscountFormValues) {
  return {
    code: values.code,
    type: values.type,
    value: values.value,
    startDate: values.startDate,
    endDate: values.endDate,
    active: values.active,
    rules: {
      minimumSpend: values.minimumSpend,
      eligibleSegments: splitList(values.eligibleSegments) as CustomerSegment[],
      eligibleCategories: splitList(values.eligibleCategories),
    },
  };
}
