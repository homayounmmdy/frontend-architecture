export interface AuditLogEntry {
  id: string;
  entityType: "product" | "order" | "discount";
  entityId: string;
  action: string;
  actor: string;
  timestamp: string;
  summary: string;
}
