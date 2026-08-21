import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts";
import { fetchAnalyticsOverview } from "../../api/analytics.api";
import { LoadingState } from "@/shared/components/feedback/loading-state";
import { PageHeader } from "@/shared/components/page-header";
import { StatCard } from "@/shared/components/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/shared/ui/chart";
import { formatCurrency, formatNumber } from "@/shared/lib/utils";
import { formatAnalyticsMonth, formatAnalyticsWeek } from "../../utils/analytics-date";

const CATEGORY_COLORS = ["hsl(217 91% 60%)", "hsl(199 89% 48%)", "hsl(172 66% 50%)", "hsl(38 92% 50%)", "hsl(262 83% 58%)"];
const SEGMENT_COLORS = ["hsl(217 91% 60%)", "hsl(173 58% 39%)", "hsl(38 92% 50%)", "hsl(262 83% 58%)", "hsl(8 84% 60%)"];
const STATUS_COLORS = ["hsl(217 91% 60%)", "hsl(173 58% 39%)", "hsl(38 92% 50%)", "hsl(8 84% 60%)", "hsl(262 83% 58%)"];

function formatStatusLabel(value: string) {
  return value
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: fetchAnalyticsOverview,
  });

  if (isLoading || !data) {
    return <LoadingState label="Loading analytics..." />;
  }

  const performanceTrend = data.performanceTrend.map((item) => ({
    ...item,
    label: formatAnalyticsMonth(item.label),
  }));

  const conversionTrend = data.conversionTrend.map((item) => ({
    ...item,
    label: formatAnalyticsWeek(item.label),
  }));

  const categoryRevenue = data.categoryRevenue.map((item, index) => ({
    ...item,
    fill: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  }));

  const customerSegments = data.customerSegments.map((item, index) => ({
    ...item,
    fill: SEGMENT_COLORS[index % SEGMENT_COLORS.length],
  }));

  const orderStatusMix = data.orderStatusMix.map((item, index) => ({
    ...item,
    label: formatStatusLabel(item.label),
    fill: STATUS_COLORS[index % STATUS_COLORS.length],
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Five polished reports covering revenue momentum, funnel efficiency, merchandising mix, customer makeup, and order flow."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Revenue" value={formatCurrency(data.revenue)} detail="Paid order revenue" />
        <StatCard title="AOV" value={formatCurrency(data.aov)} detail="Average order value" />
        <StatCard title="Orders" value={formatNumber(data.orders)} detail="Total orders tracked" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
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
              <ComposedChart data={performanceTrend}>
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
                <ChartTooltip content={<ChartTooltipContent formatter={(value) => typeof value === "number" ? formatNumber(value) : String(value)} />} />
                <Bar yAxisId="left" dataKey="revenue" fill="url(#revenue-fill)" radius={[14, 14, 4, 4]} />
                <Line yAxisId="right" type="monotone" dataKey="orders" stroke="var(--color-orders)" strokeWidth={3} dot={{ r: 4, fill: "var(--color-orders)" }} />
              </ComposedChart>
            </ChartContainer>
          </CardContent>
        </Card>

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
              <LineChart data={conversionTrend}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${value}%`} />} />
                <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={3} dot={{ r: 4, fill: "var(--color-value)" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

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
      </div>
    </div>
  );
}
