import { Cell, PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@commerceos/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@commerceos/ui/chart";

const SEGMENT_COLORS = ["hsl(217 91% 60%)", "hsl(173 58% 39%)", "hsl(38 92% 50%)", "hsl(262 83% 58%)", "hsl(8 84% 60%)"];

interface CustomerSegmentMixChartProps {
  data: Array<{
    label: string;
    value: number;
  }>;
}

export function CustomerSegmentMixChart({ data }: CustomerSegmentMixChartProps) {
  const customerSegments = data.map((item, index) => ({
    ...item,
    fill: SEGMENT_COLORS[index % SEGMENT_COLORS.length],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Segment Mix</CardTitle>
        <CardDescription>Where your current customer base is concentrated.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[1fr,0.9fr]">
        <ChartContainer config={{ value: { label: "Customers" } }} className="h-[280px]">
          <RadialBarChart data={customerSegments} innerRadius="22%" outerRadius="100%" startAngle={180} endAngle={0} barSize={18}>
            <PolarAngleAxis type="number" domain={[0, Math.max(...customerSegments.map((item) => item.value), 1)]} tick={false} />
            <ChartTooltip content={<ChartTooltipContent hideLabel formatter={(value) => `${value} customers`} />} />
            <RadialBar dataKey="value" background cornerRadius={10}>
              {customerSegments.map((entry) => (
                <Cell key={entry.label} fill={entry.fill} />
              ))}
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
        <div className="space-y-3">
          {customerSegments.map((item) => (
            <div key={item.label} className="rounded-lg border px-3 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <span className="text-sm text-muted-foreground">{item.value} customers</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
