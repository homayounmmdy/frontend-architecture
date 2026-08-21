import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@commerceos/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@commerceos/ui/chart";

interface ConversionEfficiencyChartProps {
  data: Array<{
    label: string;
    value: number;
  }>;
}

export function ConversionEfficiencyChart({ data }: ConversionEfficiencyChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Efficiency</CardTitle>
        <CardDescription>Weekly conversion rate trajectory for the last reporting window.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            value: { label: "Conversion Rate", color: "hsl(262 83% 58%)" },
          }}
        >
          <LineChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${value}%`} />} />
            <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={3} dot={{ r: 4, fill: "var(--color-value)" }} activeDot={{ r: 6 }} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
