import type { AuditLogEntry } from "@/shared/domain/audit-log.types";
import { SectionCard } from "@/shared/components/section-card";

interface ActivityHistoryCardProps {
  entries?: AuditLogEntry[];
}

export function ActivityHistoryCard({ entries = [] }: ActivityHistoryCardProps) {
  return (
    <SectionCard title="Activity History" contentClassName="space-y-3">
      {entries.map((entry) => (
        <div key={entry.id} className="rounded-md border p-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="font-medium capitalize">{entry.action.replace(/_/g, " ")}</span>
            <span className="text-muted-foreground">{entry.timestamp}</span>
          </div>
          <div className="text-muted-foreground">{entry.summary}</div>
          <div className="text-xs text-muted-foreground">by {entry.actor}</div>
        </div>
      ))}
    </SectionCard>
  );
}
