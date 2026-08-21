import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@commerceos/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@commerceos/ui/chart";
import { formatNumber } from "@commerceos/shared/lib/utils";

interface RevenueOrdersMomentumChartProps {
  data: Array<{
    label: string;
    revenue: number;
    orders: number;
  }>;
}

export function RevenueOrdersMomentumChart({ data }: RevenueOrdersMomentumChartProps) {
  return (
    <Card className="xl:col-span-2">
      <CardHeader>
        <CardTitle>Revenue And Order Momentum</CardTitle>
        <CardDescription>High-level growth trend pairing monthly revenue with order volume.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            revenue: { label: "Revenue", color: "hsl(217 91% 60%)" },
            orders: { label: "Orders", color: "hsl(173 58% 39%)" },
          }}
        >
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.24} />
                <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" tickLine={false} axisLine={false} tickFormatter={(value) => `$${Math.round(value / 1000)}k`} />
            <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => (typeof value === "number" ? formatNumber(value) : String(value))} />} />
            <Bar yAxisId="left" dataKey="revenue" fill="url(#revenue-fill)" radius={[14, 14, 4, 4]} />
            <Line yAxisId="right" type="monotone" dataKey="orders" stroke="var(--color-orders)" strokeWidth={3} dot={{ r: 4, fill: "var(--color-orders)" }} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
