import { Badge } from "@commerceos/ui/badge";

type Tone = "default" | "success" | "warning" | "danger" | "info";

const statusToneMap: Record<string, Tone> = {
  active: "success",
  draft: "default",
  archived: "warning",
  low: "warning",
  healthy: "success",
  out_of_stock: "danger",
  pending: "warning",
  paid: "success",
  processing: "info",
  fulfilled: "success",
  cancelled: "danger",
  refunded: "warning",
  label_created: "default",
  in_transit: "info",
  delivered: "success",
  delayed: "warning",
  requested: "warning",
  received: "info",
  restocked: "success",
  approved: "info",
  shipped: "success",
  vip: "info",
  wholesale: "info",
  at_risk: "danger",
  new: "default",
  repeat: "success",
  inactive: "default",
};

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toLowerCase().replace(/\s+/g, "_");
  return <Badge variant={statusToneMap[normalized] ?? "default"}>{status.replace(/_/g, " ")}</Badge>;
}
