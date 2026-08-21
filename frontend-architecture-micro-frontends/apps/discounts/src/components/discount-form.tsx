import { useState } from "react";
import type { DiscountType } from "../domain/discounts.types";
import { Button } from "@commerceos/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@commerceos/ui/card";
import { Input } from "@commerceos/ui/input";
import { Label } from "@commerceos/ui/label";
import { Select } from "@commerceos/ui/select";
import { Switch } from "@commerceos/ui/switch";

export interface DiscountFormValues {
  code: string;
  type: DiscountType;
  value: number;
  startDate: string;
  endDate: string;
  active: boolean;
  minimumSpend: number;
  eligibleSegments: string;
  eligibleCategories: string;
}

interface DiscountFormProps {
  initialValues?: DiscountFormValues;
  onSubmit: (values: DiscountFormValues) => Promise<void> | void;
  submitLabel: string;
  disabled?: boolean;
}

const defaultValues: DiscountFormValues = {
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

export function DiscountForm({ initialValues, onSubmit, submitLabel, disabled = false }: DiscountFormProps) {
  const [values, setValues] = useState<DiscountFormValues>(initialValues ?? defaultValues);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discount Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                disabled={disabled}
                value={values.code}
                onChange={(event) => setValues((current) => ({ ...current, code: event.target.value.toUpperCase() }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                id="type"
                disabled={disabled}
                value={values.type}
                onChange={(event) => setValues((current) => ({ ...current, type: event.target.value as DiscountType }))}
              >
                <option value="percentage">Percentage</option>
                <option value="fixed_amount">Fixed amount</option>
                <option value="free_shipping">Free shipping</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                type="number"
                min="0"
                disabled={disabled}
                value={values.value}
                onChange={(event) => setValues((current) => ({ ...current, value: Number(event.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="active">Active</Label>
              <div className="flex h-9 items-center">
                <Switch
                  checked={values.active}
                  disabled={disabled}
                  onCheckedChange={(active) => setValues((current) => ({ ...current, active }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start date</Label>
              <Input
                id="startDate"
                type="date"
                disabled={disabled}
                value={values.startDate}
                onChange={(event) => setValues((current) => ({ ...current, startDate: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End date</Label>
              <Input
                id="endDate"
                type="date"
                disabled={disabled}
                value={values.endDate}
                onChange={(event) => setValues((current) => ({ ...current, endDate: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minimumSpend">Minimum spend</Label>
              <Input
                id="minimumSpend"
                type="number"
                min="0"
                disabled={disabled}
                value={values.minimumSpend}
                onChange={(event) => setValues((current) => ({ ...current, minimumSpend: Number(event.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eligibleSegments">Eligible segments</Label>
              <Input
                id="eligibleSegments"
                disabled={disabled}
                value={values.eligibleSegments}
                placeholder="VIP, Wholesale"
                onChange={(event) => setValues((current) => ({ ...current, eligibleSegments: event.target.value }))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="eligibleCategories">Eligible categories</Label>
              <Input
                id="eligibleCategories"
                disabled={disabled}
                value={values.eligibleCategories}
                placeholder="Apparel, Bundles"
                onChange={(event) => setValues((current) => ({ ...current, eligibleCategories: event.target.value }))}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving || disabled}>
              {isSaving ? "Saving..." : submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
