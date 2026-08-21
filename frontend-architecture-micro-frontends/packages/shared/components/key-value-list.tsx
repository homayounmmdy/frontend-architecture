import type { ReactNode } from "react";
import { cn } from "@commerceos/ui/lib/utils";

interface KeyValueListItem {
  label: string;
  value: ReactNode;
}

interface KeyValueListProps {
  items: KeyValueListItem[];
  className?: string;
  rowClassName?: string;
}

export function KeyValueList({ items, className, rowClassName }: KeyValueListProps) {
  return (
    <div className={cn("space-y-3 text-sm", className)}>
      {items.map((item) => (
        <div key={item.label} className={cn("flex items-center justify-between gap-4", rowClassName)}>
          <span className="text-muted-foreground">{item.label}</span>
          <span className="text-right">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
