import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@commerceos/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  detail: string;
  icon?: ReactNode;
}

export function StatCard({ title, value, detail, icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon ? <div className="text-muted-foreground">{icon}</div> : null}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
        <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}
