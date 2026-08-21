import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@commerceos/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@commerceos/ui/chart";

const STATUS_COLORS = ["hsl(217 91% 60%)", "hsl(173 58% 39%)", "hsl(38 92% 50%)", "hsl(8 84% 60%)", "hsl(262 83% 58%)"];

function formatStatusLabel(value: string) {
  return value
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

interface OrderStatusDistributionChartProps {
  data: Array<{
    label: string;
    value: number;
  }>;
}

export function OrderStatusDistributionChart({ data }: OrderStatusDistributionChartProps) {
  const orderStatusMix = data.map((item, index) => ({
    ...item,
    label: formatStatusLabel(item.label),
    fill: STATUS_COLORS[index % STATUS_COLORS.length],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Status Distribution</CardTitle>
        <CardDescription>Current order pipeline health across all tracked states.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{ value: { label: "Orders", color: "hsl(199 89% 48%)" } }} className="h-[280px]">
          <BarChart data={orderStatusMix} layout="vertical" margin={{ left: 12 }}>
            <CartesianGrid horizontal={false} />
            <XAxis type="number" hide />
            <YAxis dataKey="label" type="category" tickLine={false} axisLine={false} width={92} />
            <ChartTooltip content={<ChartTooltipContent hideLabel formatter={(value) => `${value} orders`} />} />
            <Bar dataKey="value" radius={10}>
              {orderStatusMix.map((entry) => (
                <Cell key={entry.label} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default OrderStatusDistributionChart