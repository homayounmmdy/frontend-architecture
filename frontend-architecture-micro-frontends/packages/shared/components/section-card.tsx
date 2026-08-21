import type { ReactNode } from "react";
import { cn } from "@commerceos/ui/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@commerceos/ui/card";

interface SectionCardProps {
  id?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function SectionCard({
  id,
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
}: SectionCardProps) {
  const hasHeader = title || description || actions;

  return (
    <Card id={id} className={className}>
      {hasHeader ? (
        <CardHeader className={actions ? "flex flex-row items-start justify-between gap-4 space-y-0" : undefined}>
          <div className="space-y-1">
            {title ? <CardTitle>{title}</CardTitle> : null}
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </CardHeader>
      ) : null}
      <CardContent className={cn(!hasHeader && "pt-6", contentClassName)}>{children}</CardContent>
    </Card>
  );
}
