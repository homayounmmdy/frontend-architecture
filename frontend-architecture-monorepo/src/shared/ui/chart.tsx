import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/shared/lib/utils";

export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode;
    color?: string;
  };
};

interface ChartContextValue {
  config: ChartConfig;
}

const ChartContext = React.createContext<ChartContextValue | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

export function ChartContainer({
  id,
  className,
  config,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
}) {
  const chartId = React.useId().replace(/:/g, "");
  const resolvedId = id ?? `chart-${chartId}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={resolvedId}
        className={cn(
          "flex aspect-auto h-[320px] w-full items-center justify-center text-xs",
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
          "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/60",
          "[&_.recharts-layer.recharts-pie-sector]:outline-none",
          "[&_.recharts-legend-item-text]:text-foreground",
          "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border/60",
          "[&_.recharts-radial-bar-background-sector]:fill-muted",
          "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border",
          "[&_.recharts-sector[stroke='#fff']]:stroke-background",
          "[&_.recharts-surface]:overflow-visible",
          className,
        )}
        style={
          Object.entries(config).reduce(
            (style, [key, value]) => ({
              ...style,
              [`--color-${key}`]: value.color,
            }),
            {} as React.CSSProperties,
          )
        }
        {...props}
      >
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

export const ChartTooltip = RechartsPrimitive.Tooltip;

type ChartTooltipPayloadItem = {
  color?: string;
  dataKey?: string | number;
  name?: string | number;
  payload?: Record<string, unknown> & { fill?: string };
  value?: number | string;
};

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: ChartTooltipPayloadItem[];
  label?: string | number;
  className?: string;
  hideLabel?: boolean;
  indicator?: "dot" | "line";
  formatter?: (
    value: number | string | undefined,
    name: string | number | undefined,
    item: ChartTooltipPayloadItem,
    payload: ChartTooltipPayloadItem[],
    label: string | number | undefined,
  ) => React.ReactNode;
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  formatter,
  hideLabel = false,
  indicator = "dot",
}: ChartTooltipContentProps) {
  const { config } = useChart();

  if (!active || !payload?.length) {
    return null;
  }

  const labelItem = payload[0];
  const labelText =
    typeof label === "string" || typeof label === "number"
      ? label
      : typeof labelItem?.name === "string" || typeof labelItem?.name === "number"
        ? labelItem.name
        : null;

  return (
    <div className={cn("min-w-[180px] rounded-lg border bg-card px-3 py-2 text-sm shadow-lg", className)}>
      {!hideLabel && labelText !== null ? <div className="mb-2 font-medium text-foreground">{labelText}</div> : null}
      <div className="space-y-1.5">
        {payload.map((item) => {
          const key = String(item.dataKey ?? item.name ?? "value");
          const itemConfig = config[key] ?? config[String(item.name)] ?? config.value;
          const color = item.color ?? item.payload?.fill ?? itemConfig?.color ?? "currentColor";
          const value = item.value;

          return (
            <div key={key} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span
                  className={cn("shrink-0 rounded-full", indicator === "dot" ? "h-2.5 w-2.5" : "h-0.5 w-3")}
                  style={{ backgroundColor: color }}
                />
                <span>{itemConfig?.label ?? item.name ?? key}</span>
              </div>
              <span className="font-medium text-foreground">
                {formatter ? formatter(value, item.name, item, payload, label) : value?.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const ChartLegend = RechartsPrimitive.Legend;

type ChartLegendPayloadItem = {
  color?: string;
  dataKey?: string | number;
  value?: string | number;
};

export function ChartLegendContent({
  payload,
  className,
}: {
  payload?: ChartLegendPayloadItem[];
  className?: string;
}) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-4 text-sm text-muted-foreground", className)}>
      {payload.map((item) => {
        const key = String(item.dataKey ?? item.value ?? "value");
        const itemConfig = config[key] ?? config[String(item.value)] ?? config.value;
        const color = item.color ?? itemConfig?.color ?? "currentColor";

        return (
          <div key={key} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span>{itemConfig?.label ?? item.value ?? key}</span>
          </div>
        );
      })}
    </div>
  );
}
