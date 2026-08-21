import { Cell, Pie, PieChart } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@commerceos/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@commerceos/ui/chart";
import { formatCurrency } from "@commerceos/shared/lib/utils";

const CATEGORY_COLORS = ["hsl(217 91% 60%)", "hsl(199 89% 48%)", "hsl(172 66% 50%)", "hsl(38 92% 50%)", "hsl(262 83% 58%)"];

interface MerchandisingRevenueMixChartProps {
  data: Array<{
    label: string;
    value: number;
  }>;
}

export function MerchandisingRevenueMixChart({ data }: MerchandisingRevenueMixChartProps) {
  const categoryRevenue = data.map((item, index) => ({
    ...item,
    fill: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Merchandising Revenue Mix</CardTitle>
        <CardDescription>Category contribution to paid revenue.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <ChartContainer config={{ value: { label: "Revenue" } }} className="h-[280px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel formatter={(value) => formatCurrency(Number(value))} />} />
            <Pie data={categoryRevenue} dataKey="value" nameKey="label" innerRadius={68} outerRadius={104} paddingAngle={3}>
              {categoryRevenue.map((entry) => (
                <Cell key={entry.label} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="space-y-3">
          {categoryRevenue.map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-lg border px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <span className="text-sm text-muted-foreground">{formatCurrency(item.value)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
