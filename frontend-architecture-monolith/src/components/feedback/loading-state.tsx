export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return <div className="rounded-lg border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">{label}</div>;
}
